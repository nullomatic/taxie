import _ from 'lodash';
import pg from 'pg';
import format from 'pg-format';
import { RedisClientType } from 'redis';
import * as util from '../lib/utilClient';
import { logger, readCSV, readFile } from '../lib/utilServer';
import { DatabaseClient, RedisClient } from '../lib/client';

let postgres: pg.Client;
let redis: RedisClientType;

/**
 * Resets database and seeds it from various data sources.
 */
export async function populateDatabase() {
  postgres = await DatabaseClient.getClient();
  redis = await RedisClient.getClient();
  await resetDatabase();
  await loadZIPData();
  await loadACSMetrics();
}

/**
 * Completely resets Postgres and Redis.
 */
async function resetDatabase() {
  logger.info(`Resetting database`);
  const sql = readFile('/sql/setup.sql');
  await postgres.query(sql);
  await redis.flushAll();
}

/**
 * Inserts geographic ZIP data into database.
 */
async function loadZIPData() {
  const zips: any = {};
  const entries = await readCSV('/countries/US/assets/zip_codes.csv');
  for (const entry of entries) {
    const zip = {
      code: entry.zip,
      city_name: entry.primary_city,
      county_name: entry.county,
      state_id: entry.state,
    };
    if (!zips[zip.code]) {
      zips[zip.code] = zip;
    }
  }

  const values = Object.values(zips).map(Object.values as any);
  logger.info(`Inserting ${util.formatNumber(values.length)} ZIP codes`);

  await postgres.query(
    // prettier-ignore
    format(
      `INSERT INTO zip (zip_code, city_name, county_name, state_id) ` +
      `VALUES %L`,
    values)
  );
}

/**
 * Inserts American Community Survey (ACS) metrics into database.
 */
async function loadACSMetrics() {
  const BATCH_SIZE = 1000000;
  const zipData = await getZIPData();

  const load = async (filename: string, title: string) => {
    const entries = await readCSV('/countries/US/assets/' + filename);
    const legend = _.pickBy(entries.shift(), (value) => value);
    const prefix = filename.match(/(?<=^[a-z0-9]+\.)[a-z0-9]+/i)?.[0];

    if (!prefix) {
      throw new Error(`Prefix not found in filename "${filename}"`);
    }

    // This gets only those keys containing statistic data and ignores
    // any others like 'GEO_ID' and 'NAME'.
    const statKeys = Object.keys(legend).filter((key) =>
      key.startsWith(prefix)
    );

    const insertEntries = async (values: string[][]) => {
      logger.info(
        `Inserting ${util.formatNumber(
          values.length
        )} statistic entries (${title})`
      );
      await postgres.query(
        // prettier-ignore
        format(
          `INSERT INTO acs_metric (id, zip_code, estimate) ` +
          `VALUES %L`,
        values)
      );
    };

    let values: string[][] = [];

    for (const entry of entries) {
      const zipCode = entry.NAME.split(' ').pop();
      if (!zipData[zipCode]) {
        logger.warn(`Missing data for ZIP "${zipCode}"`);
      }
      for (const key of statKeys) {
        values.push([key, zipCode, parseMetric(entry[key])]);
      }
      if (values.length >= BATCH_SIZE) {
        await insertEntries(values);
        values = [];
      }
    }
    if (values.length) {
      // Insert remaining entries.
      await insertEntries(values);
    }
  };

  await load('ACSDP5Y2020.DP05-Data.csv', 'ACS Demographics');
  await load('ACSST5Y2022.S2001-Data.csv', 'ACS Income');
}

/**
 * Fetches ZIP JSON data from CSV file.
 */
async function getZIPData() {
  const entries = await readCSV('/countries/US/assets/zip_codes.csv');
  const zips: any = {};
  for (const entry of entries) {
    if (!zips[entry.zip]) {
      zips[entry.zip] = entry;
    } else {
      throw new Error(`ZIP "${entry.zip}" already exists`);
    }
  }
  return zips;
}

/**
 * Returns the metric, null if not a number.
 */
