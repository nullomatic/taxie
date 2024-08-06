import {
  CountryCode,
  Currency,
  FilingStatus_US,
  FilingStatus_DE,
  Schedule,
} from './constants';

type FilingStatus = FilingStatus_US | FilingStatus_DE;

export type _Options = {
  country: CountryCode;
  salary: number;
  title?: string;
  currency?: Currency;
  filingStatus?: FilingStatus;
  principle?: number;
  apy?: number;
  years?: number;
  depositPercent?: number;
  depositSchedule?: Schedule;
  compoundingSchedule?: Schedule;
  inflationRate?: number;
  soliThreshold?: number;
  soliPercent?: number;
};

export type Options_US = _Options & {
  country: CountryCode.US;
  filingStatus?: FilingStatus_US;
};
export type Options_DE = _Options & {
  country: CountryCode.DE;
  filingStatus?: FilingStatus_DE;
};

export type Options = Options_US | Options_DE;

export type Optional<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];
