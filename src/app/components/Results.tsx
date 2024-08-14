'use client';

import Slider from './Slider';
import { useState } from 'react';
import { formatMetric } from '@/lib/utilClient';
import classNames from 'classnames';
import Image from 'next/image';
import { US_Calculator } from '@/lib/calculators';
import {
  ACSMetric,
  ACSMetricData,
  CountryCode,
  Metric,
  US_States,
} from '@/lib/constants';
import { QueryData } from '@/lib/types';

export default function Results({
  queryData,
  results,
}: {
  queryData: QueryData | null;
  results: Record<string, string | number>[];
}) {
  const [percent, setPercent] = useState(100);
  const [multiplier, setMultiplier] = useState(1);

  const handleSliderChange = (value: number) => {
    setPercent(value);
    setMultiplier(value / 100);
  };

  const savingsSettings = {
    years: 5,
    apy: 0.04,
  };

  const resultsUpdated = results
    .slice(0, 10)
    .map((result: Record<string, any>) => {
      if (result[ACSMetric.MedianIncome]) {
        const calculator = new US_Calculator({
          country: CountryCode.US,
          salary: parseInt(result[ACSMetric.MedianIncome]) * multiplier,
          years: savingsSettings.years,
          apy: savingsSettings.apy,
          expenses: [
            { name: 'rent', amount: 1400 },
            { name: 'food', amount: 500 },
            { name: 'car', amount: 250 },
            { name: 'fun', amount: 150 },
          ],
          state: US_States[result.state_id as keyof typeof US_States],
        });
        const { finalBalance } = calculator.run();
        result.finalBalance = finalBalance;
      }
      return result;
    });

  return (
    <div className='grow py-3'>
      <Slider onSliderChange={handleSliderChange} />
      <div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-3 2xl:grid-cols-4'>
        {resultsUpdated.map((result: Record<string, any>, i: number) => (
          <div
            className='bg-stone-100 rounded-lg flex flex-col overflow-hidden shadow'
            key={`result-${i}`}
          >
            <div>
              <Image
                src={`https://picsum.photos/seed/${result.city_name}/600/400`}
                alt=''
                width={600}
                height={400}
                className='w-full'
              />
            </div>
            <div className='p-3 leading-none'>
              <div className='text-2xl font-bold mb-3'>
                {result.city_name}, {result.state_id}
              </div>

              <div className='pl-2 space-y-5'>
                {/* Default Statistics */}
                <div className='space-y-1.5'>
                  <div className='space-x-1 flex'>
                    <span>County:</span>
                    <span className='grow border-b'></span>
                    <span className='font-medium'>{result.county_name}</span>
                  </div>
                  <div className='space-x-1 flex'>
                    <span>Median income:</span>
                    <span className='grow border-b'></span>
                    {result[ACSMetric.MedianIncome] ? (
                      <span className='font-medium'>
                        {formatMetric(
                          result[ACSMetric.MedianIncome],
                          Metric.Monetary
                        )}
                      </span>
                    ) : (
                      <span className='text-stone-400'>No Data</span>
                    )}
                  </div>
                  <div className='space-x-1 flex'>
                    <span>Total population:</span>
                    <span className='grow border-b'></span>
                    <span className='font-medium'>
                      {formatMetric(
                        result[ACSMetric.TotalPopulation],
                        Metric.Integer
                      )}
                    </span>
                  </div>
                </div>

                {/* User-selected Statistics */}
                <div className='space-y-1.5'>
                  {queryData?.criteria.map((c, i) => (
                    <div className='space-x-1 flex' key={`stat-${i}`}>
                      <span>{ACSMetricData[c.id].emoji}</span>
                      <span>{ACSMetricData[c.id].label}:</span>
                      <span className='grow border-b'></span>
                      <span className='font-medium'>
                        {formatMetric(
                          result[c.id],
                          ACSMetricData[c.id].display
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className='space-y-1.5'>
                  <div className='flex space-x-1'>
                    <span>Adjusted income:</span>
                    <span className='grow border-b'></span>
                    {result[ACSMetric.MedianIncome] ? (
                      <>
                        {percent !== 100 && (
                          <span
                            className={classNames('text-xs font-medium', {
                              'text-green-500': percent > 100,
                              'text-red-500': percent < 100,
                            })}
                          >
                            {percent > 100 ? '+' : '-'}
                            {formatMetric(
                              Math.abs(
                                result[ACSMetric.MedianIncome] * multiplier -
                                  result[ACSMetric.MedianIncome]
                              ),
                              Metric.Monetary
                            )}
                          </span>
                        )}
                        <span className='font-medium'>
                          {formatMetric(
                            result[ACSMetric.MedianIncome] * multiplier,
                            Metric.Monetary
                          )}
                        </span>
                      </>
                    ) : (
                      <span className='text-stone-400'>No Data</span>
                    )}
                  </div>
                  <div className='flex space-x-1'>
                    <span>Final balance:&nbsp;</span>
                    <span className='grow border-b'></span>
                    {result[ACSMetric.MedianIncome] ? (
                      <span
                        className={classNames('font-medium', {
                          'text-green-500': result.finalBalance > 0,
                          'text-red-500': result.finalBalance < 0,
                        })}
                      >
                        {result.finalBalance < 0 && '-'}
                        {formatMetric(
                          Math.abs(result.finalBalance),
                          Metric.Monetary
                        )}
                      </span>
                    ) : (
                      <span className='text-stone-400'>No Data</span>
                    )}
                  </div>
                  <div className='text-xs'>
                    <span>
                      {savingsSettings.years} years at{' '}
                      {(savingsSettings.apy * 100).toFixed(1)}% APY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
