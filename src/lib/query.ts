import _ from 'lodash';
import { DatabaseClient } from '../lib/client';
import { format as sqlFormat } from 'sql-formatter';
import { Criterion, QueryData } from './types';
import { ACSMetric, ACSMetricData, Aggregate, Locus } from './constants';
import { logger } from './utilServer';

export class Query {
  private constructor() {}

  public static async run(query: QueryData) {
    const client = await DatabaseClient.getClient();
    let sql;
    if (query.locus === Locus.ZIP) {
      sql = this.buildQuery(query);
    } else {
      sql = this.buildAggregateQuery(query);
    }

    sql += ' LIMIT 12 OFFSET 0';

    const formatted = sqlFormat(sql, { language: 'postgresql' });
    logger.verbose(`\n${formatted}`);

    // TODO: Index ACS metrics to reduce long "order by" times?

    const res = await client.query(sql);
    return res.rows;
  }

  private static buildQuery(queryData: QueryData) {
    const _with = [];
    const _select = [];
    const _join = [];
    const _order = [];

    for (let i = 0; i < queryData.criteria.length; i++) {
      const c = queryData.criteria[i];
      if (!c.label) {
        c.label = c.id;
      }
      const id = `C${i}`;
      _with.push(
        `${id} AS (SELECT zip_code, estimate FROM acs_metric WHERE id = '${c.id}' AND estimate ${c.operator} ${c.threshold})`
      );
      _select.push(`${id}.estimate AS ` + c.label);
      if (i > 0) {
        _join.push(`JOIN ${id} ON C0.zip_code = ${id}.zip_code`);
      }
      if (c.order) {
        _order.push(`${id}.estimate ${c.order.toUpperCase()}`);
      }
    }

    const sql = [
      'WITH',
      _with.join(', '),
      'SELECT',
      'geo.city_name,',
      'geo.county_name,',
      'geo.state_id,',
      'geo.zip_code,',
      _select.join(', '),
      'FROM C0',
      _join.join(' '),
      'JOIN zip geo ON C0.zip_code = geo.zip_code',
      _order.length ? 'ORDER BY ' + _order.join(', ') : '',
    ].join(' ');

    return sql;
  }

  private static buildAggregateQuery(queryData: QueryData) {
    const selectors = ['state_id'];
    if (queryData.locus === Locus.County) {
      selectors.unshift('county_name');
    }
    if (queryData.locus === Locus.City) {
      selectors.unshift('city_name', 'county_name');
    }

    const _with: string[] = [];
    const _select = selectors.map((s) => `C0.${s}`);
    const _join: string[] = [];
    const _where: string[] = [];
    const _order: string[] = [];

    const processCriterion = (c: Criterion, id: string, addWhere = true) => {
      if (!c.label) {
        c.label = c.id;
      }

      const geo = selectors.map((s) => `geo.${s}`).join(', ');
      const subselect = [geo];
      const aggregate = ACSMetricData[c.id].aggregate;

      if (aggregate === Aggregate.Sum) {
        subselect.push(`SUM(acs_metric.estimate) AS ${c.label}`);
      }
      if (aggregate === Aggregate.Average) {
        subselect.push(
          `ROUND(AVG(acs_metric.estimate)::NUMERIC, 2) AS ${c.label}`
        );
      }

      if (aggregate === Aggregate.WeightedAverage) {
        subselect.push(
          `ROUND((SUM(p.estimate * e.estimate) / NULLIF(SUM(e.estimate), 0))::NUMERIC, 1) AS ${c.label}`
        );
        const estimateId = c.id.replace(/PE$/, 'E');
        _with.push(
          `${id} AS (SELECT ${subselect.join(', ')} ` +
            `FROM acs_metric p JOIN acs_metric e ON p.zip_code = e.zip_code AND p.id = '${c.id}' AND e.id = '${estimateId}' ` +
            `JOIN zip geo ON geo.zip_code = p.zip_code ` +
            `WHERE p.id = '${c.id}' GROUP BY ${geo})`
        );
      } else {
        _with.push(
          `${id} AS (SELECT ${subselect.join(', ')} ` +
            `FROM acs_metric JOIN zip geo ON geo.zip_code = acs_metric.zip_code ` +
            `WHERE acs_metric.id = '${c.id}' GROUP BY ${geo})`
        );
      }

      _select.push(`${id}.${c.label} AS "${c.label}"`);

      if (id !== 'C0') {
        _join.push(
          `JOIN ${id} ON ${selectors
            .map((s) => `${id}.${s} = C0.${s}`)
            .join(' AND ')}`
        );
      }

      if (c.operator) {
        _where.push(`${id}.${c.label} ${c.operator} ${c.threshold}`);
      }

      if (c.order) {
        _order.push(`${c.label} ${c.order.toUpperCase()}`);
      }
    };

    let i = 0;
    while (i < queryData.criteria.length) {
      processCriterion(queryData.criteria[i], `C${i}`);
      i++;
    }

    if (!queryData.criteria.find((c) => c.id === ACSMetric.MedianIncome)) {
      processCriterion(
        {
          id: ACSMetric.MedianIncome,
        } as Criterion,
        `C${i++}`
      );
    }
    if (!queryData.criteria.find((c) => c.id === ACSMetric.TotalPopulation)) {
      processCriterion(
        {
          id: ACSMetric.TotalPopulation,
        } as Criterion,
        `C${i++}`
      );
    }

    const sql = [
      'WITH',
      _with.join(', '),
      'SELECT',
      _select.join(', '),
      'FROM C0',
      _join.join(' '),
      `WHERE`,
      _where.join(' AND '),
      _order.length ? 'ORDER BY ' + _order.join(', ') : '',
    ].join(' ');

    return sql;
  }
}
