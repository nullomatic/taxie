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
  StateBrackets_US,
  US_States,
} from './constants';
import { Options, DE_Options, US_Options } from './types';
import _ from 'lodash';
import { formatNumber, logRows } from './utilClient';
import {
  BAS,
  getBasicPay,
  getCategoryByRank,
} from '../countries/US/military/constants';

class Account {
  day = 1;
  apy = 0.05;
  schedule = Schedule.Quarterly;
  balance = 0;

  stat = {
    interestYear: 0,
    interestTotal: 0,
    depositsYear: 0,
    depositsTotal: 0,
    withdrawalsYear: 0,
    withdrawalsTotal: 0,
  };

  constructor(options: Options) {
    if (typeof options.apy === 'number') {
      this.apy = _.clamp(options.apy, 0, 1);
    }
    if (typeof options.principle === 'number') {
      this.balance = options.principle;
    }
    if (options.compoundingSchedule) {
      this.schedule = options.compoundingSchedule;
    }
  }

  tick() {
    if (this.day % Math.floor(DAYS_IN_YEAR / this.schedule) === 0) {
      this.compound();
    }
    this.day++;
  }

  deposit(amount: number) {
    if (amount < 0) {
      throw new Error(`Cannot deposit negative amount`);
    }
    this.balance += amount;
    this.stat.depositsYear += amount;
  }

  withdraw(amount: number) {
    if (amount < 0) {
      throw new Error(`Cannot withdraw negative amount`);
    }
    this.balance -= amount;
    this.stat.withdrawalsYear += amount;
  }

  compound() {
    if (this.balance <= 0) {
      return 0;
    }
    const interest = (this.balance * this.apy) / this.schedule;
    this.balance += interest;
    this.stat.interestYear += interest;
    this.stat.interestTotal += interest;
    return interest;
  }

  recap() {
    const stat = _.clone(this.stat);
    this.stat.interestYear = 0;
    this.stat.depositsYear = 0;
    this.stat.withdrawalsYear = 0;
    return stat;
  }
}

abstract class Calculator {
  depositSchedule = Schedule.Biweekly;
  inflationRate = 0.04;
  years = 10;
  currentYear = 0;
  expenses: Options['expenses'] = [];
  account: Account;

  abstract title: string;
  abstract currency: Currency;

  constructor(options: Options) {
    this.account = new Account(options);

    if (options.depositSchedule) {
      this.depositSchedule = options.depositSchedule;
    }
    if (typeof options.inflationRate === 'number') {
      this.inflationRate = options.inflationRate;
    }
    if (typeof options.years === 'number') {
      this.years = options.years;
    }
    if (options.expenses) {
      this.expenses = options.expenses;
    }
  }

  abstract getIncome(): { incomeTaxable: number; incomeExempt: number };
  abstract calculateTax(incomeGross: number): number;

  run() {
    const sym = CurrencySymbol[this.currency];

    // logRows([
    //   `Title:             "${this.title}"`,
    //   // `Salary:            ${sym} ${formatNumber(this.salary)}`,
    //   // `Principle:         ${sym} ${formatNumber(this.principle)}`,
    //   // `APY:               ${this.apy * 100} %`,
    //   `Years:             ${this.years}`,
    //   `Deposit %:         ${this.depositPercent * 100} %`,
    //   `Deposit sch.:      ${getKeyByValue(Schedule, this.depositSchedule)}`,
    //   // `Compounding sch.:  ${getKeyByValue(Schedule, this.compoundingSchedule)}`,
    //   //`Filing status:     ${getKeyByValue(FilingStatus, filingStatus)}`,
    //   `Inflation rate:    ${this.inflationRate * 100} %`,
    //   ``,
    // ]);

    // Years are 0-indexed.
    // Days are 1-indexed.

    const log = [];

    while (this.currentYear < this.years) {
      const { incomeTaxable, incomeExempt } = _.mapValues(
        this.getIncome(),
        this.applyInflation
      );
      const incomeCombined = incomeTaxable + incomeExempt;
      const depositAmount = incomeCombined / this.depositSchedule;
      const expensesMonth = this.applyInflation(this.sumExpenses());
      const expensesYear = expensesMonth * 12;
      const expenseAmount =
        expensesMonth / (this.depositSchedule / Schedule.Monthly);

      for (let day = 1; day <= DAYS_IN_YEAR; day++) {
        if (day % Math.floor(DAYS_IN_YEAR / this.depositSchedule) === 0) {
          const diff = depositAmount - expenseAmount;
          if (diff >= 0) {
            this.account.deposit(diff);
          } else {
            this.account.withdraw(Math.abs(diff));
          }
        }
        this.account.tick();
      }

      const { interestYear, depositsYear, withdrawalsYear } =
        this.account.recap();

      const incomeGross = incomeTaxable + incomeExempt + interestYear;
      const tax = this.calculateTax(incomeGross);
      const incomeNet = incomeGross - tax - expensesYear;
      const effectiveTaxRate = tax / incomeGross;

      this.account.withdraw(tax); // Everyone's favorite part

      // logRows([
      //   `Year-end ${this.currentYear + 1} ---------------------`,
      //   `  Income taxable:          ${sym} ${formatNumber(incomeTaxable)}`,
      //   `  Income exempt:           ${sym} ${formatNumber(incomeExempt)}`,
      //   `  Interest:                ${sym} ${formatNumber(interestYear)}`,
      //   `  Income gross:            ${sym} ${formatNumber(incomeGross)}`,
      //   `  Income net:              ${sym} ${formatNumber(incomeNet)}`,
      //   `  Expenses:               (${sym} ${formatNumber(expensesYear)})`,
      //   `  Tax:                    (${sym} ${formatNumber(tax)})`,
      //   `  Account:                 ${sym} ${formatNumber(
      //     this.account.balance
      //   )}`,
      //   `  Effective rate:          % ${(effectiveTaxRate * 100).toFixed(1)}`,
      // ]);

      log.push({
        year: this.currentYear + 1,
        incomeTaxable,
        incomeExempt,
        incomeGross,
        incomeNet,
        expensesYear,
        tax,
        depositsYear,
        withdrawalsYear,
      });

      // TODO: handle inflation rate

      this.currentYear++;
    }

    // logRows([
    //   ``,
    //   `------------------------------------`,
    //   `Final account balance: ${sym} ${formatNumber(this.account.balance)}`,
    //   ``,
    // ]);

    return {
      log,
      finalBalance: this.account.balance,
    };
  }

