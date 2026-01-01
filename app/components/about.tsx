'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, useSyncExternalStore } from 'react';
import { MdLocationPin } from 'react-icons/md';
import { FaCode, FaBolt } from 'react-icons/fa6';
import { powerliftingData, type PowerliftingData } from '../data/powerlifting';

const kgToLbs = (kg: number) => (kg * 2.20462).toFixed(2);

type TooltipData = {
  type: 'text';
  content: string;
} | {
  type: 'powerlifting';
  intro: string;
  roles: string[];
  lifts: { label: string; value: string }[];
  recordCount: number;
  meetCount: number;
};

const getProfileImages = (useMetric: boolean, bests: PowerliftingData) => {
  const unit = useMetric ? 'kg' : 'lbs';
  const squat = useMetric ? (bests.squat ?? 0) : kgToLbs(bests.squat ?? 0);
  const bench = useMetric ? (bests.bench ?? 0) : kgToLbs(bests.bench ?? 0);
  const deadlift = useMetric ? (bests.deadlift ?? 0) : kgToLbs(bests.deadlift ?? 0);
  const total = useMetric ? (bests.total ?? 0) : kgToLbs(bests.total ?? 0);
  const bodyweight = useMetric ? (bests.bodyweight ?? 0).toFixed(1) : kgToLbs(bests.bodyweight ?? 0);
  const dots = (bests.dots ?? 0).toFixed(2);

  return [
    { src: '/profile.jpg', alt: 'Picture of Hassan Shahzad', name: 'Hassan Shahzad', tooltip: null },
    { 
      src: '/profile-theshah.jpg', 
      alt: 'Hassan lifting weights', 
      name: 'The Shah', 
      tooltip: {
        type: 'powerlifting' as const,
        intro: 'Leader of Iron Fortress Powerlifting. Former President of CU Boulder Barbell.',
        lifts: [
          { label: 'BW', value: `${bodyweight}${unit}`, row: 1 },
          { label: 'DOTS', value: dots, row: 1 },
          { label: 'SQ', value: `${squat}${unit}`, row: 2 },
          { label: 'BP', value: `${bench}${unit}`, row: 2 },
          { label: 'DL', value: `${deadlift}${unit}`, row: 2 },
          { label: 'Total', value: `${total}${unit}`, row: 2 },
        ],
        recordCount: (bests.records ?? []).length,
        meetCount: (bests.meets ?? []).length,
      }
    },
    { 
      src: '/profile-littleshah.jpg', 
      alt: 'Hassan as a little kid', 
      name: 'Little Shah', 
      tooltip: {
        type: 'text' as const,
        content: 'Before the code, before the weights. Just a kid from Broomfield with big dreams and zero idea what a for loop was.',
      }
    },
  ];
};

// Hydration-safe mounted state
const subscribeNoop = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

// Hydration-safe metric detection
const getUseMetric = () => {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const imperialLocales = ['en-US', 'en-LR', 'my-MM'];
  return !imperialLocales.some(l => locale.startsWith(l.split('-')[0]) && locale.includes(l.split('-')[1]));
};
const getServerUseMetric = () => true; // Default to metric on server

// Hydration-safe mobile detection
const getIsMobile = () => typeof window !== 'undefined' ? window.innerWidth < 640 : false;
const getServerIsMobile = () => false;

