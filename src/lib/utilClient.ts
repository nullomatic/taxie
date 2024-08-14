import { Metric } from './constants';

export function sortObj<T extends Record<string, any>>(obj: T): T {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      (acc as any)[key] = obj[key];
      return acc;
    }, {} as T);
}

// function usd(currency: Currency, amount: number) {
//   // TODO
//   return amount * ExchangeRates[currency];
// }

export function formatNumber(num: number | string, decimalPlaces = 0) {
  if (!num) {
    return null;
  }
  num = parseFloat(num as string);
  return num.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatMetric(metric: number | string, type: Metric) {
  if (metric === undefined || metric === null) {
    return 'No Data';
  }
  if (type === Metric.Integer) {
    return formatNumber(metric);
  }
  if (type === Metric.Float) {
    return formatNumber(metric);
  }
  if (type === Metric.Percent) {
    return `${formatNumber(metric)}%`;
  }
  if (type === Metric.Monetary) {
    return `$${formatNumber(metric)}`;
  }
}

export function logRows(rows: string[]) {
  console.log(rows.join('\n'));
}

export function getKeyByValue(obj: any, value: number): string | undefined {
  const key = Object.keys(obj).find((key) => obj[key] === value);
  if (!key) {
    throw new Error(`Key not found for value '${value}'`);
  }
  return key;
}

export function enumHas(e: Record<string, any>, value: any): boolean {
  return Object.values(e).includes(value);
}
