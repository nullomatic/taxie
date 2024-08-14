export enum US_FilingStatus {
  Single = 'Single',
  MarriedFilingJointly = 'MarriedFilingJointly',
  MarriedFilingSeparately = 'MarriedFilingSeparately',
  HeadOfHousehold = 'HeadOfHousehold',
}

export const US_FederalBrackets = {
  [US_FilingStatus.Single]: {
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
  [US_FilingStatus.MarriedFilingJointly]: {
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
  [US_FilingStatus.MarriedFilingSeparately]: {
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
  [US_FilingStatus.HeadOfHousehold]: {
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

export enum US_States {
  AL = 'Alabama',
  AK = 'Alaska',
  AZ = 'Arizona',
  AR = 'Arkansas',
  CA = 'California',
  CO = 'Colorado',
  CT = 'Connecticut',
  DE = 'Delaware',
  DC = 'Washington, D.C.',
  FL = 'Florida',
  GA = 'Georgia',
  HI = 'Hawaii',
  ID = 'Idaho',
  IL = 'Illinois',
  IN = 'Indiana',
  IA = 'Iowa',
  KS = 'Kansas',
  KY = 'Kentucky',
  LA = 'Louisiana',
  ME = 'Maine',
  MD = 'Maryland',
  MA = 'Massachusetts',
  MI = 'Michigan',
  MN = 'Minnesota',
  MS = 'Mississippi',
  MO = 'Missouri',
  MT = 'Montana',
  NE = 'Nebraska',
  NV = 'Nevada',
  NH = 'New Hampshire',
  NJ = 'New Jersey',
  NM = 'New Mexico',
  NY = 'New York',
  NC = 'North Carolina',
  ND = 'North Dakota',
  OH = 'Ohio',
  OK = 'Oklahoma',
  OR = 'Oregon',
  PA = 'Pennsylvania',
  RI = 'Rhode Island',
  SC = 'South Carolina',
  SD = 'South Dakota',
  TN = 'Tennessee',
  TX = 'Texas',
  UT = 'Utah',
  VT = 'Vermont',
  VA = 'Virginia',
  WA = 'Washington',
  WV = 'West Virginia',
  WI = 'Wisconsin',
  WY = 'Wyoming',
}

export const US_StateBrackets = {
  [US_States.AL]: {
    [US_FilingStatus.Single]: {
      deduction: 3000,
      brackets: [
        { min: 0, max: 500, rate: 2 },
        { min: 500, max: 3000, rate: 4 },
        { min: 3000, max: Infinity, rate: 5 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 8500,
      brackets: [
        { min: 0, max: 1000, rate: 2 },
        { min: 1000, max: 6000, rate: 4 },
        { min: 6000, max: Infinity, rate: 5 },
      ],
    },
    exemption: { single: 1500, couple: 3000, dependent: 1000 },
  },
  [US_States.AK]: {
    [US_FilingStatus.Single]: { deduction: null, brackets: [] },
    [US_FilingStatus.MarriedFilingJointly]: { deduction: null, brackets: [] },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.AZ]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [{ min: 0, max: Infinity, rate: 2.5 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [{ min: 0, max: Infinity, rate: 2.5 }],
    },
    exemption: { single: null, couple: null, dependent: 100 },
  },
  [US_States.AR]: {
    [US_FilingStatus.Single]: {
      deduction: 2340,
      brackets: [
        { min: 0, max: 4400, rate: 2 },
        { min: 4400, max: 8800, rate: 4 },
        { min: 8800, max: Infinity, rate: 4.4 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 4680,
      brackets: [
        { min: 0, max: 4400, rate: 2 },
        { min: 4400, max: 8800, rate: 4 },
        { min: 8800, max: Infinity, rate: 4.4 },
      ],
    },
    exemption: { single: 29, couple: 58, dependent: 29 },
  },
  [US_States.CA]: {
    [US_FilingStatus.Single]: {
      deduction: 5363,
      brackets: [
        { min: 0, max: 10412, rate: 1 },
        { min: 10412, max: 24684, rate: 2 },
        { min: 24684, max: 38959, rate: 4 },
        { min: 38959, max: 54081, rate: 6 },
        { min: 54081, max: 68350, rate: 8 },
        { min: 68350, max: 349137, rate: 9.3 },
        { min: 349137, max: 418961, rate: 10.3 },
        { min: 418961, max: 698271, rate: 11.3 },
        { min: 698271, max: 1000000, rate: 12.3 },
        { min: 1000000, max: Infinity, rate: 13.3 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 10726,
      brackets: [
        { min: 0, max: 20824, rate: 1 },
        { min: 20824, max: 49368, rate: 2 },
        { min: 49368, max: 77918, rate: 4 },
        { min: 77918, max: 108162, rate: 6 },
        { min: 108162, max: 136700, rate: 8 },
        { min: 136700, max: 698274, rate: 9.3 },
        { min: 698274, max: 837922, rate: 10.3 },
        { min: 837922, max: 1000000, rate: 11.3 },
        { min: 1000000, max: 1396542, rate: 12.3 },
        { min: 1396542, max: Infinity, rate: 13.3 },
      ],
    },
    exemption: { single: 144, couple: 288, dependent: 446 },
  },
  [US_States.CO]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [{ min: 0, max: Infinity, rate: 4.4 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [{ min: 0, max: Infinity, rate: 4.4 }],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.CT]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [
        { min: 0, max: 10000, rate: 2 },
        { min: 10000, max: 50000, rate: 4.5 },
        { min: 50000, max: 100000, rate: 5.5 },
        { min: 100000, max: 200000, rate: 6 },
        { min: 200000, max: 250000, rate: 6.5 },
        { min: 250000, max: 500000, rate: 6.9 },
        { min: 500000, max: Infinity, rate: 6.99 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [
        { min: 0, max: 20000, rate: 2 },
        { min: 20000, max: 100000, rate: 4.5 },
        { min: 100000, max: 200000, rate: 5.5 },
        { min: 200000, max: 400000, rate: 6 },
        { min: 400000, max: 500000, rate: 6.5 },
        { min: 500000, max: 1000000, rate: 6.9 },
        { min: 1000000, max: Infinity, rate: 6.99 },
      ],
    },
    exemption: { single: 15000, couple: 24000, dependent: 0 },
  },
  [US_States.DE]: {
    [US_FilingStatus.Single]: {
      deduction: 3250,
      brackets: [
        { min: 2000, max: 5000, rate: 2.2 },
        { min: 5000, max: 10000, rate: 3.9 },
        { min: 10000, max: 20000, rate: 4.8 },
        { min: 20000, max: 25000, rate: 5.2 },
        { min: 25000, max: 60000, rate: 5.55 },
        { min: 60000, max: Infinity, rate: 6.6 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 6500,
      brackets: [
        { min: 2000, max: 5000, rate: 2.2 },
        { min: 5000, max: 10000, rate: 3.9 },
        { min: 10000, max: 20000, rate: 4.8 },
        { min: 20000, max: 25000, rate: 5.2 },
        { min: 25000, max: 60000, rate: 5.55 },
        { min: 60000, max: Infinity, rate: 6.6 },
      ],
    },
    exemption: { single: 110, couple: 220, dependent: 110 },
  },
  [US_States.FL]: {
    [US_FilingStatus.Single]: { deduction: null, brackets: [] },
    [US_FilingStatus.MarriedFilingJointly]: { deduction: null, brackets: [] },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.GA]: {
    [US_FilingStatus.Single]: {
      deduction: 12000,
      brackets: [{ min: 0, max: Infinity, rate: 5.49 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 24000,
      brackets: [{ min: 0, max: Infinity, rate: 5.49 }],
    },
    exemption: { single: null, couple: null, dependent: 3000 },
  },
  [US_States.HI]: {
    [US_FilingStatus.Single]: {
      deduction: 2200,
      brackets: [
        { min: 0, max: 2400, rate: 1.4 },
        { min: 2400, max: 4800, rate: 3.2 },
        { min: 4800, max: 9600, rate: 5.5 },
        { min: 9600, max: 14400, rate: 6.4 },
        { min: 14400, max: 19200, rate: 6.8 },
        { min: 19200, max: 24000, rate: 7.2 },
        { min: 24000, max: 36000, rate: 7.6 },
        { min: 36000, max: 48000, rate: 7.9 },
        { min: 48000, max: 150000, rate: 8.25 },
        { min: 150000, max: 175000, rate: 9 },
        { min: 175000, max: 200000, rate: 10 },
        { min: 200000, max: Infinity, rate: 11 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 4400,
      brackets: [
        { min: 0, max: 4800, rate: 1.4 },
        { min: 4800, max: 9600, rate: 3.2 },
        { min: 9600, max: 19200, rate: 5.5 },
        { min: 19200, max: 28800, rate: 6.4 },
        { min: 28800, max: 38400, rate: 6.8 },
        { min: 38400, max: 48000, rate: 7.2 },
        { min: 48000, max: 72000, rate: 7.6 },
        { min: 72000, max: 96000, rate: 7.9 },
        { min: 96000, max: 300000, rate: 8.25 },
        { min: 300000, max: 350000, rate: 9 },
        { min: 350000, max: 400000, rate: 10 },
        { min: 400000, max: Infinity, rate: 11 },
      ],
    },
    exemption: { single: 1144, couple: 2288, dependent: 1144 },
  },
  [US_States.ID]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [{ min: 4489, max: Infinity, rate: 5.8 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [{ min: 8978, max: Infinity, rate: 5.8 }],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.IL]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [{ min: 0, max: Infinity, rate: 4.95 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [{ min: 0, max: Infinity, rate: 4.95 }],
    },
    exemption: { single: 2775, couple: 5550, dependent: 2775 },
  },
  [US_States.IN]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [{ min: 0, max: Infinity, rate: 3.05 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [{ min: 0, max: Infinity, rate: 3.05 }],
    },
    exemption: { single: 1000, couple: 2000, dependent: 1000 },
  },
  [US_States.IA]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [
        { min: 0, max: 6210, rate: 4.4 },
        { min: 6210, max: 31050, rate: 4.82 },
        { min: 31050, max: Infinity, rate: 5.7 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [
        { min: 0, max: 12420, rate: 4.4 },
        { min: 12420, max: 62100, rate: 4.82 },
        { min: 62100, max: Infinity, rate: 5.7 },
      ],
    },
    exemption: { single: 40, couple: 80, dependent: 40 },
  },
  [US_States.KS]: {
    [US_FilingStatus.Single]: {
      deduction: 3500,
      brackets: [
        { min: 0, max: 15000, rate: 3.1 },
        { min: 15000, max: 30000, rate: 5.25 },
        { min: 30000, max: Infinity, rate: 5.7 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 8000,
      brackets: [
        { min: 0, max: 30000, rate: 3.1 },
        { min: 30000, max: 60000, rate: 5.25 },
        { min: 60000, max: Infinity, rate: 5.7 },
      ],
    },
    exemption: { single: 2250, couple: 4500, dependent: 2250 },
  },
  [US_States.KY]: {
    [US_FilingStatus.Single]: {
      deduction: 3160,
      brackets: [{ min: 0, max: Infinity, rate: 4 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 6320,
      brackets: [{ min: 0, max: Infinity, rate: 4 }],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.LA]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [
        { min: 0, max: 12500, rate: 1.85 },
        { min: 12500, max: 50000, rate: 3.5 },
        { min: 50000, max: Infinity, rate: 4.25 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [
        { min: 0, max: 25000, rate: 1.85 },
        { min: 25000, max: 100000, rate: 3.5 },
        { min: 100000, max: Infinity, rate: 4.25 },
      ],
    },
    exemption: { single: 4500, couple: 9000, dependent: 1000 },
  },
  [US_States.ME]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [
        { min: 0, max: 26050, rate: 5.8 },
        { min: 26050, max: 61600, rate: 6.75 },
        { min: 61600, max: Infinity, rate: 7.15 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [
        { min: 0, max: 52100, rate: 5.8 },
        { min: 52100, max: 123250, rate: 6.75 },
        { min: 123250, max: Infinity, rate: 7.15 },
      ],
    },
    exemption: { single: 5000, couple: 10000, dependent: 300 },
  },
  [US_States.MD]: {
    [US_FilingStatus.Single]: {
      deduction: 2550,
      brackets: [
        { min: 0, max: 1000, rate: 2 },
        { min: 1000, max: 2000, rate: 3 },
        { min: 2000, max: 3000, rate: 4 },
        { min: 3000, max: 100000, rate: 4.75 },
        { min: 100000, max: 125000, rate: 5 },
        { min: 125000, max: 150000, rate: 5.25 },
        { min: 150000, max: 250000, rate: 5.5 },
        { min: 250000, max: Infinity, rate: 5.75 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 5150,
      brackets: [
        { min: 0, max: 1000, rate: 2 },
        { min: 1000, max: 2000, rate: 3 },
        { min: 2000, max: 3000, rate: 4 },
        { min: 3000, max: 150000, rate: 4.75 },
        { min: 150000, max: 175000, rate: 5 },
        { min: 175000, max: 225000, rate: 5.25 },
        { min: 225000, max: 300000, rate: 5.5 },
        { min: 300000, max: Infinity, rate: 5.75 },
      ],
    },
    exemption: { single: 3200, couple: 6400, dependent: 3200 },
  },
  [US_States.MA]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [
        { min: 0, max: 1000000, rate: 5 },
        { min: 1000000, max: Infinity, rate: 9 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [
        { min: 0, max: 1000000, rate: 5 },
        { min: 1000000, max: Infinity, rate: 9 },
      ],
    },
    exemption: { single: 4400, couple: 8800, dependent: 1000 },
  },
  [US_States.MI]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [{ min: 0, max: Infinity, rate: 4.25 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [{ min: 0, max: Infinity, rate: 4.25 }],
    },
    exemption: { single: 5600, couple: 11200, dependent: 5600 },
  },
  [US_States.MN]: {
    [US_FilingStatus.Single]: {
      deduction: 14575,
      brackets: [
        { min: 0, max: 31690, rate: 5.35 },
        { min: 31690, max: 104090, rate: 6.8 },
        { min: 104090, max: 193240, rate: 7.85 },
        { min: 193240, max: Infinity, rate: 9.85 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29150,
      brackets: [
        { min: 0, max: 46330, rate: 5.35 },
        { min: 46330, max: 184040, rate: 6.8 },
        { min: 184040, max: 321450, rate: 7.85 },
        { min: 321450, max: Infinity, rate: 9.85 },
      ],
    },
    exemption: { single: null, couple: null, dependent: 5050 },
  },
  [US_States.MS]: {
    [US_FilingStatus.Single]: {
      deduction: 2300,
      brackets: [{ min: 10000, max: Infinity, rate: 4.7 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 4600,
      brackets: [{ min: 10000, max: Infinity, rate: 4.7 }],
    },
    exemption: { single: 6000, couple: 12000, dependent: 1500 },
  },
  [US_States.MO]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [
        { min: 1273, max: 2546, rate: 2 },
        { min: 2546, max: 3819, rate: 2.5 },
        { min: 3819, max: 5092, rate: 3 },
        { min: 5092, max: 6365, rate: 3.5 },
        { min: 6365, max: 7638, rate: 4 },
        { min: 7638, max: 8911, rate: 4.5 },
        { min: 8911, max: Infinity, rate: 4.8 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [
        { min: 1207, max: 2414, rate: 2 },
        { min: 2414, max: 3621, rate: 2.5 },
        { min: 3621, max: 4828, rate: 3 },
        { min: 4828, max: 6035, rate: 3.5 },
        { min: 6035, max: 7242, rate: 4 },
        { min: 7242, max: 8449, rate: 4.5 },
        { min: 8449, max: Infinity, rate: 4.8 },
      ],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.MT]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [
        { min: 0, max: 20500, rate: 4.7 },
        { min: 20500, max: Infinity, rate: 5.9 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [
        { min: 0, max: 41000, rate: 4.7 },
        { min: 41000, max: Infinity, rate: 5.9 },
      ],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.NE]: {
    [US_FilingStatus.Single]: {
      deduction: 7900,
      brackets: [
        { min: 0, max: 3700, rate: 2.46 },
        { min: 3700, max: 22170, rate: 3.51 },
        { min: 22170, max: 35730, rate: 5.01 },
        { min: 35730, max: Infinity, rate: 5.84 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 15800,
      brackets: [
        { min: 0, max: 7390, rate: 2.46 },
        { min: 7390, max: 44350, rate: 3.51 },
        { min: 44350, max: 71460, rate: 5.01 },
        { min: 71460, max: Infinity, rate: 5.84 },
      ],
    },
    exemption: { single: 157, couple: 314, dependent: 157 },
  },
  [US_States.NV]: {
    [US_FilingStatus.Single]: { deduction: null, brackets: [] },
    [US_FilingStatus.MarriedFilingJointly]: { deduction: null, brackets: [] },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.NH]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [{ min: null, max: Infinity, rate: 3 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [{ min: null, max: Infinity, rate: 3 }],
    },
    exemption: { single: 2400, couple: 4800, dependent: null },
  },
  [US_States.NJ]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [
        { min: 0, max: 20000, rate: 1.4 },
        { min: 20000, max: 35000, rate: 1.75 },
        { min: 35000, max: 40000, rate: 3.5 },
        { min: 40000, max: 75000, rate: 5.53 },
        { min: 75000, max: 500000, rate: 6.37 },
        { min: 500000, max: 1000000, rate: 8.97 },
        { min: 1000000, max: null, rate: 10.75 },
        { min: null, max: Infinity, rate: null },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [
        { min: 0, max: 20000, rate: 1.4 },
        { min: 20000, max: 50000, rate: 1.75 },
        { min: 50000, max: 70000, rate: 2.45 },
        { min: 70000, max: 80000, rate: 3.5 },
        { min: 80000, max: 150000, rate: 5.53 },
        { min: 150000, max: 500000, rate: 6.37 },
        { min: 500000, max: 1000000, rate: 8.97 },
        { min: 1000000, max: Infinity, rate: 10.75 },
      ],
    },
    exemption: { single: 1000, couple: 2000, dependent: 1500 },
  },
  [US_States.NM]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [
        { min: 0, max: 5500, rate: 1.7 },
        { min: 5500, max: 11000, rate: 3.2 },
        { min: 11000, max: 16000, rate: 4.7 },
        { min: 16000, max: 210000, rate: 4.9 },
        { min: 210000, max: Infinity, rate: 5.9 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [
        { min: 0, max: 8000, rate: 1.7 },
        { min: 8000, max: 16000, rate: 3.2 },
        { min: 16000, max: 24000, rate: 4.7 },
        { min: 24000, max: 315000, rate: 4.9 },
        { min: 315000, max: Infinity, rate: 5.9 },
      ],
    },
    exemption: { single: null, couple: null, dependent: 4000 },
  },
  [US_States.NY]: {
    [US_FilingStatus.Single]: {
      deduction: 8000,
      brackets: [
        { min: 0, max: 8500, rate: 4 },
        { min: 8500, max: 11700, rate: 4.5 },
        { min: 11700, max: 13900, rate: 5.25 },
        { min: 13900, max: 80650, rate: 5.5 },
        { min: 80650, max: 215400, rate: 6 },
        { min: 215400, max: 1077550, rate: 6.85 },
        { min: 1077550, max: 5000000, rate: 9.65 },
        { min: 5000000, max: 25000000, rate: 10.3 },
        { min: 25000000, max: Infinity, rate: 10.9 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 16050,
      brackets: [
        { min: 0, max: 17150, rate: 4 },
        { min: 17150, max: 23600, rate: 4.5 },
        { min: 23600, max: 27900, rate: 5.25 },
        { min: 27900, max: 161550, rate: 5.5 },
        { min: 161550, max: 323200, rate: 6 },
        { min: 323200, max: 2155350, rate: 6.85 },
        { min: 2155350, max: 5000000, rate: 9.65 },
        { min: 5000000, max: 25000000, rate: 10.3 },
        { min: 25000000, max: Infinity, rate: 10.9 },
      ],
    },
    exemption: { single: null, couple: null, dependent: 1000 },
  },
  [US_States.NC]: {
    [US_FilingStatus.Single]: {
      deduction: 12750,
      brackets: [{ min: 0, max: Infinity, rate: 4.5 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 25500,
      brackets: [{ min: 0, max: Infinity, rate: 4.5 }],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.ND]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [
        { min: 44725, max: 225975, rate: 1.95 },
        { min: 225975, max: Infinity, rate: 2.5 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [
        { min: 74750, max: 275100, rate: 1.95 },
        { min: 275100, max: Infinity, rate: 2.5 },
      ],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.OH]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [
        { min: 26050, max: 92150, rate: 2.75 },
        { min: 92150, max: Infinity, rate: 3.5 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [
        { min: 26050, max: 92150, rate: 2.75 },
        { min: 92150, max: Infinity, rate: 3.5 },
      ],
    },
    exemption: { single: 2400, couple: 4800, dependent: 2500 },
  },
  [US_States.OK]: {
    [US_FilingStatus.Single]: {
      deduction: 6350,
      brackets: [
        { min: 0, max: 1000, rate: 0.25 },
        { min: 1000, max: 2500, rate: 0.75 },
        { min: 2500, max: 3750, rate: 1.75 },
        { min: 3750, max: 4900, rate: 2.75 },
        { min: 4900, max: 7200, rate: 3.75 },
        { min: 7200, max: Infinity, rate: 4.75 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 12700,
      brackets: [
        { min: 0, max: 2000, rate: 0.25 },
        { min: 2000, max: 5000, rate: 0.75 },
        { min: 5000, max: 7500, rate: 1.75 },
        { min: 7500, max: 9800, rate: 2.75 },
        { min: 9800, max: 12200, rate: 3.75 },
        { min: 12200, max: Infinity, rate: 4.75 },
      ],
    },
    exemption: { single: 1000, couple: 2000, dependent: 1000 },
  },
  [US_States.OR]: {
    [US_FilingStatus.Single]: {
      deduction: 2745,
      brackets: [
        { min: 0, max: 4300, rate: 4.75 },
        { min: 4300, max: 10750, rate: 6.75 },
        { min: 10750, max: 125000, rate: 8.75 },
        { min: 125000, max: Infinity, rate: 9.9 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 5495,
      brackets: [
        { min: 0, max: 8600, rate: 4.75 },
        { min: 8600, max: 21500, rate: 6.75 },
        { min: 21500, max: 250000, rate: 8.75 },
        { min: 250000, max: Infinity, rate: 9.9 },
      ],
    },
    exemption: { single: 249, couple: 498, dependent: 249 },
  },
  [US_States.PA]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [{ min: 0, max: Infinity, rate: 3.07 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [{ min: 0, max: Infinity, rate: 3.07 }],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.RI]: {
    [US_FilingStatus.Single]: {
      deduction: 10550,
      brackets: [
        { min: 0, max: 77450, rate: 3.75 },
        { min: 77450, max: 176050, rate: 4.75 },
        { min: 176050, max: Infinity, rate: 5.99 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 21150,
      brackets: [
        { min: 0, max: 77450, rate: 3.75 },
        { min: 77450, max: 176050, rate: 4.75 },
        { min: 176050, max: Infinity, rate: 5.99 },
      ],
    },
    exemption: { single: 4950, couple: 9900, dependent: 4950 },
  },
  [US_States.SC]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [
        { min: 0, max: 3460, rate: 0 },
        { min: 3460, max: 17330, rate: 3 },
        { min: 17330, max: Infinity, rate: 6.4 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [
        { min: 0, max: 3460, rate: 0 },
        { min: 3460, max: 17330, rate: 3 },
        { min: 17330, max: Infinity, rate: 6.4 },
      ],
    },
    exemption: { single: null, couple: null, dependent: 4610 },
  },
  [US_States.SD]: {
    [US_FilingStatus.Single]: { deduction: null, brackets: [] },
    [US_FilingStatus.MarriedFilingJointly]: { deduction: null, brackets: [] },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.TN]: {
    [US_FilingStatus.Single]: { deduction: null, brackets: [] },
    [US_FilingStatus.MarriedFilingJointly]: { deduction: null, brackets: [] },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.TX]: {
    [US_FilingStatus.Single]: { deduction: null, brackets: [] },
    [US_FilingStatus.MarriedFilingJointly]: { deduction: null, brackets: [] },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.UT]: {
    [US_FilingStatus.Single]: {
      deduction: 876,
      brackets: [{ min: 0, max: Infinity, rate: 4.65 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 1752,
      brackets: [{ min: 0, max: Infinity, rate: 4.65 }],
    },
    exemption: { single: null, couple: null, dependent: 1941 },
  },
  [US_States.VT]: {
    [US_FilingStatus.Single]: {
      deduction: 7000,
      brackets: [
        { min: 0, max: 45400, rate: 3.35 },
        { min: 45400, max: 110050, rate: 6.6 },
        { min: 110050, max: 229550, rate: 7.6 },
        { min: 229550, max: Infinity, rate: 8.75 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 14050,
      brackets: [
        { min: 0, max: 75850, rate: 3.35 },
        { min: 75850, max: 183400, rate: 6.6 },
        { min: 183400, max: 279450, rate: 7.6 },
        { min: 279450, max: Infinity, rate: 8.75 },
      ],
    },
    exemption: { single: 4850, couple: 9700, dependent: 4850 },
  },
  [US_States.VA]: {
    [US_FilingStatus.Single]: {
      deduction: 8000,
      brackets: [
        { min: 0, max: 3000, rate: 2 },
        { min: 3000, max: 5000, rate: 3 },
        { min: 5000, max: 17000, rate: 5 },
        { min: 17000, max: Infinity, rate: 5.75 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 16000,
      brackets: [
        { min: 0, max: 3000, rate: 2 },
        { min: 3000, max: 5000, rate: 3 },
        { min: 5000, max: 17000, rate: 5 },
        { min: 17000, max: Infinity, rate: 5.75 },
      ],
    },
    exemption: { single: 930, couple: 1860, dependent: 930 },
  },
  [US_States.WA]: {
    [US_FilingStatus.Single]: {
      deduction: 250000,
      brackets: [{ min: null, max: Infinity, rate: 7 }],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 250000,
      brackets: [{ min: null, max: Infinity, rate: 7 }],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.WV]: {
    [US_FilingStatus.Single]: {
      deduction: null,
      brackets: [
        { min: 0, max: 10000, rate: 2.36 },
        { min: 10000, max: 25000, rate: 3.15 },
        { min: 25000, max: 40000, rate: 3.54 },
        { min: 40000, max: 60000, rate: 4.72 },
        { min: 60000, max: Infinity, rate: 5.12 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: null,
      brackets: [
        { min: 0, max: 10000, rate: 2.36 },
        { min: 10000, max: 25000, rate: 3.15 },
        { min: 25000, max: 40000, rate: 3.54 },
        { min: 40000, max: 60000, rate: 4.72 },
        { min: 60000, max: Infinity, rate: 5.12 },
      ],
    },
    exemption: { single: 2000, couple: 4000, dependent: 2000 },
  },
  [US_States.WI]: {
    [US_FilingStatus.Single]: {
      deduction: 13230,
      brackets: [
        { min: 0, max: 14320, rate: 3.5 },
        { min: 14320, max: 28640, rate: 4.4 },
        { min: 28640, max: 315310, rate: 5.3 },
        { min: 315310, max: Infinity, rate: 7.65 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 24490,
      brackets: [
        { min: 0, max: 19090, rate: 3.5 },
        { min: 19090, max: 38190, rate: 4.4 },
        { min: 38190, max: 420420, rate: 5.3 },
        { min: 420420, max: Infinity, rate: 7.65 },
      ],
    },
    exemption: { single: 700, couple: 1400, dependent: 700 },
  },
  [US_States.WY]: {
    [US_FilingStatus.Single]: { deduction: null, brackets: [] },
    [US_FilingStatus.MarriedFilingJointly]: { deduction: null, brackets: [] },
    exemption: { single: null, couple: null, dependent: null },
  },
  [US_States.DC]: {
    [US_FilingStatus.Single]: {
      deduction: 14600,
      brackets: [
        { min: 0, max: 10000, rate: 4 },
        { min: 10000, max: 40000, rate: 6 },
        { min: 40000, max: 60000, rate: 6.5 },
        { min: 60000, max: 250000, rate: 8.5 },
        { min: 250000, max: 500000, rate: 9.25 },
        { min: 500000, max: 1000000, rate: 9.75 },
        { min: 1000000, max: Infinity, rate: 10.75 },
      ],
    },
    [US_FilingStatus.MarriedFilingJointly]: {
      deduction: 29200,
      brackets: [
        { min: 0, max: 10000, rate: 4 },
        { min: 10000, max: 40000, rate: 6 },
        { min: 40000, max: 60000, rate: 6.5 },
        { min: 60000, max: 250000, rate: 8.5 },
        { min: 250000, max: 500000, rate: 9.25 },
        { min: 500000, max: 1000000, rate: 9.75 },
        { min: 1000000, max: Infinity, rate: 10.75 },
      ],
    },
    exemption: { single: null, couple: null, dependent: null },
  },
};
