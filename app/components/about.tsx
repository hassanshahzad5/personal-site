'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, useSyncExternalStore } from 'react';
import { MdLocationPin } from 'react-icons/md';
import { FaCode, FaBolt, FaPaintbrush } from 'react-icons/fa6';
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
        intro: 'Building Iron Fortress Powerlifting. Former President of CU Boulder Barbell.',
        lifts: [
          // Row 1: SBDT
          { label: 'SQ', value: `${squat}${unit}` },
          { label: 'BP', value: `${bench}${unit}` },
          { label: 'DL', value: `${deadlift}${unit}` },
          { label: 'Total', value: `${total}${unit}` },
          // Row 2: BW + DOTS
          { label: 'BW', value: `${bodyweight}${unit}` },
          { label: 'DOTS', value: dots },
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
  const [showCreator, setShowCreator] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [nameAnimation, setNameAnimation] = useState<'idle' | 'out' | 'in'>('idle');
  const [showNameTooltip, setShowNameTooltip] = useState(false);
  
  const profileImages = getProfileImages(useMetric, powerliftingData);
  
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const creatorRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  
  // Timeout refs for delayed tooltip closing (allows mouse to move to tooltip)
  const nameTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const roleTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const creatorTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
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
      if (creatorRef.current && !creatorRef.current.contains(e.target as Node)) {
        setShowCreator(false);
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

  const handleCreatorTooltipEnter = () => {
    if (creatorTooltipTimeout.current) clearTimeout(creatorTooltipTimeout.current);
    setShowCreator(true);
  };
  const handleCreatorTooltipLeave = () => {
    creatorTooltipTimeout.current = setTimeout(() => setShowCreator(false), 150);
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
                  {/* SBDT Row */}
                  <div className='grid grid-cols-4 gap-1.5 mb-1.5'>
                    {profileImages[profileIndex].tooltip.lifts.slice(0, 4).map((lift) => (
                      <div 
                        key={lift.label}
                        className='flex flex-col items-center justify-center h-10 rounded-md
                                   dark:bg-neutral-800/60 light:bg-neutral-50
                                   border dark:border-neutral-700/50 light:border-neutral-300'
                      >
                        <span className='font-semibold text-xs leading-none tabular-nums dark:text-neutral-200 light:text-neutral-700'>{lift.value}</span>
                        <span className='text-[9px] leading-none dark:text-neutral-500 light:text-neutral-400 mt-1'>{lift.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* BW + DOTS Row */}
                  <div className='grid grid-cols-2 gap-1.5 mb-3'>
                    {profileImages[profileIndex].tooltip.lifts.slice(4).map((lift) => (
                      <div 
                        key={lift.label}
                        className='flex flex-col items-center justify-center h-10 rounded-md
                                   dark:bg-neutral-800/60 light:bg-neutral-50
                                   border dark:border-neutral-700/50 light:border-neutral-300'
                      >
                        <span className='font-semibold text-xs leading-none tabular-nums dark:text-neutral-200 light:text-neutral-700'>{lift.value}</span>
                        <span className='text-[9px] leading-none dark:text-neutral-500 light:text-neutral-400 mt-1'>{lift.label}</span>
                      </div>
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
        
        {/* Badges - stacked on mobile, row on desktop */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-2 mt-3'>
          
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
                    I declared CS as my major <strong className='dark:text-neutral-100 light:text-neutral-900'>knowing nothing</strong> about it. 
                    My first semester humbled me. I went from being a gifted kid in high school to failing classes and struggling to find balance between work, school, training, personal projects, and life.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    I questioned if CS was for me. Then I <strong className='dark:text-neutral-100 light:text-neutral-900'>quit my job</strong> with no backup plan and reached out to 
                    Second Edition, a startup founded by a freshman year friend. They took a huge chance on me. It was my first interaction with code in the real world.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    I fell in love with building. I was actually <strong className='dark:text-neutral-100 light:text-neutral-900'>creating meaningful, impactful software</strong>,
                    pulling 80+ hour weeks just because of the fulfillment I got from learning, collaborating, and shipping with my team.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed'>
                    When they lost funding and I was laid off, I was devestated until I found <strong className='dark:text-neutral-100 light:text-neutral-900'>Exclusive Resorts</strong> and got my first experience on a larger team. 
                    I&apos;m just getting started.
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
          
          {/* Creator */}
          <div className='relative' ref={creatorRef}>
            <span
              onClick={isMobile ? () => setShowCreator(!showCreator) : undefined}
              onMouseEnter={!isMobile ? handleCreatorTooltipEnter : undefined}
              onMouseLeave={!isMobile ? handleCreatorTooltipLeave : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${isMobile ? 'cursor-pointer' : 'cursor-default'}
                         ${showCreator ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaPaintbrush className='w-3 h-3' />
              Creator
            </span>
            
            {/* Tooltip - appears at bottom on both mobile and desktop */}
            {showCreator && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={!isMobile ? handleCreatorTooltipEnter : undefined}
                onMouseLeave={!isMobile ? handleCreatorTooltipLeave : undefined}
              >
                <div className='animate-text-reveal-delayed'>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    I started creating in high school, making social media ads and videos to <strong className='dark:text-neutral-100 light:text-neutral-900'>change the culture</strong> and 
                    push school spirit. Taught myself Photoshop, Illustrator, and Premiere Pro from scratch.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    In college, I picked up a minor in <strong className='dark:text-neutral-100 light:text-neutral-900'>Creative Technology & Design</strong>, 
                    connecting my CS skills to the creator space. I kept building, designing ads for CU Boulder Barbell and collaborating with sponsors on joint posts.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed'>
                    Now I create <strong className='dark:text-neutral-100 light:text-neutral-900'>digital experiences</strong> that engage, convert, and inspire.
                  </p>
                </div>
                {/* Arrow */}
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
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
                    I&apos;m a <strong className='dark:text-neutral-100 light:text-neutral-900'>Colorado native,</strong> Born and raised in Broomfield. 
                    I went to the same K-12 school my whole life and found my love for community through student leadership and community involvement.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    That&apos;s where I got into <strong className='dark:text-neutral-100 light:text-neutral-900'>event planning</strong> and developed an obsession with the details. 
                    At <strong className='dark:text-neutral-100 light:text-neutral-900'>CU Boulder</strong>, I applied those same ideas to CU Boulder Barbell, which we founded and grew into a nonprofit club with tax-exempt status and 100+ active members.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed'>
                    I&apos;ve worked in and around Denver my whole life and love it. I&apos;m a big people person and care deeply about <strong className='dark:text-neutral-100 light:text-neutral-900'>community</strong>. This is home.
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
                    <strong className='dark:text-neutral-100 light:text-neutral-900'>Change the Culture.</strong> That&apos;s my life mantra. 
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    Culture isn&apos;t a slogan or a set of values on a wall. It&apos;s how people act under pressure, how decisions get made when the answer isn&apos;t obvious, 
                    and what behavior gets tolerated when things are hard.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    Changing culture is <strong className='dark:text-neutral-100 light:text-neutral-900'>uncomfortable work</strong>. It demands discipline, strength, and radical accountability 
                    at the company level, the community level, and personally. I take responsibility for that and build it directly into how I operate.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-2'>
                    I value clarity, respect, detail, doing the right thing, and refusing to cut corners. I&apos;ve applied that mindset across software, retail, and travel/hospitality 
                    environments where execution, standards, and customer experience matter.
                  </p>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed'>
                    I&apos;m a <strong className='dark:text-neutral-100 light:text-neutral-900'>creator</strong> at heart: 
                    building software, digital experiences, teams, and cultures that don&apos;t happen by accident and actually last.
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