  sumExpenses() {
    if (this.expenses) {
      return this.expenses.reduce((acc, cur) => acc + cur.amount, 0);
    }
    return 0;
  }

  applyInflation = (amount: number) => {
    // Must be arrow function to allow access to child `this`
    return Math.pow(1 + this.inflationRate, this.currentYear) * amount;
  };
}

export class US_Calculator extends Calculator {
  state: US_States;
  currency = Currency.USD;
  filingStatus = FilingStatus_US.Single;
  title = `Option ${CountryCode.US}`;
  salary: US_Options['salary'];
  military: US_Options['military'];

  static FilingStatus = FilingStatus_US;
  static FederalBrackets = FederalBrackets_US;
  static StateBrackets = StateBrackets_US;
  static FICA = 0.0765;

  constructor(options: US_Options) {
    super(options);
    if (options.salary !== undefined) {
      this.salary = options.salary;
    }
    if (options.military !== undefined) {
      this.military = options.military;
    }
    if (typeof options.currency === 'number') {
      this.currency = options.currency;
    }
    if (options.filingStatus) {
      this.filingStatus = options.filingStatus;
    }
    if (options.title) {
      this.title = options.title;
    }
    this.state = options.state;
  }

  getIncome() {
    if (this.salary !== undefined) {
      return { incomeTaxable: this.salary, incomeExempt: 0 };
    } else if (this.military) {
      const { rank, serviceTime, location, dependents } = this.military;

      const mha = this.military.mhaJSON[location];
      const category = getCategoryByRank(rank);
      const basicPay = getBasicPay(rank, serviceTime) * 12;
      const bah = this.military.bahJSON[mha][rank] * 12;
      const bas = BAS[category] * 12;

      return { incomeTaxable: basicPay, incomeExempt: bah + bas };
    } else {
      throw new Error(
        `Cannot get income: Missing both 'salary' and 'military' option fields`
      );
    }
  }

  calculateTax(incomeGross: number) {
    let taxFederal = 0;
    let taxState = 0;
    let taxFICA = incomeGross * US_Calculator.FICA;

    const federal = US_Calculator.FederalBrackets[this.filingStatus];
    const state = (US_Calculator.StateBrackets[this.state] as any)[ // TODO: add HoH etc state filing status
      this.filingStatus
    ];

    const agiFederal = incomeGross - federal.deduction;
    for (const bracket of federal.brackets) {
      const min = this.applyInflation(bracket.min);
      const max = this.applyInflation(bracket.max);
      if (agiFederal > min) {
        const taxableIncome = Math.min(agiFederal, max) - min;
        const tax = taxableIncome * (bracket.rate / 100);
        taxFederal += tax;
      }
    }

    const agiState = incomeGross - state.deduction;
    for (const bracket of state.brackets) {
      const min = this.applyInflation(bracket.min);
      const max = this.applyInflation(bracket.max);
      if (agiState > min) {
        const taxableIncome = Math.min(agiState, max) - min;
        const tax = taxableIncome * (bracket.rate / 100);
        taxState += tax;
      }
    }

    return taxFederal + taxState + taxFICA;
  }
}

export class DE_Calculator extends Calculator {
  currency = Currency.EUR;
  filingStatus = FilingStatus_DE.SteuerklasseI;
  title = `Option ${CountryCode.DE}`;
  salary: DE_Options['salary'];
  soliThreshold = 18130;
  soliPercent = 0.055;

  static FilingStatus = FilingStatus_DE;
  static FederalBrackets = FederalBrackets_DE;

  constructor(options: DE_Options) {
    super(options);
    this.salary = options.salary;
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
      this.soliPercent = _.clamp(options.soliPercent, 0, 1);
    }
  }

  getIncome() {
    return { incomeTaxable: this.salary, incomeExempt: 0 };
  }

  calculateTax(incomeGross: number) {
    let taxFederal = 0;

    const { deduction, brackets } =
      DE_Calculator.FederalBrackets[this.filingStatus];

    const agi = incomeGross - deduction;
    for (const bracket of brackets) {
      const min = this.applyInflation(bracket.min);
      const max = this.applyInflation(bracket.max);
      if (agi > min) {
        const taxableIncome = Math.min(agi, max) - min;
        let rate;
        if (typeof bracket.rate === 'object') {
          const rateMax = (bracket.rate as { min: number; max: number }).max;
          const rateMin = (bracket.rate as { min: number; max: number }).min;
          if (agi > max) {
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
        taxFederal += taxableIncome * (rate / 100);
      }
    }

    const soliThreshold =
      this.filingStatus === FilingStatus_DE.SteuerklasseI ||
      this.filingStatus === FilingStatus_DE.SteuerklasseII ||
      this.filingStatus === FilingStatus_DE.SteuerklasseVI
        ? this.soliThreshold
        : this.soliThreshold * 2;

    if (taxFederal >= soliThreshold) {
      taxFederal *= 1 + this.soliPercent;
    }

    return taxFederal;
  }
}
