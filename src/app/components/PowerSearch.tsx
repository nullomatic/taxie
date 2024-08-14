'use client';

import {
  ACSMetricData,
  ACSMetric,
  Locus,
  Operator,
  Order,
  OperatorLabel,
  OrderLabel,
} from '@/lib/constants';
import { Criterion, QueryData } from '@/lib/types';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function PowerSearch({
  queryData,
}: {
  queryData: QueryData | null;
}) {
  const [filters, setFilters] = useState(
    queryData?.criteria || ([] as (Criterion & { short: string })[])
  );
  const [selectedLocus, setSelectedLocus] = useState(
    queryData?.locus || Locus.City
  );
  const [selectedMetric, setSelectedMetric] = useState('' as ACSMetric);
  const [selectedOperator, setSelectedOperator] = useState('' as Operator);
  const [selectedThreshold, setSelectedThreshold] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('' as Order);

  const addFilterEnabled =
    !!selectedMetric && !!selectedOperator && !!selectedThreshold;

  const handleLocusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLocus(event.target.value as Locus);
  };

  const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMetric(event.target.value as ACSMetric);
  };

  const handleOperatorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOperator(event.target.value as Operator);
  };

  const handleThresholdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedThreshold(event.target.value);
  };

  const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrder(event.target.value as Order);
  };

  const handleAddFilter = () => {
    if (addFilterEnabled) {
      const attribute =
        ACSMetricData[selectedMetric as keyof typeof ACSMetricData];

      const newFilters = [...filters];
      const existingIndex = newFilters.findIndex(
        (filter) => filter.id === selectedMetric
      );
      if (existingIndex > -1) {
        newFilters.splice(existingIndex, 1);
      }

      const filter = {
        id: selectedMetric,
        short: attribute.short,
        operator: selectedOperator,
        threshold: selectedThreshold as unknown as number,
      } as Criterion;

      if (selectedOrder) {
        filter.order = selectedOrder;
      }

      console.log('filter:', filter);

      newFilters.push(filter);
      setFilters(newFilters);
    }
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const router = useRouter();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let params = [];
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      params.push(
        `id${i}=${filter.id}` +
          `&operator${i}=${filter.operator}` +
          `&threshold${i}=${filter.threshold}` +
          `${filter.order ? `&order${i}=${filter.order}` : ''}`
      );
    }
    const uri = `/search?locus=${selectedLocus}&${params.join('&')}`;
    router.push(uri);
  };

  return (
    <form
      className='border rounded-lg p-3 mt-3 mb-6 space-y-3'
      onSubmit={handleSubmit}
    >
      <div className='text-xl text-center font-bold'>Power Search</div>
      <div className='flex flex-col justify-center space-y-2'>
        <div className='text-gray-800 font-medium'>Locus</div>
        <div className='flex gap-3 justify-around mb-3'>
          <div className='flex items-center'>
            <input
              id='locus-radio-1'
              type='radio'
              value={Locus.ZIP}
              checked={selectedLocus === Locus.ZIP}
              onChange={handleLocusChange}
              name='locus-radio'
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <label
              htmlFor='locus-radio-1'
              className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              ZIP
            </label>
          </div>
          <div className='flex items-center'>
            <input
              id='locus-radio-2'
              type='radio'
              value={Locus.City}
              checked={selectedLocus === Locus.City}
              onChange={handleLocusChange}
              name='locus-radio'
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <label
              htmlFor='locus-radio-2'
              className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              City
            </label>
          </div>
          <div className='flex items-center'>
            <input
              id='locus-radio-3'
              type='radio'
              value={Locus.County}
              checked={selectedLocus === Locus.County}
              onChange={handleLocusChange}
              name='locus-radio'
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <label
              htmlFor='locus-radio-3'
              className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              County
            </label>
          </div>
          <div className='flex items-center'>
            <input
              id='locus-radio-4'
              type='radio'
              value={Locus.State}
              checked={selectedLocus === Locus.State}
              onChange={handleLocusChange}
              name='locus-radio'
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <label
              htmlFor='locus-radio-4'
              className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              State
            </label>
          </div>
        </div>

        <div className='text-gray-800 font-medium'>Add filter</div>
        <select
          id='filters'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          onChange={handleMetricChange}
        >
          <option>Choose an attribute</option>
          {Object.values(ACSMetric).map((id) => {
            return (
              <option value={id} key={`acs-metric-${id}`}>
                {ACSMetricData[id as ACSMetric].label}
              </option>
            );
          })}
        </select>
        <div className='flex gap-2'>
          {/* Select Operator */}
          <select
            id='operators'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            onChange={handleOperatorChange}
          >
            <option value=''>Choose an operator</option>
            {Object.values(Operator).map((id) => (
              <option value={id} key={`operator-${id}`}>
                {OperatorLabel[id as Operator]}
              </option>
            ))}
          </select>

          {/* Select Threshold */}
          <input
            type='number'
            value={selectedThreshold}
            onChange={handleThresholdChange}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          />
        </div>

        {/* Select Order */}
        <select
          id='order'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          onChange={handleOrderChange}
          defaultValue={''}
        >
          <option value=''>Sort: None</option>
          {Object.values(Order).map((id) => (
            <option value={id} key={`order-${id}`}>
              {OrderLabel[id as Order]}
            </option>
          ))}
        </select>
        <div className='pt-2 flex justify-center'>
          <button
            type='button'
            className={classNames('p-3 text-white rounded', {
              'bg-blue-600': addFilterEnabled,
              'bg-blue-300 pointer-events-none': !addFilterEnabled,
            })}
            onClick={handleAddFilter}
            disabled={!addFilterEnabled}
          >
            Add Filter
          </button>
        </div>
      </div>
      {/* Selected Filters */}
      <div className='text-gray-800 font-medium'>Selected Filters</div>
      <div className='flex flex-col gap-2 mb-3'>
        {filters.map((c, i: number) => (
          <div
            className='flex py-3 px-2 space-x-2 rounded bg-stone-200 text-xs items-center'
            key={`selected-filter-${i}`}
          >
            <div className='text-nowrap'>
              {ACSMetricData[c.id].short} {c.operator} {c.threshold} {c.order}
            </div>
            <button
              type='button'
              className='flex justify-center items-center shrink-0 cursor-pointer rounded bg-stone-300 h-6 w-6'
              onClick={() => handleRemoveFilter(i)}
            >
              <span>x</span>
            </button>
          </div>
        ))}
      </div>
      <div className='pt-2 flex justify-center'>
        <button className='p-3 bg-blue-600 text-white rounded'>
          Update Results
        </button>
      </div>
    </form>
  );
}
