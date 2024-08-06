import {
  CountryCode,
  Currency,
  CurrencySymbol,
  DAYS_IN_YEAR,
  FederalBrackets_DE,
  FederalBrackets_US,
  FilingStatus_DE,
  FilingStatus_US,
  Schedule,
} from './constants';
import { Options, Options_DE, Options_US } from './types';
import _ from 'lodash';

abstract class Calculator {
  /*
   * Required properties
   */
  salary: number;

  /*
   * Default properties
   */
  principle = 0;
  apy = 0.05;
  depositPercent = 0.33;
  depositSchedule = Schedule.Biweekly;
  compoundingSchedule = Schedule.Quarterly;
  inflationRate = 0.04;
  years = 10;

  /*
   * Properties set by child class
   */
  abstract title: string;
  abstract currency: Currency;

  constructor(options: Options) {
    if (!options.salary) {
      throw new Error(`Option "salary" is required`);
    }
    this.salary = options.salary;

    if (typeof options.principle === 'number') {
      this.principle = options.principle;
    }
    if (typeof options.apy === 'number') {
      this.apy = this.clamp(options.apy, 0, 1, 'apy');
    }
    if (typeof options.depositPercent === 'number') {
      // prettier-ignore
      this.depositPercent = this.clamp(options.depositPercent, 0, 1, 'depositPercent');
    }
    if (options.depositSchedule) {
      this.depositSchedule = options.depositSchedule;
    }
    if (options.compoundingSchedule) {
      this.compoundingSchedule = options.compoundingSchedule;
    }
    if (typeof options.inflationRate === 'number') {
      this.inflationRate = options.inflationRate;
    }
    if (typeof options.years === 'number') {
      this.years = options.years;
    }
  }

  abstract calculate(agi: number, year: number): number;

  run() {
    const sym = CurrencySymbol[this.currency];

    logRows([
      `Title:             "${this.title}"`,
      `Salary:            ${sym} ${format(this.salary)}`,
      `Principle:         ${sym} ${format(this.principle)}`,
      `APY:               ${this.apy * 100} %`,
      `Years:             ${this.years}`,
      `Deposit %:         ${this.depositPercent * 100} %`,
      `Deposit sch.:      ${getKeyByValue(Schedule, this.depositSchedule)}`,
      `Compounding sch.:  ${getKeyByValue(Schedule, this.compoundingSchedule)}`,
      //`Filing status:     ${getKeyByValue(FilingStatus, filingStatus)}`,
      `Inflation rate:    ${this.inflationRate * 100} %`,
      ``,
    ]);

    let accountBalance = this.principle;
    let totalInterestEarned = 0;
    let totalContributions = 0;
    let totalTaxPaid = 0;

    for (let year = 1; year <= this.years; year++) {
      const depositAmount =
        (this.salary * this.depositPercent) / this.depositSchedule;

      let grossIncome = this.salary;
      let totalInterestYear = 0;
      let totalContributionsYear = 0;

      for (let day = 1; day < DAYS_IN_YEAR; day++) {
        if (day % Math.floor(DAYS_IN_YEAR / this.compoundingSchedule) === 0) {
          const interestEarned =
            (accountBalance * this.apy) / this.compoundingSchedule;
          grossIncome += interestEarned;
          accountBalance += interestEarned;
          totalInterestEarned += interestEarned;
          totalInterestYear += interestEarned;
        }
        if (day % Math.floor(DAYS_IN_YEAR / this.depositSchedule) === 0) {
          //console.log(`depositing ${sym} ${format(depositAmount)} on day ${day}`);
          accountBalance += depositAmount;
          totalContributions += depositAmount;
          totalContributionsYear += depositAmount;
        }
      }

      const tax = this.calculate(grossIncome, year);

      const remainder = this.salary - totalContributionsYear - tax;
      const netIncome = grossIncome - tax;
      const effectiveTaxRate = tax / grossIncome;

      //accountBalance -= tax;
      totalTaxPaid += tax;

      logRows([
        `Year-end ${year} ---------------------`,
        `  Salary:          ${sym} ${format(this.salary)}`,
        `  Contrib:         ${sym} ${format(totalContributionsYear)}`,
        `  Remainder:       ${sym} ${format(remainder)}`,
        `  Tax:            (${sym} ${format(tax)})`,
        `  Account:         ${sym} ${format(accountBalance)}`,
        `  Effective rate:  % ${(effectiveTaxRate * 100).toFixed(1)}`,
      ]);

      this.salary *= 1 + this.inflationRate; // TODO: Maybe don't change this.salary in-place
    }

    const accountGross = totalContributions + totalInterestEarned;

    logRows([
      ``,
      `Account gross:         ${sym} ${format(accountGross)}`,
      `Total tax paid:        ${sym} ${format(totalTaxPaid)}`,
      `------------------------------------`,
      `Final account balance: ${sym} ${format(accountBalance)}`,
      ``,
    ]);
  }