export default function AboutMe() {
  const mounted = useSyncExternalStore(subscribeNoop, getMounted, getServerMounted);
  const useMetric = useSyncExternalStore(subscribeNoop, getUseMetric, getServerUseMetric);
  const [isMobile, setIsMobile] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [nameAnimation, setNameAnimation] = useState<'idle' | 'out' | 'in'>('idle');
  const [showNameTooltip, setShowNameTooltip] = useState(false);
  
  const profileImages = getProfileImages(useMetric, powerliftingData);
  
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  
  // Timeout refs for delayed tooltip closing (allows mouse to move to tooltip)
  const nameTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const roleTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const locationTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const philosophyTooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle resize for mobile detection - this is a subscription to window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close tooltips when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRole(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocation(false);
      }
      if (philosophyRef.current && !philosophyRef.current.contains(e.target as Node)) {
        setShowPhilosophy(false);
      }
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) {
        setShowNameTooltip(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  const handleLocationClick = () => {
    window.open(
      'https://www.google.com/maps/place/Broomfield,+CO/@39.9667804,-105.145963,12z/',
      '_blank'
    );
  };

  const handleProfileClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setNameAnimation('out');
    
    // Change image and name exactly at 50% when photo is edge-on (invisible at 90°)
    setTimeout(() => {
      setProfileIndex((prev) => (prev + 1) % profileImages.length);
      setNameAnimation('in');
    }, 250);
    
    // End animations
    setTimeout(() => {
      setIsSpinning(false);
      setNameAnimation('idle');
    }, 500);
  };

  // Tooltip hover handlers with delay to allow mouse movement to tooltip
  const handleNameTooltipEnter = () => {
    if (nameTooltipTimeout.current) clearTimeout(nameTooltipTimeout.current);
    setShowNameTooltip(true);
  };
  const handleNameTooltipLeave = () => {
    nameTooltipTimeout.current = setTimeout(() => setShowNameTooltip(false), 150);
  };

  const handleRoleTooltipEnter = () => {
    if (roleTooltipTimeout.current) clearTimeout(roleTooltipTimeout.current);
    setShowRole(true);
  };
  const handleRoleTooltipLeave = () => {
    roleTooltipTimeout.current = setTimeout(() => setShowRole(false), 150);
  };

  const handleLocationTooltipEnter = () => {
    if (locationTooltipTimeout.current) clearTimeout(locationTooltipTimeout.current);
    setShowLocation(true);
  };
  const handleLocationTooltipLeave = () => {
    locationTooltipTimeout.current = setTimeout(() => setShowLocation(false), 150);
  };

  const handlePhilosophyTooltipEnter = () => {
    if (philosophyTooltipTimeout.current) clearTimeout(philosophyTooltipTimeout.current);
    setShowPhilosophy(true);
  };
  const handlePhilosophyTooltipLeave = () => {
    philosophyTooltipTimeout.current = setTimeout(() => setShowPhilosophy(false), 150);
  };

  return (
    <article className={`w-full transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className='flex flex-col items-center text-center py-4'>

        {/* Photo - Click to discover easter eggs */}
        <button
          type="button"
          onClick={handleProfileClick}
          className='relative mb-4 rounded-full focus:outline-none focus-visible:ring-2 
                     focus-visible:ring-neutral-400 focus-visible:ring-offset-2
                     dark:focus-visible:ring-offset-neutral-900 light:focus-visible:ring-offset-white
                     group cursor-pointer'
          style={{ perspective: '1000px' }}
          aria-label='Click to see different photos'
        >
          <Image 
            src={profileImages[profileIndex].src}
            alt={profileImages[profileIndex].alt}
            width={120} 
            height={120} 
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover
                       border-2 dark:border-neutral-800 light:border-neutral-200
                       transition-all duration-300 ease-out
                       group-hover:shadow-lg group-hover:dark:shadow-neutral-800/50 group-hover:light:shadow-neutral-300/50
                       group-hover:-translate-y-0.5
                       ${isSpinning ? 'animate-spin-3d' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
            priority
          />
        </button>

        {/* Name */}
        <div className='relative' ref={nameRef}>
          <div className='overflow-hidden'>
            <h1 
              onClick={profileImages[profileIndex].tooltip ? () => setShowNameTooltip(!showNameTooltip) : undefined}
              onMouseEnter={!isMobile && profileImages[profileIndex].tooltip ? handleNameTooltipEnter : undefined}
              onMouseLeave={!isMobile && profileImages[profileIndex].tooltip ? handleNameTooltipLeave : undefined}
              className={`text-2xl sm:text-3xl font-semibold dark:text-neutral-100 light:text-neutral-900 tracking-tight
                         ${profileImages[profileIndex].tooltip ? 'cursor-pointer hover:underline underline-offset-4 decoration-neutral-400 transition-all' : ''}
                         ${nameAnimation === 'out' ? 'animate-name-out' : ''}
                         ${nameAnimation === 'in' ? 'animate-name-in' : ''}`}
            >
              {profileImages[profileIndex].name}
            </h1>
          </div>
          
          {/* Name tooltip for easter egg names */}
          {showNameTooltip && profileImages[profileIndex].tooltip && (
            <div 
              className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-4 rounded-lg
                         dark:bg-neutral-900 light:bg-white
                         dark:border-neutral-700 light:border-neutral-200 border
                         shadow-lg z-50 text-left animate-slide-in-down'
              onMouseEnter={!isMobile ? handleNameTooltipEnter : undefined}
              onMouseLeave={!isMobile ? handleNameTooltipLeave : undefined}
            >
              {profileImages[profileIndex].tooltip.type === 'powerlifting' ? (
                <>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-3'>
                    {profileImages[profileIndex].tooltip.intro}
                  </p>

                  {/* Personal Bests - Compact Grid */}
                  {/* BW + DOTS Row */}
                  <div className='grid grid-cols-2 gap-1.5 mb-2'>
                    {profileImages[profileIndex].tooltip.lifts.slice(0, 2).map((lift) => (
                      <span 
                        key={lift.label}
                        className='inline-flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-xs
                                   dark:bg-neutral-800/60 light:bg-neutral-50
                                   dark:text-neutral-300 light:text-neutral-600
                                   border dark:border-neutral-700/50 light:border-neutral-300'
                      >
                        <span className='text-[9px] font-medium dark:text-neutral-500 light:text-neutral-400'>{lift.label}</span>
                        <span className='font-semibold text-[11px]'>{lift.value}</span>
                      </span>
                    ))}
                  </div>
                  {/* SBDT Row */}
                  <div className='grid grid-cols-4 gap-1.5 mb-3'>
                    {profileImages[profileIndex].tooltip.lifts.slice(2).map((lift) => (
                      <span 
                        key={lift.label}
                        className='inline-flex flex-col items-center px-1.5 py-1 rounded-md text-xs
                                   dark:bg-neutral-800 light:bg-neutral-100
                                   dark:text-neutral-200 light:text-neutral-700
                                   border dark:border-neutral-700 light:border-neutral-300'
                      >
                        <span className='text-[9px] font-medium dark:text-neutral-500 light:text-neutral-400'>{lift.label}</span>
                        <span className='font-semibold text-[11px]'>{lift.value}</span>
                      </span>
                    ))}
                  </div>

                  {/* Stats Summary */}
                  <div className='flex items-center justify-between text-[10px] dark:text-neutral-400 light:text-neutral-500 mb-3'>
                    <span>{profileImages[profileIndex].tooltip.recordCount} State Records</span>
                    <span>{profileImages[profileIndex].tooltip.meetCount} Competitions</span>
                  </div>

                  {/* Link to full page */}
                  <Link 
                    href='/fitness'
                    className='block w-full text-center text-xs py-2 rounded-md
                               dark:bg-neutral-700 dark:text-neutral-200 
                               light:bg-neutral-200 light:text-neutral-800
                               hover:dark:bg-neutral-600 hover:light:bg-neutral-300
                               transition-colors'
                  >
                    View Full Stats →
                  </Link>
                </>
              ) : (
                <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed'>
                  {profileImages[profileIndex].tooltip.content}
                </p>
              )}
              <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                              dark:bg-neutral-900 light:bg-white
                              dark:border-l dark:border-t dark:border-neutral-700 
                              light:border-l light:border-t light:border-neutral-200'></div>
            </div>
          )}
        </div>
        
        {/* Badges row - all in one line */}
        <div className='flex flex-wrap items-center justify-center gap-2 mt-3'>
          
          {/* Full Stack Developer */}
          <div className='relative' ref={roleRef}>
            <span
              onClick={isMobile ? () => setShowRole(!showRole) : undefined}
              onMouseEnter={!isMobile ? handleRoleTooltipEnter : undefined}
              onMouseLeave={!isMobile ? handleRoleTooltipLeave : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${isMobile ? 'cursor-pointer' : 'cursor-default'}
                         ${showRole ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaCode className='w-3 h-3' />
              Full Stack Developer
            </span>
            
            {/* Tooltip */}
            {showRole && (
              <div 
                className={`absolute ${isMobile ? 'top-full left-1/2 -translate-x-1/2 mt-2' : 'top-1/2 -translate-y-1/2 right-full mr-2'} 
                           w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left ${isMobile ? 'animate-slide-in-down' : 'animate-slide-in-left'}`}
                onMouseEnter={!isMobile ? handleRoleTooltipEnter : undefined}
                onMouseLeave={!isMobile ? handleRoleTooltipLeave : undefined}
              >
                <div className='animate-text-reveal-delayed'>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    Three years ago, I didn&apos;t know what a <strong className='dark:text-neutral-100 light:text-neutral-900'>for loop</strong> was. 
                    I failed classes, questioned if CS was for me, and nearly gave up more than once.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    Then I got my first shot at a startup. Dove in headfirst, learned fast, and found my footing. 
                    When the company lost funding and I was laid off, I doubled down on personal projects and kept building.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed'>
                    That persistence led me to my first real role at <strong className='dark:text-neutral-100 light:text-neutral-900'>Exclusive Resorts</strong>. 
                    Now I own problems end to end: React, Next.js, Node, GraphQL, MySQL, AWS. And I&apos;m just getting started.
                  </p>
                </div>
                {/* Arrow */}
                <div className={`absolute ${isMobile ? '-top-2 left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2 -right-2'} 
                                w-3 h-3 rotate-45 dark:bg-neutral-900 light:bg-white
                                ${isMobile ? 'dark:border-l dark:border-t dark:border-neutral-700 light:border-l light:border-t light:border-neutral-200' 
                                          : 'dark:border-r dark:border-t dark:border-neutral-700 light:border-r light:border-t light:border-neutral-200'}`}></div>
              </div>
            )}
          </div>
          
          {/* Broomfield, CO */}
          <div className='relative' ref={locationRef}>
            <span
              onClick={isMobile ? () => setShowLocation(!showLocation) : handleLocationClick}
              onMouseEnter={!isMobile ? handleLocationTooltipEnter : undefined}
              onMouseLeave={!isMobile ? handleLocationTooltipLeave : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${showLocation ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <MdLocationPin className='w-3 h-3' />
              <span className='sm:underline sm:underline-offset-2'>Broomfield, CO</span>
            </span>
            
            {/* Tooltip - Desktop: no maps link, Mobile: with maps link */}
            {showLocation && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={!isMobile ? handleLocationTooltipEnter : undefined}
                onMouseLeave={!isMobile ? handleLocationTooltipLeave : undefined}
              >
                <div className='animate-text-reveal-delayed'>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    <strong className='dark:text-neutral-100 light:text-neutral-900'>Born and raised</strong> in Broomfield, Colorado. 
                    I went to the same K-12 school my whole life. That&apos;s where I solidified my life mantra and discovered my love for community.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    Then I headed to <strong className='dark:text-neutral-100 light:text-neutral-900'>CU Boulder</strong> for Computer Science with a minor in Creative Technology & Design.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed'>
                    I&apos;ve worked in and around Denver ever since. This is home.
                  </p>
                  {/* Only show on mobile */}
                  {isMobile && (
                    <button 
                      onClick={handleLocationClick}
                      className='mt-3 text-xs dark:text-neutral-400 light:text-neutral-500 hover:dark:text-neutral-200 hover:light:text-neutral-700 underline underline-offset-2 transition-colors'
                    >
                      View on Google Maps →
                    </button>
                  )}
                </div>
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
              </div>
            )}
          </div>
          
          {/* Change the Culture */}
          <div className='relative' ref={philosophyRef}>
            <span
              onClick={isMobile ? () => setShowPhilosophy(!showPhilosophy) : undefined}
              onMouseEnter={!isMobile ? handlePhilosophyTooltipEnter : undefined}
              onMouseLeave={!isMobile ? handlePhilosophyTooltipLeave : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${isMobile ? 'cursor-pointer' : 'cursor-default'}
                         ${showPhilosophy ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaBolt className='w-3 h-3' />
              Change the Culture
            </span>
            
            {/* Tooltip */}
            {showPhilosophy && (
              <div 
                className={`absolute ${isMobile ? 'top-full left-1/2 -translate-x-1/2 mt-2' : 'top-1/2 -translate-y-1/2 left-full ml-2'} 
                           w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left ${isMobile ? 'animate-slide-in-down' : 'animate-slide-in-right'}`}
                onMouseEnter={!isMobile ? handlePhilosophyTooltipEnter : undefined}
                onMouseLeave={!isMobile ? handlePhilosophyTooltipLeave : undefined}
              >
                <div className='animate-text-reveal-delayed'>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    <strong className='dark:text-neutral-100 light:text-neutral-900'>Change the Culture.</strong> That&apos;s not a tagline. It&apos;s how I live.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    Culture isn&apos;t what&apos;s written on a wall. It&apos;s how people act under pressure, how decisions get made when the answer isn&apos;t obvious, 
                    and what gets tolerated when things are hard. I hold myself accountable to that standard: at work, in the gym, and in life.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed'>
                    I lead a powerlifting team, build software, and show up the same way in both: with discipline, clarity, and a refusal to cut corners. 
                    The goal isn&apos;t perfection. It&apos;s building something that actually lasts.
                  </p>
                </div>
                {/* Arrow */}
                <div className={`absolute ${isMobile ? '-top-2 left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2 -left-2'} 
                                w-3 h-3 rotate-45 dark:bg-neutral-900 light:bg-white
                                ${isMobile ? 'dark:border-l dark:border-t dark:border-neutral-700 light:border-l light:border-t light:border-neutral-200' 
                                          : 'dark:border-l dark:border-b dark:border-neutral-700 light:border-l light:border-b light:border-neutral-200'}`}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
