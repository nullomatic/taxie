import { Calculator_DE, Calculator_US } from './calculators';
import { CountryCode } from './constants';
import { Options } from './types';

function getCalculator(options: Options) {
  switch (options.country) {
    case CountryCode.US:
      return new Calculator_US(options);
    case CountryCode.DE:
      return new Calculator_DE(options);
  }
}

function main(...optionsArray: Options[]) {
  for (const options of optionsArray) {
    const Calculator = getCalculator(options);
    Calculator.run();
  }
}

const basicPay = 3826.2;
const BAH = 1830.0;
const BAS = 316.98;

// const taxableIncome = basicPay;

// const rateFederal = 0.012;
// const rateFICA = 0.0765;

// const taxLiability = taxableIncome * rateFederal + taxableIncome * rateFICA;

const navyGrossIncome = basicPay + BAH + BAS;
const navyGrossAnnualIncome = navyGrossIncome * 12;
// const netMonthlyIncome = grossIncome - taxLiability;
// const netAnnualIncome = netMonthlyIncome * 12;
// const netBiweeklyIncome = netMonthlyIncome / 2;

// const berlinBrutto = 85000;
// const berlinNetto = 55765.98;
// const berlinNettoMonatlich = 4647.17;
// const berlinNettoZweiwoch = berlinNettoMonatlich / 2;

main(
  {
    title: 'Berlin',
    country: CountryCode.DE,
    salary: 85000,
    depositPercent: 0.5,
    years: 2,
  }
  // {
  //   title: 'Navy',
  //   country: CountryCode.US,
  //   salary: navyGrossAnnualIncome,
  //   depositPercent: 0.655,
  //   years: 5,
  // }
);
