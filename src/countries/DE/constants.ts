export enum DE_FilingStatus {
  SteuerklasseI = 'SteuerklasseI',
  SteuerklasseII = 'SteuerklasseII',
  SteuerklasseIII = 'SteuerklasseIII',
  SteuerklasseIV = 'SteuerklasseIV',
  SteuerklasseV = 'SteuerklasseV',
  SteuerklasseVI = 'SteuerklasseVI',
}

export const DE_FederalBrackets = {
  /*
   * Single individuals without children
   */
  [DE_FilingStatus.SteuerklasseI]: {
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
  [DE_FilingStatus.SteuerklasseII]: {
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
   * Married individuals with a spouse who is in Steuerklasse V or without income
   */
  [DE_FilingStatus.SteuerklasseIII]: {
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
  [DE_FilingStatus.SteuerklasseIV]: {
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
   * Married individuals with a spouse in Steuerklasse III
   */
  [DE_FilingStatus.SteuerklasseV]: {
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
  [DE_FilingStatus.SteuerklasseVI]: {
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
