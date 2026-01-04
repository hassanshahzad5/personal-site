'use client';

import { useState, useSyncExternalStore, Suspense } from 'react';
import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';
import { powerliftingData } from '../data/powerlifting';
import { useTabParam } from '../hooks/useTabParam';

const kgToLbs = (kg: number) => (kg * 2.20462).toFixed(2);

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(dateStr: string, options: Intl.DateTimeFormatOptions): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', options);
}

const subscribeNoop = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

const getInitialMetric = () => {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const imperialLocales = ['en-US', 'en-LR', 'en-MM'];
  return !imperialLocales.some((l) => locale.startsWith(l.split('-')[0]) && locale === l);
};

const VALID_TABS = ['personal', 'meet-director', 'iron-fortress'] as const;
type FitnessTab = typeof VALID_TABS[number];

function FitnessContent() {
  const [section, setSection] = useTabParam<FitnessTab>(VALID_TABS, 'personal');
  const mounted = useSyncExternalStore(subscribeNoop, getMounted, getServerMounted);
  const initialMetric = useSyncExternalStore(subscribeNoop, getInitialMetric, () => true);
  const [useMetric, setUseMetric] = useState(initialMetric);

  const bests = powerliftingData;
  const unit = useMetric ? 'kg' : 'lbs';
  const convert = (kg: number) => (useMetric ? kg : kgToLbs(kg));

  const renderPersonalContent = () => (
    <div className='flex flex-col gap-6'>
      <div>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
          <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 text-center sm:text-left'>
            Personal Bests
          </h3>
          
          <div className='flex items-center justify-center sm:justify-end mt-2 sm:mt-0'>
            <div className='flex border dark:border-neutral-700 light:border-neutral-300 rounded-md overflow-hidden'>
              <button
                type='button'
                onClick={() => setUseMetric(true)}
                className={`px-3 py-1 text-xs cursor-pointer transition-all duration-200
                  ${useMetric
                    ? 'dark:bg-neutral-800 dark:text-neutral-100 light:bg-neutral-200 light:text-neutral-900'
                    : 'dark:bg-transparent dark:text-neutral-500 light:bg-transparent light:text-neutral-500 hover:dark:text-neutral-300 hover:light:text-neutral-700'
                  }`}
              >
                kg
              </button>
              <button
                type='button'
                onClick={() => setUseMetric(false)}
                className={`px-3 py-1 text-xs cursor-pointer transition-all duration-200 border-l dark:border-neutral-700 light:border-neutral-300
                  ${!useMetric
                    ? 'dark:bg-neutral-800 dark:text-neutral-100 light:bg-neutral-200 light:text-neutral-900'
                    : 'dark:bg-transparent dark:text-neutral-500 light:bg-transparent light:text-neutral-500 hover:dark:text-neutral-300 hover:light:text-neutral-700'
                  }`}
              >
                lbs
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-4 gap-2'>
          {[
            { label: 'SQ', value: convert(bests.squat) },
            { label: 'BP', value: convert(bests.bench) },
            { label: 'DL', value: convert(bests.deadlift) },
            { label: 'Total', value: convert(bests.total) },
          ].map((lift) => (
            <div
              key={lift.label}
              className='flex flex-col items-center justify-center p-2.5 rounded-md min-h-[56px]
                         dark:bg-neutral-800/30 light:bg-neutral-50
                         border dark:border-neutral-800 light:border-neutral-200'
            >
              <span className='text-sm sm:text-base font-semibold dark:text-neutral-100 light:text-neutral-900 tabular-nums'>
                {lift.value}
                <span className='text-[10px] sm:text-xs font-normal ml-0.5 dark:text-neutral-500 light:text-neutral-500'>{unit}</span>
              </span>
              <span className='text-[10px] sm:text-xs dark:text-neutral-500 light:text-neutral-500 mt-0.5'>
                {lift.label}
              </span>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-2 gap-2 mt-2'>
          {[
            { label: 'BW', value: convert(bests.bodyweight), showUnit: true },
            { label: 'DOTS', value: bests.dots.toFixed(2), showUnit: false },
          ].map((lift) => (
            <div
              key={lift.label}
              className='flex flex-col items-center justify-center p-2.5 rounded-md min-h-[56px]
                         dark:bg-neutral-800/30 light:bg-neutral-50
                         border dark:border-neutral-800 light:border-neutral-200'
            >
              <span className='text-sm sm:text-base font-semibold dark:text-neutral-100 light:text-neutral-900 tabular-nums'>
                {lift.value}
                {lift.showUnit && <span className='text-[10px] sm:text-xs font-normal ml-0.5 dark:text-neutral-500 light:text-neutral-500'>{unit}</span>}
              </span>
              <span className='text-[10px] sm:text-xs dark:text-neutral-500 light:text-neutral-500 mt-0.5'>
                {lift.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='border-t dark:border-neutral-800 light:border-neutral-200'></div>

      <div>
        <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 text-center sm:text-left mb-4'>
          Records
        </h3>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {bests.records.map((record, idx) => (
            <div
              key={idx}
              className='group relative p-4 rounded-lg overflow-hidden
                         dark:bg-neutral-800/20 light:bg-neutral-50
                         border dark:border-neutral-800 light:border-neutral-200
                         hover:dark:border-neutral-700 hover:light:border-neutral-300
                         transition-all duration-300'
            >
              <div className='flex items-center justify-between gap-4'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-[10px] uppercase tracking-wider dark:text-neutral-500 light:text-neutral-500'>
                      {record.type}
                    </span>
                    <span className='text-[10px] dark:text-neutral-600 light:text-neutral-400'>
                      {formatDate(record.date, { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h4 className='text-base font-semibold dark:text-neutral-100 light:text-neutral-900 truncate'>
                    {record.lift}
                  </h4>
                  <p className='text-xs dark:text-neutral-500 light:text-neutral-500 mt-0.5'>
                    {record.division} · {record.weightClass}
                  </p>
                </div>
                
                <div className='shrink-0 text-right px-3 py-2 rounded-md
                                dark:bg-neutral-800/60 light:bg-neutral-100
                                border dark:border-neutral-700/50 light:border-neutral-300'>
                  <span className='text-2xl sm:text-3xl font-bold dark:text-neutral-50 light:text-neutral-900 tabular-nums'>
                    {convert(record.weight)}
                  </span>
                  <span className='text-sm font-medium dark:text-neutral-400 light:text-neutral-600 ml-1'>
                    {unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center justify-between pt-4'>
          <span className='text-xs dark:text-neutral-500 light:text-neutral-500'>
            {bests.records.length} Colorado State Records
          </span>
          <a
            href='https://usapl.liftingdatabase.com/lifters-view?id=135980'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 text-xs
                       underline underline-offset-2
                       dark:text-neutral-500 light:text-neutral-500 
                       hover:dark:text-neutral-300 hover:light:text-neutral-700 transition-colors'
          >
            View all <FiExternalLink className='w-3 h-3' />
          </a>
        </div>
      </div>

      <div className='border-t dark:border-neutral-800 light:border-neutral-200'></div>

      <div>
        <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 text-center sm:text-left mb-4'>
          Competitions
        </h3>

        <div className='flex flex-col'>
          {bests.meets.map((meet, idx) => {
            const isLast = idx === bests.meets.length - 1;
            return (
              <div
                key={idx}
                className='flex flex-col sm:flex-row relative'
              >
                <div className={`flex-1 ${!isLast ? 'pb-5' : ''}`}>
                  <div className='flex items-center gap-3 sm:gap-4 mb-1'>
                    <div className='hidden sm:block w-3 h-3 rounded-full dark:bg-neutral-700 light:bg-neutral-300 shrink-0
                                    border-2 dark:border-neutral-900 light:border-white'></div>
                    <p className='text-sm dark:text-neutral-500 light:text-neutral-500 text-center sm:text-left w-full sm:w-auto'>
                      {formatDate(meet.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className='sm:ml-7 flex flex-col mb-3'>
                    <div className='text-center sm:text-left'>
                      <h4 className='text-lg sm:text-xl font-semibold dark:text-neutral-100 light:text-neutral-900'>
                        {meet.usaplUrl ? (
                          <a
                            href={meet.usaplUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1.5 hover:underline underline-offset-2 transition-colors'
                          >
                            {meet.name}
                            <FiExternalLink className='w-3.5 h-3.5 dark:text-neutral-500 light:text-neutral-400' />
                          </a>
                        ) : (
                          meet.name
                        )}
                      </h4>
                    </div>
                    
                    <div className='flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2'>
                      {meet.placements.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className={`text-[11px] px-1.5 py-0.5 rounded border
                            ${p.place === 1 
                              ? 'dark:bg-amber-900/30 light:bg-amber-50 dark:text-amber-300 light:text-amber-700 dark:border-amber-700/40 light:border-amber-300'
                              : p.place === 2 
                                ? 'dark:bg-neutral-600/30 light:bg-neutral-100 dark:text-neutral-300 light:text-neutral-600 dark:border-neutral-500/40 light:border-neutral-300'
                                : p.place === 3
                                  ? 'dark:bg-orange-900/30 light:bg-orange-50 dark:text-orange-300 light:text-orange-700 dark:border-orange-700/40 light:border-orange-300'
                                  : 'dark:bg-neutral-800/60 light:bg-neutral-100 dark:text-neutral-400 light:text-neutral-600 dark:border-neutral-700/50 light:border-neutral-300/50'
                            }`}
                        >
                          {getOrdinal(p.place)} {p.division}
                        </span>
                      ))}
                    </div>
                  
                    <div className='grid grid-cols-4 md:grid-cols-6 gap-1.5 mt-3'>
                      {[
                        { label: 'SQ', value: convert(meet.squat), showUnit: true, span: 'md:order-2' },
                        { label: 'BP', value: convert(meet.bench), showUnit: true, span: 'md:order-3' },
                        { label: 'DL', value: convert(meet.deadlift), showUnit: true, span: 'md:order-4' },
                        { label: 'Total', value: convert(meet.total), showUnit: true, span: 'md:order-5' },
                        { label: 'BW', value: convert(meet.bodyweight), showUnit: true, span: 'col-span-2 md:col-span-1 md:order-1' },
                        { label: 'DOTS', value: meet.dots.toFixed(2), showUnit: false, span: 'col-span-2 md:col-span-1 md:order-6' },
                      ].map((lift) => (
                        <div 
                          key={lift.label}
                          className={`flex flex-col items-center justify-center px-2 py-2 rounded dark:bg-neutral-800/40 light:bg-neutral-50 border dark:border-neutral-800 light:border-neutral-200 min-h-[48px] ${lift.span}`}
                        >
                          <span className='text-xs font-medium dark:text-neutral-300 light:text-neutral-700 tabular-nums'>
                            {lift.value}{lift.showUnit && unit}
                          </span>
                          <span className='text-[9px] dark:text-neutral-500 light:text-neutral-500 mt-0.5'>{lift.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {!isLast && (
                    <div className='hidden sm:block absolute left-[5px] top-[20px] bottom-0 w-px dark:bg-neutral-800 light:bg-neutral-300'></div>
                  )}
                </div>
              </div>
            );
          })}
          
          <div className='flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t dark:border-neutral-800 light:border-neutral-200'>
            <a
              href='https://www.openpowerlifting.org/u/hassanshahzad'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-sm 
                         underline underline-offset-2
                         dark:text-neutral-500 light:text-neutral-500 
                         hover:dark:text-neutral-300 hover:light:text-neutral-700 
                         transition-colors'
            >
              OpenPowerlifting <FiExternalLink className='w-3 h-3' />
            </a>
            <a
              href='https://usapl.liftingdatabase.com/lifters-view?id=135980'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-sm 
                         underline underline-offset-2
                         dark:text-neutral-500 light:text-neutral-500 
                         hover:dark:text-neutral-300 hover:light:text-neutral-700 
                         transition-colors'
            >
              USAPL Lifting Database <FiExternalLink className='w-3 h-3' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIronFortressContent = () => (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='mb-4'>
        <Image
          src='/IronFortress-White.png'
          alt='Iron Fortress Powerlifting'
          width={120}
          height={120}
          className='hidden dark:block'
        />
        <Image
          src='/IronFortress-Black.png'
          alt='Iron Fortress Powerlifting'
          width={120}
          height={120}
          className='block dark:hidden'
        />
      </div>
      <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-2'>
        Iron Fortress Powerlifting
      </h3>
      <p className='text-sm dark:text-neutral-500 light:text-neutral-500 max-w-md mb-4'>
        Content coming soon. Transformations, philosophy, and team highlights.
      </p>
      <div className='flex flex-row gap-3'>
        <a
          href='https://www.instagram.com/ironfortressfit_/'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                     dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700
                     light:bg-neutral-100 light:text-neutral-900 light:hover:bg-neutral-200
                     border dark:border-neutral-700 light:border-neutral-300 transition-colors'
        >
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
          </svg>
          Instagram
        </a>
        <a
          href='https://ironfortressfitness.com/'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                     dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200
                     light:bg-neutral-900 light:text-neutral-100 light:hover:bg-neutral-800
                     transition-colors'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
          </svg>
          Shop
        </a>
      </div>
    </div>
  );

  const meets = [
    {
      name: 'Colorado Collegiate Showdown 2025: Beyond the Barbell',
      subtitle: null,
      date: '2025-04-20',
      location: 'Denver, CO',
      type: 'Mock Meet',
      raised: '$25k+',
      logo: '/Logo_CCS_2025.png',
      stats: {
        totalLifters: 63,
        teams: 5,
        sessions: 2,
        flights: 6,
        sponsors: 24,
        volunteers: 48,
      },
      description: '<strong>The largest collegiate-only powerlifting meet in Colorado.</strong> More than doubled participation from Year 1, bringing together <strong>5 teams</strong>: CU Boulder, CU Denver, CSU, CO School of Mines, and Regis University. <strong>Sold out in 2 months.</strong> Led as CEO alongside Amelia Henning (COO) and Jake Higgins (CFO), coordinating a cross-functional team across 2 universities. Reduced athlete registration costs by <strong>~87%</strong> ($20-$30 vs $200+ for sanctioned meets) by securing <strong>$25k+ in sponsorships</strong> through direct outreach, sponsor meetings, and delivering value via social media promotion and member engagement. Coordinated 48 volunteers and hired paid USAPL referees. Produced custom merch, stickers, tote bags, and backdrops. Every lifter received free professional photo/video, custom goody bags with sponsor gifts, and food for athletes, volunteers, coaches, and spectators throughout the day. Gave away <strong>$2,100+ in cash prizes</strong>, gift cards, and raffles. Best team awards with cash prizes. Built to bring people together for a day of lifting, fun, and community.',
      media: [],
    },
    {
      name: 'Colorado Collegiate Showdown 2024',
      subtitle: null,
      date: '2024-04-27',
      location: 'Gunbarrel, CO',
      type: 'Mock Meet',
      raised: '$10k+',
      logo: '/Logo_CCS_2024.png',
      stats: {
        totalLifters: 29,
        teams: 4,
        sessions: 1,
        flights: 3,
        sponsors: 14,
        volunteers: 19,
      },
      description: '<strong>The largest collegiate-only powerlifting meet in Colorado.</strong> Inaugural event bringing together <strong>4 teams</strong>: CU Boulder, CU Denver, CSU, and CO School of Mines. <strong>Sold out in 1 month.</strong> Led as CEO alongside Amelia Henning (COO) and the CU Boulder Barbell leadership team. Reduced athlete registration costs by <strong>~97%</strong> ($5-$15 vs $200+ for sanctioned meets) by securing <strong>$10k+ in sponsorships</strong> through direct outreach, sponsor meetings, and delivering value via social media promotion and member engagement. Coordinated 19 volunteers and hired paid WRPF referees. Produced custom merch, stickers, tote bags, and backdrops. Every lifter received free professional photo/video, custom goody bags with sponsor gifts, and food for athletes, volunteers, and coaches throughout the day. Gave away <strong>$1,700+ in cash prizes</strong>, gift cards, and raffles. Best team awards with cash prizes. Built to bring people together for a day of lifting, fun, and community.',
      media: [],
    },
  ];

  const renderMeetDirectorContent = () => (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
        <div className='flex flex-col items-center justify-center p-3 rounded-md min-h-[64px] dark:bg-neutral-800/30 light:bg-neutral-50 border dark:border-neutral-800 light:border-neutral-200'>
          <span className='text-xl sm:text-2xl font-bold dark:text-neutral-100 light:text-neutral-900 tabular-nums'>2</span>
          <span className='text-[10px] sm:text-xs dark:text-neutral-500 light:text-neutral-500'>Events</span>
        </div>
        <div className='flex flex-col items-center justify-center p-3 rounded-md min-h-[64px] dark:bg-neutral-800/30 light:bg-neutral-50 border dark:border-neutral-800 light:border-neutral-200'>
          <span className='text-xl sm:text-2xl font-bold dark:text-neutral-100 light:text-neutral-900 tabular-nums'>92</span>
          <span className='text-[10px] sm:text-xs dark:text-neutral-500 light:text-neutral-500'>Lifters</span>
        </div>
        <div className='flex flex-col items-center justify-center p-3 rounded-md min-h-[64px] dark:bg-neutral-800/30 light:bg-neutral-50 border dark:border-neutral-800 light:border-neutral-200'>
          <span className='text-xl sm:text-2xl font-bold dark:text-neutral-100 light:text-neutral-900 tabular-nums'>67</span>
          <span className='text-[10px] sm:text-xs dark:text-neutral-500 light:text-neutral-500'>Volunteers</span>
        </div>
        <div className='flex flex-col items-center justify-center p-3 rounded-md min-h-[64px] dark:bg-neutral-800/30 light:bg-neutral-50 border dark:border-neutral-800 light:border-neutral-200'>
          <span className='text-xl sm:text-2xl font-bold dark:text-neutral-100 light:text-neutral-900 tabular-nums'>38</span>
          <span className='text-[10px] sm:text-xs dark:text-neutral-500 light:text-neutral-500'>Sponsors</span>
        </div>
        <div className='col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-md min-h-[64px] dark:bg-neutral-800/30 light:bg-neutral-50 border dark:border-neutral-800 light:border-neutral-200'>
          <span className='text-xl sm:text-2xl font-bold dark:text-neutral-100 light:text-neutral-900 tabular-nums'>$35k+</span>
          <span className='text-[10px] sm:text-xs dark:text-neutral-500 light:text-neutral-500'>Raised</span>
        </div>
      </div>

      <div className='border-t dark:border-neutral-800 light:border-neutral-200'></div>

      <div className='flex flex-col'>
        {meets.map((meet, idx) => {
          const isLast = idx === meets.length - 1;
          return (
            <div
              key={idx}
              className='flex flex-col sm:flex-row relative'
            >
              <div className='hidden sm:flex flex-col items-center mr-4 lg:mr-5'>
                <div className='w-3 h-3 rounded-full dark:bg-neutral-700 light:bg-neutral-300 shrink-0 z-10 
                                border-2 dark:border-neutral-900 light:border-white'></div>
                {!isLast && (
                  <div className='w-px grow dark:bg-neutral-800 light:bg-neutral-300'></div>
                )}
              </div>

              <div className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
                <div className='flex flex-col sm:flex-row sm:items-start gap-4 mb-3'>
                  {meet.logo && (
                    <div className='flex justify-center sm:justify-start shrink-0'>
                      <div className='w-20 h-20 rounded-lg bg-white p-2 flex items-center justify-center'>
                        <Image
                          src={meet.logo}
                          alt={`${meet.name} logo`}
                          width={64}
                          height={64}
                          className='object-contain w-full h-full'
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className='text-center sm:text-left flex-1'>
                    <p className='text-sm dark:text-neutral-500 light:text-neutral-500'>
                      {formatDate(meet.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h4 className='text-lg sm:text-xl font-semibold dark:text-neutral-100 light:text-neutral-900 mt-0.5'>
                      {meet.name}
                    </h4>
                    {meet.subtitle && (
                      <p className='text-sm italic dark:text-neutral-400 light:text-neutral-600'>
                        {meet.subtitle}
                      </p>
                    )}
                    <p className='text-xs dark:text-neutral-500 light:text-neutral-500 mt-1'>
                      {meet.location} · {meet.type}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-start gap-1.5 mb-3'>
                  <span className='px-2 py-1 text-[11px] sm:text-xs rounded dark:bg-neutral-800/60 light:bg-neutral-100 dark:text-neutral-300 light:text-neutral-700 border dark:border-neutral-700/50 light:border-neutral-300/50 text-center'>
                    {meet.stats.totalLifters} Lifters
                  </span>
                  <span className='px-2 py-1 text-[11px] sm:text-xs rounded dark:bg-neutral-800/40 light:bg-neutral-50 dark:text-neutral-400 light:text-neutral-600 border dark:border-neutral-800 light:border-neutral-200 text-center'>
                    {meet.stats.teams} Teams
                  </span>
                  <span className='px-2 py-1 text-[11px] sm:text-xs rounded dark:bg-neutral-800/40 light:bg-neutral-50 dark:text-neutral-400 light:text-neutral-600 border dark:border-neutral-800 light:border-neutral-200 text-center'>
                    {meet.stats.volunteers} Staff
                  </span>
                  <span className='px-2 py-1 text-[11px] sm:text-xs rounded dark:bg-neutral-800/40 light:bg-neutral-50 dark:text-neutral-400 light:text-neutral-600 border dark:border-neutral-800 light:border-neutral-200 text-center'>
                    {meet.stats.sessions}S / {meet.stats.flights}F
                  </span>
                  <span className='px-2 py-1 text-[11px] sm:text-xs rounded dark:bg-neutral-800/40 light:bg-neutral-50 dark:text-neutral-400 light:text-neutral-600 border dark:border-neutral-800 light:border-neutral-200 text-center'>
                    {meet.stats.sponsors} Sponsors
                  </span>
                  <span className='px-2 py-1 text-[11px] sm:text-xs rounded dark:bg-neutral-800/40 light:bg-neutral-50 dark:text-neutral-400 light:text-neutral-600 border dark:border-neutral-800 light:border-neutral-200 text-center'>
                    {meet.raised}
                  </span>
                </div>

                <p 
                  className='text-sm dark:text-neutral-400 light:text-neutral-600 leading-relaxed mb-4 [&>strong]:dark:text-neutral-200 [&>strong]:light:text-neutral-800 [&>strong]:font-semibold'
                  dangerouslySetInnerHTML={{ __html: meet.description }}
                />

                {meet.media && meet.media.length > 0 ? (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  </div>
                ) : (
                  <div className='flex items-center justify-center py-6 rounded-md border border-dashed dark:border-neutral-800 light:border-neutral-300'>
                    <span className='text-xs dark:text-neutral-600 light:text-neutral-400'>Media coming soon</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case 'personal':
        return renderPersonalContent();
      case 'meet-director':
        return renderMeetDirectorContent();
      case 'iron-fortress':
        return renderIronFortressContent();
      default:
        return null;
    }
  };

  return (
    <section className='custom-section'>
      <div className={`w-full flex flex-col justify-center sm:justify-between items-center card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-1'>
          Fitness
        </h2>
        <p className='text-sm dark:text-neutral-500 light:text-neutral-500 mb-3 text-center w-full'>
          Building Iron Fortress Powerlifting · Former President of CU Boulder Barbell
        </p>

        <nav className='w-full flex flex-row border dark:border-neutral-800 light:border-neutral-200 rounded-md overflow-hidden'>
          <button
            type='button'
            onClick={() => setSection('personal')}
            className={`clickable base-navtab experience-navtab ${section === 'personal' ? 'experience-navtab-active' : ''}`}
          >
            Personal
          </button>
          <button
            type='button'
            onClick={() => setSection('meet-director')}
            className={`clickable base-navtab experience-navtab ${section === 'meet-director' ? 'experience-navtab-active' : ''}`}
          >
            Meet Director
          </button>
          <button
            type='button'
            onClick={() => setSection('iron-fortress')}
            className={`clickable base-navtab experience-navtab ${section === 'iron-fortress' ? 'experience-navtab-active' : ''}`}
          >
            Iron Fortress
          </button>
        </nav>

        <article 
          key={section}
          className='w-full mt-4 flex flex-col animate-fade-in'
        >
          {renderContent()}
        </article>
      </div>
    </section>
  );
}

export default function FitnessPage() {
  return (
    <Suspense fallback={
      <section className='custom-section'>
        <div className='w-full flex flex-col justify-center sm:justify-between items-center card p-5 opacity-0'>
          <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-1'>
            Fitness
          </h2>
        </div>
      </section>
    }>
      <FitnessContent />
    </Suspense>
  );
}
