export const DAYS_IN_YEAR = 365;
export const AVG_INFLATION_RATE = 0.04;

export enum CountryCode {
  US = 'US',
  DE = 'DE',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
}

export const CurrencySymbol = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
};

export const CurrencyMap = {
  [CountryCode.US]: Currency.USD,
  [CountryCode.DE]: Currency.EUR,
};

export const ExchangeRates = {
  [Currency.USD]: 1,
  [Currency.EUR]: 1.09,
};

export enum Schedule {
  Yearly = 1,
  Biannually = 2,
  Quarterly = 4,
  Bimonthly = 6,
  Monthly = 12,
  Biweekly = 24,
  Weekly = 52,
  Daily = 365,
}

export enum FilingStatus_US {
  Single,
  MarriedFilingJointly,
  MarriedFilingSeparately,
  HeadOfHousehold,
}

export const FederalBrackets_US = {
  [FilingStatus_US.Single]: {
    deduction: 14600,
    brackets: [
      { min: 0, max: 11600, rate: 10 },
      { min: 11600, max: 47150, rate: 12 },
      { min: 47150, max: 100525, rate: 22 },
      { min: 100525, max: 191950, rate: 24 },
      { min: 191950, max: 243725, rate: 32 },
      { min: 243725, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 },
    ],
  },
  [FilingStatus_US.MarriedFilingJointly]: {
    deduction: 29200,
    brackets: [
      { min: 0, max: 23200, rate: 10 },
      { min: 23200, max: 94300, rate: 12 },
      { min: 94300, max: 201050, rate: 22 },
      { min: 201050, max: 383900, rate: 24 },
      { min: 383900, max: 487450, rate: 32 },
      { min: 487450, max: 731200, rate: 35 },
      { min: 731200, max: Infinity, rate: 37 },
    ],
  },
  [FilingStatus_US.MarriedFilingSeparately]: {
    deduction: 14600,
    brackets: [
      { min: 0, max: 11600, rate: 10 },
      { min: 11600, max: 47150, rate: 12 },
      { min: 47150, max: 100525, rate: 22 },
      { min: 100525, max: 191950, rate: 24 },
      { min: 191950, max: 243725, rate: 32 },
      { min: 243725, max: 365600, rate: 35 },
      { min: 365600, max: Infinity, rate: 37 },
    ],
  },
  [FilingStatus_US.HeadOfHousehold]: {
    deduction: 21900,
    brackets: [
      { min: 0, max: 16550, rate: 10 },
      { min: 16550, max: 63100, rate: 12 },
      { min: 63100, max: 100500, rate: 22 },
      { min: 100500, max: 191950, rate: 24 },
      { min: 191950, max: 243700, rate: 32 },
      { min: 243700, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 },
    ],
  },
};

export enum FilingStatus_DE {
  SteuerklasseI,
  SteuerklasseII,
  SteuerklasseIII,
  SteuerklasseIV,
  SteuerklasseV,
  SteuerklasseVI,
}

export const FederalBrackets_DE = {
  /*
   * Single individuals without children
   */
  [FilingStatus_DE.SteuerklasseI]: {
    deduction: 10908,
    brackets: [
      { min: 0, max: 11604, rate: 0 },
      { min: 11604, max: 17005, rate: { min: 14, max: 24 } },
      { min: 17005, max: 66760, rate: { min: 24, max: 42 } },
      { min: 66760, max: 277826, rate: 42 },
      { min: 277826, max: Infinity, rate: 45 },
    ],
  },

  /*
   * Single parents with at least one child
   */
  [FilingStatus_DE.SteuerklasseII]: {
    deduction: 10908,
    brackets: [
      { min: 0, max: 11604, rate: 0 },
      { min: 11604, max: 17005, rate: { min: 14, max: 24 } },
      { min: 17005, max: 66760, rate: { min: 24, max: 42 } },
      { min: 66760, max: 277826, rate: 42 },
      { min: 277826, max: Infinity, rate: 45 },
    ],
  },

  /*
   * Married individuals with a spouse who is in Tax Class V or without income
   */
  [FilingStatus_DE.SteuerklasseIII]: {
    deduction: 21816,
    brackets: [
      { min: 0, max: 23208, rate: 0 },
      { min: 23208, max: 34010, rate: { min: 14, max: 24 } },
      { min: 34010, max: 133520, rate: { min: 24, max: 42 } },
      { min: 133520, max: 555650, rate: 42 },
      { min: 555650, max: Infinity, rate: 45 },
    ],
  },

  /*
   * Married individuals where both spouses have similar incomes
   */
  [FilingStatus_DE.SteuerklasseIV]: {
    deduction: 10908,
    brackets: [
      { min: 0, max: 11604, rate: 0 },
      { min: 11604, max: 17005, rate: { min: 14, max: 24 } },
      { min: 17005, max: 66760, rate: { min: 24, max: 42 } },
      { min: 66760, max: 277826, rate: 42 },
      { min: 277826, max: Infinity, rate: 45 },
    ],
  },

  /*
   * Married individuals with a spouse in Tax Class III
   */
  [FilingStatus_DE.SteuerklasseV]: {
    deduction: 0,
    brackets: [
      { min: 0, max: 11604, rate: 0 },
      { min: 11604, max: 17005, rate: { min: 14, max: 24 } },
      { min: 17005, max: 66760, rate: { min: 24, max: 42 } },
      { min: 66760, max: 277826, rate: 42 },
      { min: 277826, max: Infinity, rate: 45 },
    ],
  },

  /*
   * Individuals with multiple jobs
   */
  [FilingStatus_DE.SteuerklasseVI]: {
    deduction: 0,
    brackets: [
      { min: 0, max: 11604, rate: 0 },
      { min: 11604, max: 17005, rate: { min: 14, max: 24 } },
      { min: 17005, max: 66760, rate: { min: 24, max: 42 } },
      { min: 66760, max: 277826, rate: 42 },
      { min: 277826, max: Infinity, rate: 45 },
    ],
  },
};
