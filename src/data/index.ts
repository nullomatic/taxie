import { Command, OptionValues } from 'commander';
import { populateDatabase } from './db';
import { logger } from '../lib/utilServer.js';
import { Query } from '../lib/query';
import { ACSMetric, Attribute, Locus, Operator, Order } from '../lib/constants';

main()
  .then(() => process.exit())
  .catch((error: Error) => {
    logger.error(error.message);
    console.error(error.stack);
    process.exit();
  });

async function main() {
  const options = parseOptions();
  if (options.verbose) {
    logger.transports[0].level = 'verbose';
  }
  if (options.populate) {
    await populateDatabase();
  }
  if (options.misc) {
    const queryData = {
      locus: Locus.City,
      criteria: [
        {
          id: ACSMetric.TotalPopulation,
          label: 'total_pop',
          aggregate: Attribute[ACSMetric.TotalPopulation].aggregate,
          operator: Operator.GreaterThan,
          threshold: 10000,
          order: Order.Descending,
        },
        {
          id: ACSMetric.PercentPopulationWhite,
          label: 'white_percent',
          aggregate: Attribute[ACSMetric.PercentPopulationWhite].aggregate,
          operator: Operator.GreaterThan,
          threshold: 90,
          order: Order.Descending,
        },
        {
          id: ACSMetric.MedianIncome,
          label: 'median_income',
          aggregate: Attribute[ACSMetric.MedianIncome].aggregate,
          operator: Operator.GreaterThan,
          threshold: 50000,
          order: Order.Descending,
        },
      ],
    };
    await Query.run(queryData);
  }
}

function parseOptions(): OptionValues {
  const program = new Command();
  program.option('-v, --verbose', 'Verbose logging level');
  program.option('--populate', 'Populate database');
  program.option('--misc', 'Run misc function');
  program.parse(process.argv);
  return program.opts();
}
