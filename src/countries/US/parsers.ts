import csv from 'csvtojson';
import { US_FilingStatus, US_States } from './constants';
import { getKeyByValue } from '../../lib/utilClient';
import * as fs from 'fs';

async function parseStateBrackets() {
  const brackets: any = {};
  const entries = await csv().fromFile('./src/brackets.csv');

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const next = entries[i + 1];
    const state = getState(entry) as string;
    if (!brackets[state]) {
      brackets[state] = {
        [US_FilingStatus.Single]: {
          deduction: ex(entry['Standard Deduction (Single)']),
          brackets: [],
        },
        [US_FilingStatus.MarriedFilingJointly]: {
          deduction: ex(entry['Standard Deduction (Couple)']),
          brackets: [],
        },
        exemption: {
          single: ex(entry['Personal Exemption (Single)']), // TODO: Fix credits NaN
          couple: ex(entry['Personal Exemption (Couple)']),
          dependent: ex(entry['Personal Exemption (Dependent)']),
        },
      };
    }

    if (entry['Single Filer Rates'] !== 'none') {
      brackets[state][US_FilingStatus.Single].brackets.push({
        min: integer(entry['Single Filer Brackets']),
        max:
          getState(next) === state
            ? integer(next['Single Filer Brackets'])
            : 'Infinity',
        rate: percentage(entry['Single Filer Rates']),
      });
    }

    if (entry['Married Filing Jointly Rates'] !== 'none') {
      brackets[state][US_FilingStatus.MarriedFilingJointly].brackets.push({
        min: integer(entry['Married Filing Jointly Brackets']),
        max:
          getState(next) === state
            ? integer(next['Married Filing Jointly Brackets'])
            : 'Infinity',
        rate: percentage(entry['Married Filing Jointly Rates']),
      });
    }
  }
}

async function parsePaygrades() {
  const entries = await csv().fromFile('./src/paygrades.csv');
  const paygrades: any = {};
  for (const entry of entries) {
    const grade = entry['Pay Grade'];
    if (!paygrades[grade]) {
      paygrades[grade] = Object.keys(entry).reduce((acc, key) => {
        if (key === 'Pay Grade') {
          return acc;
        }
        const value = parseFloat(entry[key]);
        if (key === '<2') {
          acc['0'] = value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
    }
  }
}

async function parseBAH() {
  const handle = async (variant: string) => {
    const entries = await csv({ delimiter: ';' }).fromFile(
      `./src/countries/US/military/assets/bah_${variant}_dependents.csv`
    );
    const bah: any = {};
    for (const entry of entries) {
      if (!bah[entry.MHA]) {
        const obj: any = {};
        for (const key in entry) {
          if (key === 'MHA') {
            continue;
          } else if (key === 'MHA_NAME') {
            obj.name = entry.MHA_NAME;
          } else {
            obj[key.replace('0', '-')] = parseInt(entry[key]);
          }
        }
        bah[entry.MHA] = obj;
      }
    }
    fs.writeFileSync(
      `./src/countries/US/military/mha-to-bah-${variant}.json`,
      JSON.stringify(bah, null, 2)
    );
  };

  await handle('with');
  await handle('without');
}

function ex(str: string) {
  return str !== 'n.a.' ? integer(str) : null;
}

function integer(str: string) {
  return parseInt(str.replace(/[$,]/g, ''));
}

function percentage(str: string) {
  return (
    Math.round((parseFloat(str.replace(/[%]/g, '')) + Number.EPSILON) * 100) /
    100
  );
}

function getState(entry: any) {
  if (entry) {
    return getKeyByValue(US_States, entry.State.split(' (')[0]);
  }
}
