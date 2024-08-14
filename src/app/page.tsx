import { Query } from '@/lib/query';
//import Results from './components/Results';
import { US_Calculator } from '@/lib/calculators';
import { ACSMetric, CountryCode, US_States } from '@/lib/constants';
import { QueryData } from '@/lib/types';

export default async function Home() {
  // const queryData: QueryData = {
  //   locus: Locus.City,
  //   criteria: [
  //     {
  //       id: ACSMetric.PercentPopulationWhite,
  //       label: 'white_percent',
  //       type: 'percent',
  //       aggregator: 'avg',
  //       operator: '>',
  //       value: 90,
  //       order: 'desc',
  //     },
  //     {
  //       id: 'DP05_0001',
  //       label: 'total_pop',
  //       type: 'estimate',
  //       aggregator: 'sum',
  //       operator: '>',
  //       value: 10000,
  //     },
  //     {
  //       id: 'S2001_C01_002',
  //       label: 'median_income',
  //       type: 'estimate',
  //       aggregator: 'avg',
  //       operator: '>',
  //       value: 10000,
  //     },
  //   ],
  // };
  // const results = await Query.run(queryData);
  // return (
  //   <div>
  //     <div className='border rounded-lg p-3 mt-3 mb-6 space-y-3'>
  //       <div className='text-xl text-center font-bold'>Power Search</div>
  //       <div className='text-gray-800 font-medium'>Add filter</div>
  //       <form className='flex flex-col justify-center space-y-2'>
  //         <div className='flex gap-3 justify-around mb-3'>
  //           <div className='flex items-center'>
  //             <input
  //               id='default-radio-1'
  //               type='radio'
  //               value='value_1'
  //               name='default-radio'
  //               className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
  //             />
  //             <label
  //               htmlFor='default-radio-1'
  //               className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
  //             >
  //               ZIP
  //             </label>
  //           </div>
  //           <div className='flex items-center'>
  //             <input
  //               checked
  //               id='default-radio-2'
  //               type='radio'
  //               value='value_2'
  //               name='default-radio'
  //               className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
  //             />
  //             <label
  //               htmlFor='default-radio-2'
  //               className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
  //             >
  //               City
  //             </label>
  //           </div>
  //           <div className='flex items-center'>
  //             <input
  //               checked
  //               id='default-radio-3'
  //               type='radio'
  //               value='value_3'
  //               name='default-radio'
  //               className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
  //             />
  //             <label
  //               htmlFor='default-radio-3'
  //               className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
  //             >
  //               County
  //             </label>
  //           </div>
  //           <div className='flex items-center'>
  //             <input
  //               checked
  //               id='default-radio-4'
  //               type='radio'
  //               value='value_4'
  //               name='default-radio'
  //               className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
  //             />
  //             <label
  //               htmlFor='default-radio-4'
  //               className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
  //             >
  //               State
  //             </label>
  //           </div>
  //         </div>
  //         <select
  //           id='criteria'
  //           className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
  //         >
  //           <option selected>Choose a criterion</option>
  //           <option value='stat_id'>Total population</option>
  //           <option value='stat_id'>Demographic, total</option>
  //           <option value='stat_id'>Demographic, %</option>
  //           <option value='stat_id'>Median income</option>
  //         </select>
  //         <div className='flex gap-2'>
  //           <select
  //             id='operators'
  //             className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
  //           >
  //             <option selected>Choose an operator</option>
  //             <option value='>'>greater than</option>
  //             <option value='<'>less than</option>
  //           </select>
  //           <input
  //             type='number'
  //             value='10000'
  //             className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
  //           />
  //         </div>
  //         <select
  //           id='order'
  //           className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
  //         >
  //           <option selected>Order by</option>
  //           <option value='asc'>Ascending</option>
  //           <option value='desc'>Descending</option>
  //         </select>
  //         <div className='pt-2 flex justify-center'>
  //           <button className='p-3 bg-blue-600 text-white rounded'>
  //             Add Filter
  //           </button>
  //         </div>
  //       </form>
  //       <div className='text-gray-800 font-medium'>Selected Filters</div>
  //       <div className='flex flex-wrap gap-2 mb-3'>
  //         {queryData.criteria.map((c) => (
  //           <div className='flex py-3 px-2 space-x-2 rounded bg-stone-200 text-xs items-center'>
  //             <div className='text-nowrap'>
  //               {c.label} {c.operator} {c.value}
  //             </div>
  //             <button className='flex justify-center items-center shrink-0 cursor-pointer rounded bg-stone-300 h-6 w-6'>
  //               <span>x</span>
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     <div className='flex justify-between border-b'>
  //       <div className='text-xl'>Results</div>
  //       <div className='text-stone-500'>1-10 of {results.length}</div>
  //     </div>
  //     <Results results={results.slice(0, 10)} />
  //   </div>
  // );
}
