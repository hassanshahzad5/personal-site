'use client';

import { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';
import { powerliftingData } from '../data/powerlifting';

const kgToLbs = (kg: number) => (kg * 2.20462).toFixed(2);

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Hydration-safe mounted state
const subscribeNoop = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

// Detect initial metric preference from locale
const getInitialMetric = () => {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const imperialLocales = ['en-US', 'en-LR', 'en-MM'];
  return !imperialLocales.some((l) => locale.startsWith(l.split('-')[0]) && locale === l);
};

export default function FitnessPage() {
  const [section, setSection] = useState<'personal' | 'coaching' | 'meet-director'>('personal');
  const mounted = useSyncExternalStore(subscribeNoop, getMounted, getServerMounted);
  // Initialize with locale preference, but allow user to toggle
  const initialMetric = useSyncExternalStore(subscribeNoop, getInitialMetric, () => true);
  const [useMetric, setUseMetric] = useState(initialMetric);

  const bests = powerliftingData;
  const unit = useMetric ? 'kg' : 'lbs';
  const convert = (kg: number) => (useMetric ? kg : kgToLbs(kg));

  const renderPersonalContent = () => (
    <div className='flex flex-col gap-6'>
      {/* Personal Bests Section */}
      <div>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
          <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 text-center sm:text-left'>
            Personal Bests
          </h3>
          
          {/* Unit Toggle */}
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

        <div className='grid grid-cols-4 sm:grid-cols-6 gap-2'>
          {[
            { label: 'SQ', value: convert(bests.squat), order: 'sm:order-2', span: '' },
            { label: 'BP', value: convert(bests.bench), order: 'sm:order-3', span: '' },
            { label: 'DL', value: convert(bests.deadlift), order: 'sm:order-4', span: '' },
            { label: 'Total', value: convert(bests.total), order: 'sm:order-5', span: '' },
            { label: 'BW', value: convert(bests.bodyweight), order: 'sm:order-1', span: 'col-span-2 sm:col-span-1' },
            { label: 'DOTS', value: bests.dots.toFixed(2), noUnit: true, order: 'sm:order-6', span: 'col-span-2 sm:col-span-1' },
          ].map((lift) => (
            <div
              key={lift.label}
              className={`flex flex-col items-center justify-center p-2.5 rounded-md min-h-[56px]
                         dark:bg-neutral-800/30 light:bg-neutral-50
                         border dark:border-neutral-800 light:border-neutral-200 ${lift.order} ${lift.span}`}
            >
              <span className='text-sm sm:text-base font-semibold dark:text-neutral-100 light:text-neutral-900 tabular-nums'>
                {lift.value}
                {!lift.noUnit && <span className='text-[10px] sm:text-xs font-normal ml-0.5 dark:text-neutral-500 light:text-neutral-500'>{unit}</span>}
              </span>
              <span className='text-[10px] sm:text-xs dark:text-neutral-500 light:text-neutral-500 mt-0.5'>
                {lift.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className='border-t dark:border-neutral-800 light:border-neutral-200'></div>

      {/* Records Section */}
      <div>
        <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 text-center sm:text-left mb-4'>
          Records
        </h3>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
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
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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

      {/* Divider */}
      <div className='border-t dark:border-neutral-800 light:border-neutral-200'></div>

      {/* Competitions Section */}
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
                {/* Content */}
                <div className={`flex-1 ${!isLast ? 'pb-5' : ''}`}>
                  {/* Date with Timeline dot */}
                  <div className='flex items-center gap-3 sm:gap-4 mb-1'>
                    {/* Timeline dot - desktop only */}
                    <div className='hidden sm:block w-3 h-3 rounded-full dark:bg-neutral-700 light:bg-neutral-300 shrink-0
                                    border-2 dark:border-neutral-900 light:border-white'></div>
                    <p className='text-sm dark:text-neutral-500 light:text-neutral-500 text-center sm:text-left w-full sm:w-auto'>
                      {new Date(meet.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  {/* Title and rest - indented to align with date text on desktop */}
                  <div className='sm:ml-7 flex flex-col mb-3'>
                    <div className='text-center sm:text-left'>
                      {meet.usaplUrl ? (
                        <a
                          href={meet.usaplUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-1.5 text-lg sm:text-xl font-semibold dark:text-neutral-100 light:text-neutral-900
                                     hover:underline underline-offset-2 transition-colors'
                        >
                          {meet.name}
                          <FiExternalLink className='w-3.5 h-3.5 dark:text-neutral-500 light:text-neutral-400' />
                        </a>
                      ) : (
                        <h4 className='text-lg sm:text-xl font-semibold dark:text-neutral-100 light:text-neutral-900'>
                          {meet.name}
                        </h4>
                      )}
                    </div>
                    
                    {/* Placements */}
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
                  
                    {/* Lift Details - Grid */}
                    <div className='grid grid-cols-4 sm:grid-cols-6 gap-1.5 mt-3'>
                    {[
                      { label: 'SQ', value: meet.squat, showUnit: true, order: 'sm:order-2', span: '' },
                      { label: 'BP', value: meet.bench, showUnit: true, order: 'sm:order-3', span: '' },
                      { label: 'DL', value: meet.deadlift, showUnit: true, order: 'sm:order-4', span: '' },
                      { label: 'Total', value: meet.total, showUnit: true, order: 'sm:order-5', span: '' },
                      { label: 'BW', value: meet.bodyweight, showUnit: true, order: 'sm:order-1', span: 'col-span-2 sm:col-span-1' },
                      { label: 'DOTS', value: meet.dots, showUnit: false, isFixed: true, order: 'sm:order-6', span: 'col-span-2 sm:col-span-1' },
                    ].map((lift) => (
                      <div 
                        key={lift.label}
                        className={`flex flex-col items-center justify-center px-2 py-2 rounded dark:bg-neutral-800/40 light:bg-neutral-50 border dark:border-neutral-800 light:border-neutral-200 min-h-[48px] ${lift.order} ${lift.span}`}
                      >
                        <span className='text-xs font-medium dark:text-neutral-300 light:text-neutral-700 tabular-nums'>
                          {lift.isFixed ? lift.value.toFixed(2) : convert(lift.value)}{lift.showUnit && unit}
                        </span>
                        <span className='text-[9px] dark:text-neutral-500 light:text-neutral-500 mt-0.5'>{lift.label}</span>
                      </div>
                    ))}
                    </div>
                  </div>
                  
                  {/* Timeline connector line - desktop only */}
                  {!isLast && (
                    <div className='hidden sm:block absolute left-[5px] top-[20px] bottom-0 w-px dark:bg-neutral-800 light:bg-neutral-300'></div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Profile Links */}
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

  const renderCoachingContent = () => (
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
      <p className='text-sm dark:text-neutral-500 light:text-neutral-500 max-w-md'>
        Coaching content coming soon. Client transformations, training philosophy, and team highlights.
      </p>
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
      media: [], // TODO: Add media
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
      media: [], // TODO: Add media
    },
  ];

  const renderMeetDirectorContent = () => (
    <div className='flex flex-col gap-6'>
      {/* Summary Stats */}
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

      {/* Divider */}
      <div className='border-t dark:border-neutral-800 light:border-neutral-200'></div>

      {/* Meet Timeline */}
      <div className='flex flex-col'>
        {meets.map((meet, idx) => {
          const isLast = idx === meets.length - 1;
          return (
            <div
              key={idx}
              className='flex flex-col sm:flex-row relative'
            >
              {/* Timeline connector - desktop only */}
              <div className='hidden sm:flex flex-col items-center mr-4 lg:mr-5'>
                <div className='w-3 h-3 rounded-full dark:bg-neutral-700 light:bg-neutral-300 shrink-0 z-10 
                                border-2 dark:border-neutral-900 light:border-white'></div>
                {!isLast && (
                  <div className='w-px grow dark:bg-neutral-800 light:bg-neutral-300'></div>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
                {/* Header */}
                <div className='flex flex-col sm:flex-row sm:items-start gap-4 mb-3'>
                  {/* Logo */}
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
                  
                  {/* Text */}
                  <div className='text-center sm:text-left flex-1'>
                    <p className='text-sm dark:text-neutral-500 light:text-neutral-500'>
                      {new Date(meet.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
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

                {/* Stats Badges */}
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

                {/* Description */}
                <p 
                  className='text-sm dark:text-neutral-400 light:text-neutral-600 leading-relaxed mb-4 [&>strong]:dark:text-neutral-200 [&>strong]:light:text-neutral-800 [&>strong]:font-semibold'
                  dangerouslySetInnerHTML={{ __html: meet.description }}
                />

                {/* Media Placeholder */}
                {meet.media && meet.media.length > 0 ? (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                    {/* TODO: Render media items */}
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
      case 'coaching':
        return renderCoachingContent();
      case 'meet-director':
        return renderMeetDirectorContent();
      default:
        return null;
    }
  };

  return (
    <section className='custom-section'>
      {/* Card with Header, Tabs, and Content */}
      <div className={`w-full flex flex-col justify-center sm:justify-between items-center card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Section Header */}
        <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-1'>
          Fitness
        </h2>
        <p className='text-sm dark:text-neutral-500 light:text-neutral-500 mb-3 text-center w-full'>
          Leader of Iron Fortress Powerlifting · Former President of CU Boulder Barbell
        </p>

        {/* Tab Navigation */}
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
            onClick={() => setSection('coaching')}
            className={`clickable base-navtab experience-navtab ${section === 'coaching' ? 'experience-navtab-active' : ''}`}
          >
            Coaching
          </button>
          <button
            type='button'
            onClick={() => setSection('meet-director')}
            className={`clickable base-navtab experience-navtab ${section === 'meet-director' ? 'experience-navtab-active' : ''}`}
          >
            Meet Director
          </button>
        </nav>

        {/* Content Area */}
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