  clamp(num: number, min: number, max: number, property: string) {
    if (num < min || num > max) {
      const clamped = _.clamp(num, min, max);
      console.warn(
        `Warn: ${property} "${num}" out of range. Clamping to ${clamped}`
      );
      num = clamped;
    }
    return num;
  }
}

export class Calculator_US extends Calculator {
  currency = Currency.USD;
  filingStatus = FilingStatus_US.Single;
  title = `Option ${CountryCode.US}`;

  static FilingStatus = FilingStatus_US;
  static FederalBrackets = FederalBrackets_US;

  constructor(options: Options_US) {
    super(options);
    if (typeof options.currency === 'number') {
      this.currency = options.currency;
    }
    if (options.filingStatus) {
      this.filingStatus = options.filingStatus;
    }
    if (options.title) {
      this.title = options.title;
    }
  }

  calculate(grossIncome: number, year: number) {
    let tax = 0;
    const { deduction, brackets } =
      Calculator_US.FederalBrackets[this.filingStatus];
    const agi = grossIncome - deduction;
    for (const bracket of brackets) {
      const min = bracket.min * Math.pow(1 + this.inflationRate, year - 1);
      const max = bracket.max * Math.pow(1 + this.inflationRate, year - 1);
      if (agi > min) {
        const taxableIncome = Math.min(agi, max) - min;
        const rate = bracket.rate;
        tax += taxableIncome * (rate / 100);
      }
    }
    return tax;
  }
}

export class Calculator_DE extends Calculator {
  currency = Currency.EUR;
  filingStatus = FilingStatus_DE.SteuerklasseI;
  title = `Option ${CountryCode.DE}`;
  soliThreshold = 18130;
  soliPercent = 0.055;

  static FilingStatus = FilingStatus_DE;
  static FederalBrackets = FederalBrackets_DE;

  constructor(options: Options_DE) {
    super(options);
    if (typeof options.currency === 'number') {
      this.currency = options.currency;
    }
    if (options.filingStatus) {
      this.filingStatus = options.filingStatus;
    }
    if (options.title) {
      this.title = options.title;
    }
    if (typeof options.soliThreshold === 'number') {
      this.soliThreshold = options.soliThreshold;
    }
    if (typeof options.soliPercent === 'number') {
      this.soliPercent = this.clamp(options.soliPercent, 0, 1, 'soliPercent');
    }
  }

  calculate(grossIncome: number, year: number) {
    let tax = 0;
    const { deduction, brackets } =
      Calculator_DE.FederalBrackets[this.filingStatus];
    const adjustedIncome = grossIncome - deduction;
    for (const bracket of brackets) {
      const min = bracket.min * Math.pow(1 + this.inflationRate, year - 1);
      const max = bracket.max * Math.pow(1 + this.inflationRate, year - 1);
      if (adjustedIncome > min) {
        const taxableIncome = Math.min(adjustedIncome, max) - min;
        let rate;
        if (typeof bracket.rate === 'object') {
          const rateMax = (bracket.rate as { min: number; max: number }).max;
          const rateMin = (bracket.rate as { min: number; max: number }).min;
          if (adjustedIncome > max) {
            rate = rateMax;
          } else {
            rate =
              rateMin + (taxableIncome / (max - min)) * (rateMax - rateMin);
          }
        } else if (typeof bracket.rate === 'number') {
          rate = bracket.rate;
        } else {
          throw new Error(`Misconfigured tax bracket rate "${bracket.rate}"`);
        }
        tax += taxableIncome * (rate / 100);
      }
    }

    const soliThreshold =
      this.filingStatus === FilingStatus_DE.SteuerklasseI ||
      this.filingStatus === FilingStatus_DE.SteuerklasseII ||
      this.filingStatus === FilingStatus_DE.SteuerklasseVI
        ? this.soliThreshold
        : this.soliThreshold * 2;

    if (tax >= soliThreshold) {
      tax *= 1 + this.soliPercent;
    }

    return tax;
  }
}

// function usd(currency: Currency, amount: number) {
//   // TODO
//   return amount * ExchangeRates[currency];
// }

function format(num: number) {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function logRows(rows: string[]) {
  console.log(rows.join('\n'));
}

function getKeyByValue(obj: any, value: number): string | undefined {
  return Object.keys(obj).find((key) => obj[key] === value);
}
