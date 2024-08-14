import { US_MilitaryRank } from '@/countries/US/military/constants';
import {
  CountryCode,
  Currency,
  FilingStatus_US,
  FilingStatus_DE,
  Schedule,
  US_States,
  Locus,
  Aggregate,
  Operator,
  Order,
  ACSMetric,
} from './constants';

export type _Options = {
  title?: string;
  currency?: Currency;
  principle?: number;
  apy?: number;
  years?: number;
  depositSchedule?: Schedule;
  compoundingSchedule?: Schedule;
  inflationRate?: number;
  expenses?: { name: string; amount: number }[];
};

export type US_Options = _Options & {
  country: CountryCode.US;
  state: US_States;
  filingStatus?: FilingStatus_US;
} & (
    | { salary: number; military?: never }
    | {
        salary?: never;
        military: {
          rank: US_MilitaryRank;
          serviceTime: number;
          location: number;
          dependents: boolean;
          bahJSON: any;
          mhaJSON: any;
        };
      }
  );
export type DE_Options = _Options & {
  country: CountryCode.DE;
  filingStatus?: FilingStatus_DE;
  salary: number;
  soliThreshold?: number;
  soliPercent?: number;
};

export type Options = US_Options | DE_Options;

export type Optional<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

export type UserFilter = {
  id: string;
  operator: string;
  threshold: string | number;
  order?: string;
};

export type Criterion = {
  id: ACSMetric;
  operator: Operator;
  threshold: number;
  order?: Order;
  label?: string;
};

export type QueryData = {
  locus: Locus;
  criteria: Criterion[];
};