function parseMetric(str: string) {
  const value = parseFloat(str);
  if (!isNaN(value)) {
    return value.toString();
  }
  return null;
}

// TODO
const legend1 = {
  DP05_0001: 'SEX AND AGE!!Total population',
  DP05_0002: 'SEX AND AGE!!Total population!!Male',
  DP05_0003: 'SEX AND AGE!!Total population!!Female',
  DP05_0004: 'SEX AND AGE!!Total population!!Sex ratio (males per 100 females)',
  DP05_0005: 'SEX AND AGE!!Total population!!Under 5 years',
  DP05_0006: 'SEX AND AGE!!Total population!!5 to 9 years',
  DP05_0007: 'SEX AND AGE!!Total population!!10 to 14 years',
  DP05_0008: 'SEX AND AGE!!Total population!!15 to 19 years',
  DP05_0009: 'SEX AND AGE!!Total population!!20 to 24 years',
  DP05_0010: 'SEX AND AGE!!Total population!!25 to 34 years',
  DP05_0011: 'SEX AND AGE!!Total population!!35 to 44 years',
  DP05_0012: 'SEX AND AGE!!Total population!!45 to 54 years',
  DP05_0013: 'SEX AND AGE!!Total population!!55 to 59 years',
  DP05_0014: 'SEX AND AGE!!Total population!!60 to 64 years',
  DP05_0015: 'SEX AND AGE!!Total population!!65 to 74 years',
  DP05_0016: 'SEX AND AGE!!Total population!!75 to 84 years',
  DP05_0017: 'SEX AND AGE!!Total population!!85 years and over',
  DP05_0018: 'SEX AND AGE!!Total population!!Median age (years)',
  DP05_0019: 'SEX AND AGE!!Total population!!Under 18 years',
  DP05_0020: 'SEX AND AGE!!Total population!!16 years and over',
  DP05_0021: 'SEX AND AGE!!Total population!!18 years and over',
  DP05_0022: 'SEX AND AGE!!Total population!!21 years and over',
  DP05_0023: 'SEX AND AGE!!Total population!!62 years and over',
  DP05_0024: 'SEX AND AGE!!Total population!!65 years and over',
  DP05_0025: 'SEX AND AGE!!Total population!!18 years and over',
  DP05_0026: 'SEX AND AGE!!Total population!!18 years and over!!Male',
  DP05_0027: 'SEX AND AGE!!Total population!!18 years and over!!Female',
  DP05_0028:
    'SEX AND AGE!!Total population!!18 years and over!!Sex ratio (males per 100 females)',
  DP05_0029: 'SEX AND AGE!!Total population!!65 years and over',
  DP05_0030: 'SEX AND AGE!!Total population!!65 years and over!!Male',
  DP05_0031: 'SEX AND AGE!!Total population!!65 years and over!!Female',
  DP05_0032:
    'SEX AND AGE!!Total population!!65 years and over!!Sex ratio (males per 100 females)',
  DP05_0033: 'RACE!!Total population',
  DP05_0034: 'RACE!!Total population!!One race',
  DP05_0035: 'RACE!!Total population!!Two or more races',
  DP05_0036: 'RACE!!Total population!!One race',
  DP05_0037: 'RACE!!Total population!!One race!!White',
  DP05_0038: 'RACE!!Total population!!One race!!Black or African American',
  DP05_0039:
    'RACE!!Total population!!One race!!American Indian and Alaska Native',
  DP05_0040:
    'RACE!!Total population!!One race!!American Indian and Alaska Native!!Cherokee tribal grouping',
  DP05_0041:
    'RACE!!Total population!!One race!!American Indian and Alaska Native!!Chippewa tribal grouping',
  DP05_0042:
    'RACE!!Total population!!One race!!American Indian and Alaska Native!!Navajo tribal grouping',
  DP05_0043:
    'RACE!!Total population!!One race!!American Indian and Alaska Native!!Sioux tribal grouping',
  DP05_0044: 'RACE!!Total population!!One race!!Asian',
  DP05_0045: 'RACE!!Total population!!One race!!Asian!!Asian Indian',
  DP05_0046: 'RACE!!Total population!!One race!!Asian!!Chinese',
  DP05_0047: 'RACE!!Total population!!One race!!Asian!!Filipino',
  DP05_0048: 'RACE!!Total population!!One race!!Asian!!Japanese',
  DP05_0049: 'RACE!!Total population!!One race!!Asian!!Korean',
  DP05_0050: 'RACE!!Total population!!One race!!Asian!!Vietnamese',
  DP05_0051: 'RACE!!Total population!!One race!!Asian!!Other Asian',
  DP05_0052:
    'RACE!!Total population!!One race!!Native Hawaiian and Other Pacific Islander',
  DP05_0053:
    'RACE!!Total population!!One race!!Native Hawaiian and Other Pacific Islander!!Native Hawaiian',
  DP05_0054:
    'RACE!!Total population!!One race!!Native Hawaiian and Other Pacific Islander!!Chamorro',
  DP05_0055:
    'RACE!!Total population!!One race!!Native Hawaiian and Other Pacific Islander!!Samoan',
  DP05_0056:
    'RACE!!Total population!!One race!!Native Hawaiian and Other Pacific Islander!!Other Pacific Islander',
  DP05_0057: 'RACE!!Total population!!One race!!Some other race',
  DP05_0058: 'RACE!!Total population!!Two or more races',
  DP05_0059:
    'RACE!!Total population!!Two or more races!!White and Black or African American',
  DP05_0060:
    'RACE!!Total population!!Two or more races!!White and American Indian and Alaska Native',
  DP05_0061: 'RACE!!Total population!!Two or more races!!White and Asian',
  DP05_0062:
    'RACE!!Total population!!Two or more races!!Black or African American and American Indian and Alaska Native',
  DP05_0063:
    'Race alone or in combination with one or more other races!!Total population',
  DP05_0064:
    'Race alone or in combination with one or more other races!!Total population!!White',
  DP05_0065:
    'Race alone or in combination with one or more other races!!Total population!!Black or African American',
  DP05_0066:
    'Race alone or in combination with one or more other races!!Total population!!American Indian and Alaska Native',
  DP05_0067:
    'Race alone or in combination with one or more other races!!Total population!!Asian',
  DP05_0068:
    'Race alone or in combination with one or more other races!!Total population!!Native Hawaiian and Other Pacific Islander',
  DP05_0069:
    'Race alone or in combination with one or more other races!!Total population!!Some other race',
  DP05_0070: 'HISPANIC OR LATINO AND RACE!!Total population',
  DP05_0071:
    'HISPANIC OR LATINO AND RACE!!Total population!!Hispanic or Latino (of any race)',
  DP05_0072:
    'HISPANIC OR LATINO AND RACE!!Total population!!Hispanic or Latino (of any race)!!Mexican',
  DP05_0073:
    'HISPANIC OR LATINO AND RACE!!Total population!!Hispanic or Latino (of any race)!!Puerto Rican',
  DP05_0074:
    'HISPANIC OR LATINO AND RACE!!Total population!!Hispanic or Latino (of any race)!!Cuban',
  DP05_0075:
    'HISPANIC OR LATINO AND RACE!!Total population!!Hispanic or Latino (of any race)!!Other Hispanic or Latino',
  DP05_0076:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino',
  DP05_0077:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!White alone',
  DP05_0078:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!Black or African American alone',
  DP05_0079:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!American Indian and Alaska Native alone',
  DP05_0080:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!Asian alone',
  DP05_0081:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!Native Hawaiian and Other Pacific Islander alone',
  DP05_0082:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!Some other race alone',
  DP05_0083:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!Two or more races',
  DP05_0084:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!Two or more races!!Two races including Some other race',
  DP05_0085:
    'HISPANIC OR LATINO AND RACE!!Total population!!Not Hispanic or Latino!!Two or more races!!Two races excluding Some other race, and Three or more races',
  DP05_0086: 'Total housing units',
  DP05_0087: 'CITIZEN, VOTING AGE POPULATION!!Citizen, 18 and over population',
  DP05_0088:
    'CITIZEN, VOTING AGE POPULATION!!Citizen, 18 and over population!!Male',
  DP05_0089:
    'CITIZEN, VOTING AGE POPULATION!!Citizen, 18 and over population!!Female',
};

