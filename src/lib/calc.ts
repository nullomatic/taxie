import { US_MilitaryRank } from '../countries/US/military/constants';
import { DE_Calculator, US_Calculator } from './calculators';
import { CountryCode, FilingStatus_US, Schedule, US_States } from './constants';
import { Options } from './types';
import _ from 'lodash';
import { readJSON } from './utilServer';

main({
  country: CountryCode.US,
  military: {
    rank: US_MilitaryRank['O-6'],
    serviceTime: 5,
    location: 94949,
    dependents: false,
    bahJSON: readJSON(`/countries/US/military/mha-to-bah-with.json`),
    mhaJSON: readJSON(`/countries/US/military/zip-to-mha.json`),
  },
  years: 1,
  expenses: [
    { name: 'rent', amount: 1400 },
    { name: 'food', amount: 500 },
    { name: 'car', amount: 250 },
    { name: 'fun', amount: 150 },
  ],
  state: US_States.IN,
});

async function main(...optionsArray: Options[]) {
  for (const options of optionsArray) {
    const Calculator = getCalculator(options);
    const f = Calculator.run();
    console.log(f);
  }
}

function getCalculator(options: Options) {
  switch (options.country) {
    case CountryCode.US:
      return new US_Calculator(options);
    case CountryCode.DE:
      return new DE_Calculator(options);
  }
}
