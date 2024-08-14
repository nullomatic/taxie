'use client';
import classNames from 'classnames';
import React, { useState } from 'react';

export default function Slider({
  onSliderChange,
}: {
  onSliderChange: (value: number) => void;
}) {
  const [value, setValue] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    const percent = Math.pow(10, newValue / 50) * 10;
    setValue(newValue);
    onSliderChange(percent);
  };
  const median = 50000;
  const percent = Math.pow(10, value / 50) * 10;
  const multiplier = percent / 100;
  return (
    <div className='pb-3'>
      <label
        htmlFor='default-range'
        className='block text-sm font-medium text-gray-900 dark:text-white text-center'
      >
        <div className='text-sm text-stone-800'>Salary Adjuster</div>
        <div className='text-xs text-stone-500'>
          Percent of median income: {Math.round(percent)}% (multiplier:{' '}
          {multiplier.toFixed(2)})
        </div>
      </label>
      <input
        id='default-range'
        type='range'
        value={value}
        min={0}
        max={100}
        onChange={handleSliderChange}
        className={classNames('w-full accent-green-400 ')}
      />
      <div className='w-full relative text-xs text-stone-500 -top-1'>
        <div className='absolute left-0'>10%</div>
        <div className='absolute left-[20%]'>
          <span className='w-12 relative -left-1/2'>25%</span>
        </div>
        <div className='absolute left-[35%]'>
          <span className='w-12 relative -left-1/2'>50%</span>
        </div>
        <div className='absolute left-[50%]'>
          <span className='w-12 relative -left-1/2'>100%</span>
        </div>
        <div className='absolute left-[70%]'>
          <span className='w-12 relative -left-1/2'>250%</span>
        </div>
        <div className='absolute left-[85%]'>
          <span className='w-12 relative -left-1/2'>500%</span>
        </div>
        <div className='absolute right-0'>
          <span className='w-12 relative'>1000%</span>
        </div>
      </div>
    </div>
  );
}