const legend2 = {
  S2001_C01_001: 'Total!!Population 16 years and over with earnings',
  S2001_C01_002:
    'Total!!Population 16 years and over with earnings!!Median earnings (dollars)',
  S2001_C01_003:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS',
  S2001_C01_004:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$1 to $9,999 or loss',
  S2001_C01_005:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$10,000 to $14,999',
  S2001_C01_006:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$15,000 to $24,999',
  S2001_C01_007:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$25,000 to $34,999',
  S2001_C01_008:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$35,000 to $49,999',
  S2001_C01_009:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$50,000 to $64,999',
  S2001_C01_010:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$65,000 to $74,999',
  S2001_C01_011:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$75,000 to $99,999',
  S2001_C01_012:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$100,000 or more',
  S2001_C01_013:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Median earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C01_014:
    'Total!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Mean earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C01_015:
    'Total!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings',
  S2001_C01_016:
    'Total!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Less than high school graduate',
  S2001_C01_017:
    'Total!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!High school graduate (includes equivalency)',
  S2001_C01_018:
    "Total!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Some college or associate's degree",
  S2001_C01_019:
    "Total!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Bachelor's degree",
  S2001_C01_020:
    'Total!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Graduate or professional degree',
  S2001_C02_001: 'Percent!!Population 16 years and over with earnings',
  S2001_C02_002:
    'Percent!!Population 16 years and over with earnings!!Median earnings (dollars)',
  S2001_C02_003:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS',
  S2001_C02_004:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$1 to $9,999 or loss',
  S2001_C02_005:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$10,000 to $14,999',
  S2001_C02_006:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$15,000 to $24,999',
  S2001_C02_007:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$25,000 to $34,999',
  S2001_C02_008:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$35,000 to $49,999',
  S2001_C02_009:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$50,000 to $64,999',
  S2001_C02_010:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$65,000 to $74,999',
  S2001_C02_011:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$75,000 to $99,999',
  S2001_C02_012:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$100,000 or more',
  S2001_C02_013:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Median earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C02_014:
    'Percent!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Mean earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C02_015:
    'Percent!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings',
  S2001_C02_016:
    'Percent!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Less than high school graduate',
  S2001_C02_017:
    'Percent!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!High school graduate (includes equivalency)',
  S2001_C02_018:
    "Percent!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Some college or associate's degree",
  S2001_C02_019:
    "Percent!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Bachelor's degree",
  S2001_C02_020:
    'Percent!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Graduate or professional degree',
  S2001_C03_001: 'Male!!Population 16 years and over with earnings',
  S2001_C03_002:
    'Male!!Population 16 years and over with earnings!!Median earnings (dollars)',
  S2001_C03_003:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS',
  S2001_C03_004:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$1 to $9,999 or loss',
  S2001_C03_005:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$10,000 to $14,999',
  S2001_C03_006:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$15,000 to $24,999',
  S2001_C03_007:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$25,000 to $34,999',
  S2001_C03_008:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$35,000 to $49,999',
  S2001_C03_009:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$50,000 to $64,999',
  S2001_C03_010:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$65,000 to $74,999',
  S2001_C03_011:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$75,000 to $99,999',
  S2001_C03_012:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$100,000 or more',
  S2001_C03_013:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Median earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C03_014:
    'Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Mean earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C03_015:
    'Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings',
  S2001_C03_016:
    'Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Less than high school graduate',
  S2001_C03_017:
    'Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!High school graduate (includes equivalency)',
  S2001_C03_018:
    "Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Some college or associate's degree",
  S2001_C03_019:
    "Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Bachelor's degree",
  S2001_C03_020:
    'Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Graduate or professional degree',
  S2001_C04_001: 'Percent Male!!Population 16 years and over with earnings',
  S2001_C04_002:
    'Percent Male!!Population 16 years and over with earnings!!Median earnings (dollars)',
  S2001_C04_003:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS',
  S2001_C04_004:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$1 to $9,999 or loss',
  S2001_C04_005:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$10,000 to $14,999',
  S2001_C04_006:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$15,000 to $24,999',
  S2001_C04_007:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$25,000 to $34,999',
  S2001_C04_008:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$35,000 to $49,999',
  S2001_C04_009:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$50,000 to $64,999',
  S2001_C04_010:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$65,000 to $74,999',
  S2001_C04_011:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$75,000 to $99,999',
  S2001_C04_012:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$100,000 or more',
  S2001_C04_013:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Median earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C04_014:
    'Percent Male!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Mean earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C04_015:
    'Percent Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings',
  S2001_C04_016:
    'Percent Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Less than high school graduate',
  S2001_C04_017:
    'Percent Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!High school graduate (includes equivalency)',
  S2001_C04_018:
    "Percent Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Some college or associate's degree",
  S2001_C04_019:
    "Percent Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Bachelor's degree",
  S2001_C04_020:
    'Percent Male!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Graduate or professional degree',
  S2001_C05_001: 'Female!!Population 16 years and over with earnings',
  S2001_C05_002:
    'Female!!Population 16 years and over with earnings!!Median earnings (dollars)',
  S2001_C05_003:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS',
  S2001_C05_004:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$1 to $9,999 or loss',
  S2001_C05_005:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$10,000 to $14,999',
  S2001_C05_006:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$15,000 to $24,999',
  S2001_C05_007:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$25,000 to $34,999',
  S2001_C05_008:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$35,000 to $49,999',
  S2001_C05_009:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$50,000 to $64,999',
  S2001_C05_010:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$65,000 to $74,999',
  S2001_C05_011:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$75,000 to $99,999',
  S2001_C05_012:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$100,000 or more',
  S2001_C05_013:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Median earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C05_014:
    'Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Mean earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C05_015:
    'Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings',
  S2001_C05_016:
    'Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Less than high school graduate',
  S2001_C05_017:
    'Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!High school graduate (includes equivalency)',
  S2001_C05_018:
    "Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Some college or associate's degree",
  S2001_C05_019:
    "Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Bachelor's degree",
  S2001_C05_020:
    'Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Graduate or professional degree',
  S2001_C06_001: 'Percent Female!!Population 16 years and over with earnings',
  S2001_C06_002:
    'Percent Female!!Population 16 years and over with earnings!!Median earnings (dollars)',
  S2001_C06_003:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS',
  S2001_C06_004:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$1 to $9,999 or loss',
  S2001_C06_005:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$10,000 to $14,999',
  S2001_C06_006:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$15,000 to $24,999',
  S2001_C06_007:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$25,000 to $34,999',
  S2001_C06_008:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$35,000 to $49,999',
  S2001_C06_009:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$50,000 to $64,999',
  S2001_C06_010:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$65,000 to $74,999',
  S2001_C06_011:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$75,000 to $99,999',
  S2001_C06_012:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!$100,000 or more',
  S2001_C06_013:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Median earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C06_014:
    'Percent Female!!Population 16 years and over with earnings!!FULL-TIME, YEAR-ROUND WORKERS WITH EARNINGS!!Mean earnings (dollars) for full-time, year-round workers with earnings',
  S2001_C06_015:
    'Percent Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings',
  S2001_C06_016:
    'Percent Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Less than high school graduate',
  S2001_C06_017:
    'Percent Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!High school graduate (includes equivalency)',
  S2001_C06_018:
    "Percent Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Some college or associate's degree",
  S2001_C06_019:
    "Percent Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Bachelor's degree",
  S2001_C06_020:
    'Percent Female!!MEDIAN EARNINGS BY EDUCATIONAL ATTAINMENT!!Population 25 years and over with earnings!!Graduate or professional degree',
};
