import { Query } from '@/lib/query';
import { ACSMetric, Locus, Operator, Order } from '@/lib/constants';
import Results from '../components/Results';
import PowerSearch from '../components/PowerSearch';
import { Criterion, QueryData, UserFilter } from '@/lib/types';
import { enumHas } from '@/lib/utilClient';

function validateUserFilters(filters: UserFilter[]) {
  const criteria: Criterion[] = [];
  for (const filter of filters) {
    const criterion = {} as Criterion;

    if (filter.id) {
      if (!enumHas(ACSMetric, filter.id)) {
        throw new Error(`Invalid metric ID "${filter.id}"`);
      }
      criterion.id = filter.id as ACSMetric;
    } else {
      throw new Error('Missing criterion ID');
    }

    if (filter.operator) {
      if (!enumHas(Operator, filter.operator)) {
        throw new Error(`Invalid operator "${filter.operator}"`);
      }
      criterion.operator = filter.operator as Operator;
    } else {
      throw new Error('Missing criterion operator');
    }

    if (filter.threshold) {
      const threshold = parseFloat(filter.threshold as string);
      if (isNaN(threshold)) {
        throw new Error(`Invalid threshold "${filter.threshold}"`);
      }
      criterion.threshold = threshold;
    } else {
      throw new Error('Missing criterion threshold');
    }

    if (filter.order) {
      if (!enumHas(Order, filter.order)) {
        throw new Error(`Invalid order "${filter.order}"`);
      }
      criterion.order = filter.order as Order;
    }

    criteria.push(criterion);
  }
  return criteria;
}

async function getResults(params: Record<string, string>) {
  let locus = Locus.City;
  if (params.locus) {
    if (params.locus === Locus.ZIP) {
      locus = Locus.ZIP;
    } else if (params.locus === Locus.City) {
      locus = Locus.City;
    } else if (params.locus === Locus.County) {
      locus = Locus.County;
    } else if (params.locus === Locus.State) {
      locus = Locus.State;
    }
  }

  const filterMap: Record<string, UserFilter> = {};

  const setValue = (key: keyof UserFilter, index: string, value: string) => {
    if (!filterMap[index]) {
      filterMap[index] = {} as UserFilter;
    }
    filterMap[index][key] = value;
  };

  for (const _key in params) {
    const _index = _key.search(/(?<=^[a-z]+)\d+$/);
    if (_index < 0) {
      continue;
    }

    const value = params[_key];
    const key = _key.slice(0, _index);
    const index = _key.slice(_index);

    setValue(key as keyof UserFilter, index, value);
  }

  const criteria = validateUserFilters(Object.values(filterMap));
  const queryData: QueryData = {
    locus,
    criteria,
  };
  const results = criteria.length ? await Query.run(queryData) : null;
  return { results, queryData };
}

export default async function Search({ searchParams }: { searchParams: any }) {
  let results = null;
  let queryData = null;
  if (Object.keys(searchParams).length) {
    ({ results, queryData } = await getResults(searchParams));
  }
  return (
    <div>
      <PowerSearch queryData={queryData} />
      {results?.length ? (
        <>
          <div className='flex justify-between border-b'>
            <div className='text-xl'>Results</div>
            <div className='text-stone-500'>1-10 of {results.length}</div>
          </div>
          <Results queryData={queryData} results={results} />
        </>
      ) : (
        ''
      )}
    </div>
  );
}
