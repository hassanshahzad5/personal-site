'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, useSyncExternalStore } from 'react';
import { MdLocationPin } from 'react-icons/md';
import { FaCode, FaBolt, FaPaintbrush } from 'react-icons/fa6';
import { powerliftingData } from '../data/powerlifting';
import { getWorkStatusDisplay } from '../config/site';
import { useViewportState } from '../hooks/useViewport';
import type { TooltipData, PowerliftingData } from '../types';

const kgToLbs = (kg: number) => (kg * 2.20462).toFixed(2);

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
          { label: 'SQ', value: `${squat}${unit}` },
          { label: 'BP', value: `${bench}${unit}` },
          { label: 'DL', value: `${deadlift}${unit}` },
          { label: 'Total', value: `${total}${unit}` },
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
        content: 'The foundation. Colorado roots, a Winnie the Pooh costume, and a stubborn belief that hard work beats talent. Some things never change.',
      }
    },
  ];
};

const subscribeNoop = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

const getUseMetric = () => {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const imperialLocales = ['en-US', 'en-LR', 'my-MM'];
  return !imperialLocales.some(l => locale.startsWith(l.split('-')[0]) && locale.includes(l.split('-')[1]));
};
const getServerUseMetric = () => true;

export default function AboutMe() {
  const mounted = useSyncExternalStore(subscribeNoop, getMounted, getServerMounted);
  const useMetric = useSyncExternalStore(subscribeNoop, getUseMetric, getServerUseMetric);
  const { isMobile, isTablet, isDesktop } = useViewportState();
  const [showRole, setShowRole] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [nameAnimation, setNameAnimation] = useState<'idle' | 'out' | 'in'>('idle');
  const [showNameTooltip, setShowNameTooltip] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<'role' | 'creator' | 'location' | 'philosophy' | null>(null);
  
  const profileImages = getProfileImages(useMetric, powerliftingData);
  
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const creatorRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  
  const nameTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const roleTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const creatorTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const locationTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const philosophyTooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  // Lock body scroll when tablet drawer is open
  useEffect(() => {
    if (isTablet && mobileDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTablet, mobileDrawer]);

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
    
    setTimeout(() => {
      setProfileIndex((prev) => (prev + 1) % profileImages.length);
      setNameAnimation('in');
    }, 250);
    
    setTimeout(() => {
      setIsSpinning(false);
      setNameAnimation('idle');
    }, 500);
  };

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
      <div className='flex flex-col items-center text-center pt-4'>

        <div className='relative mb-2'>
          <button
            type="button"
            onClick={handleProfileClick}
            className='relative rounded-full focus:outline-none focus-visible:ring-2 
                       focus-visible:ring-neutral-400 focus-visible:ring-offset-2
                       dark:focus-visible:ring-offset-neutral-900 light:focus-visible:ring-offset-white
                       group cursor-pointer'
            style={{ perspective: '1000px' }}
            aria-label='Click to see different photos'
          >
            <div className='hidden md:block absolute w-12 h-12 rounded-full
                            top-1/2 left-1/2 translate-x-3 translate-y-3
                            opacity-0 group-hover:opacity-100
                            dark:bg-neutral-500/10 light:bg-neutral-400/10
                            blur-lg transition-opacity duration-300 ease-out -z-10' />
            <Image 
              src={profileImages[profileIndex].src}
              alt={profileImages[profileIndex].alt}
              width={120} 
              height={120} 
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover
                         border-2 dark:border-neutral-700 light:border-neutral-300
                         ring-2 ring-transparent group-hover:ring-neutral-400/30
                         transition-all duration-300 ease-out
                         group-hover:shadow-xl group-hover:dark:shadow-neutral-700/40 group-hover:light:shadow-neutral-400/40
                         group-hover:-translate-y-1 group-hover:scale-[1.02]
                         ${isSpinning ? 'animate-spin-3d' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
              priority
            />
          </button>
          {(() => {
            const status = getWorkStatusDisplay();
            return (
              <div className='absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full
                              dark:bg-neutral-900/90 light:bg-white/90 backdrop-blur-sm
                              border dark:border-neutral-700 light:border-neutral-300
                              shadow-sm whitespace-nowrap'>
                <span className={`w-2 h-2 rounded-full shrink-0 ${status.color} ${status.pulse ? 'animate-pulse' : ''}`} />
                <span className='text-[10px] font-medium dark:text-neutral-300 light:text-neutral-600'>
                  {status.text}
                </span>
              </div>
            );
          })()}
        </div>

        <div className='relative' ref={nameRef}>
          <div className='overflow-hidden'>
            <h1 
              onClick={profileImages[profileIndex].tooltip ? () => setShowNameTooltip(!showNameTooltip) : undefined}
              onMouseEnter={isDesktop && profileImages[profileIndex].tooltip ? handleNameTooltipEnter : undefined}
              onMouseLeave={isDesktop && profileImages[profileIndex].tooltip ? handleNameTooltipLeave : undefined}
              className={`text-2xl sm:text-3xl font-semibold dark:text-neutral-100 light:text-neutral-900 tracking-tight
                         ${profileImages[profileIndex].tooltip ? 'cursor-pointer transition-all' : ''}
                         ${nameAnimation === 'out' ? 'animate-name-out' : ''}
                         ${nameAnimation === 'in' ? 'animate-name-in' : ''}`}
            >
              {profileImages[profileIndex].name}
            </h1>
          </div>
          
          {showNameTooltip && profileImages[profileIndex].tooltip && (
            <div 
              className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-4 rounded-lg
                         dark:bg-neutral-900 light:bg-white
                         dark:border-neutral-700 light:border-neutral-200 border
                         shadow-lg z-50 text-left animate-slide-in-down'
              onMouseEnter={isDesktop ? handleNameTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handleNameTooltipLeave : undefined}
            >
              {profileImages[profileIndex].tooltip.type === 'powerlifting' ? (
                <>
                  <p className='text-xs dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-3'>
                    {profileImages[profileIndex].tooltip.intro}
                  </p>

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

                  <div className='flex items-center justify-between text-[10px] dark:text-neutral-400 light:text-neutral-500 mb-3'>
                    <span>{profileImages[profileIndex].tooltip.recordCount} State Records</span>
                    <span>{profileImages[profileIndex].tooltip.meetCount} Competitions</span>
                  </div>

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
        
        <div className='flex flex-row flex-wrap items-center justify-center gap-2 mt-3'>
          
          <div className='relative' ref={roleRef}>
            <span
              onClick={isTablet ? () => setMobileDrawer('role') : (isMobile ? () => setShowRole(!showRole) : undefined)}
              onMouseEnter={isDesktop ? handleRoleTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handleRoleTooltipLeave : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${!isDesktop ? 'cursor-pointer' : 'cursor-default'}
                         ${showRole ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaCode className='w-3 h-3' />
              Full Stack Developer
            </span>
            
            {!isTablet && showRole && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={handleRoleTooltipEnter}
                onMouseLeave={handleRoleTooltipLeave}
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
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
              </div>
            )}
          </div>
          
          <div className='relative' ref={creatorRef}>
            <span
              onClick={isTablet ? () => setMobileDrawer('creator') : (isMobile ? () => setShowCreator(!showCreator) : undefined)}
              onMouseEnter={isDesktop ? handleCreatorTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handleCreatorTooltipLeave : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${!isDesktop ? 'cursor-pointer' : 'cursor-default'}
                         ${showCreator ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaPaintbrush className='w-3 h-3' />
              Creator
            </span>
            
            {!isTablet && showCreator && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={handleCreatorTooltipEnter}
                onMouseLeave={handleCreatorTooltipLeave}
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
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
              </div>
            )}
          </div>
          
          <div className='relative' ref={locationRef}>
            <span
              onClick={isTablet ? () => setMobileDrawer('location') : (isMobile ? () => setShowLocation(!showLocation) : handleLocationClick)}
              onMouseEnter={isDesktop ? handleLocationTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handleLocationTooltipLeave : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${showLocation ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <MdLocationPin className='w-3 h-3' />
              <span className='xl:underline xl:underline-offset-2'>Broomfield, CO</span>
            </span>
            
            {!isTablet && showLocation && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={handleLocationTooltipEnter}
                onMouseLeave={handleLocationTooltipLeave}
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
          
          <div className='relative' ref={philosophyRef}>
            <span
              onClick={isTablet ? () => setMobileDrawer('philosophy') : (isMobile ? () => setShowPhilosophy(!showPhilosophy) : undefined)}
              onMouseEnter={isDesktop ? handlePhilosophyTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handlePhilosophyTooltipLeave : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${!isDesktop ? 'cursor-pointer' : 'cursor-default'}
                         ${showPhilosophy ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaBolt className='w-3 h-3' />
              Change the Culture
            </span>
            
            {!isTablet && showPhilosophy && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={handlePhilosophyTooltipEnter}
                onMouseLeave={handlePhilosophyTooltipLeave}
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
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Tablet Drawer */}
      {isTablet && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300
                       ${mobileDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMobileDrawer(null)}
          />
          
          {/* Drawer */}
          <div 
            className={`fixed bottom-0 left-0 right-0 z-50 
                       dark:bg-neutral-900 light:bg-white
                       rounded-t-2xl shadow-2xl
                       transition-transform duration-300 ease-out
                       ${mobileDrawer ? 'translate-y-0' : 'translate-y-full'}`}
          >
            {/* Handle */}
            <div className='flex justify-center pt-3 pb-2'>
              <div className='w-10 h-1 rounded-full dark:bg-neutral-700 light:bg-neutral-300' />
            </div>
            
            {/* Content */}
            <div className='px-5 pb-8 max-h-[70vh] overflow-y-auto'>
              {mobileDrawer === 'role' && (
                <div>
                  <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
                    Full Stack Developer
                  </h3>
                  <div className='space-y-3 text-sm dark:text-neutral-300 light:text-neutral-700'>
                    <p>
                      I declared CS as my major <strong className='dark:text-neutral-100 light:text-neutral-900'>knowing nothing</strong> about it. 
                      My first semester humbled me. I went from being a gifted kid in high school to failing classes and struggling to find balance between work, school, training, personal projects, and life.
                    </p>
                    <p>
                      I questioned if CS was for me. Then I <strong className='dark:text-neutral-100 light:text-neutral-900'>quit my job</strong> with no backup plan and reached out to 
                      Second Edition, a startup founded by a freshman year friend. They took a huge chance on me. It was my first interaction with code in the real world.
                    </p>
                    <p>
                      I fell in love with building. I was actually <strong className='dark:text-neutral-100 light:text-neutral-900'>creating meaningful, impactful software</strong>,
                      pulling 80+ hour weeks just because of the fulfillment I got from learning, collaborating, and shipping with my team.
                    </p>
                    <p>
                      When they lost funding and I was laid off, I was devestated until I found <strong className='dark:text-neutral-100 light:text-neutral-900'>Exclusive Resorts</strong> and got my first experience on a larger team. 
                      I&apos;m just getting started.
                    </p>
                  </div>
                </div>
              )}
              
              {mobileDrawer === 'creator' && (
                <div>
                  <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
                    Creator
                  </h3>
                  <div className='space-y-3 text-sm dark:text-neutral-300 light:text-neutral-700'>
                    <p>
                      I started creating in high school, making social media ads and videos to <strong className='dark:text-neutral-100 light:text-neutral-900'>change the culture</strong> and 
                      push school spirit. Taught myself Photoshop, Illustrator, and Premiere Pro from scratch.
                    </p>
                    <p>
                      In college, I picked up a minor in <strong className='dark:text-neutral-100 light:text-neutral-900'>Creative Technology & Design</strong>, 
                      connecting my CS skills to the creator space. I kept building, designing ads for CU Boulder Barbell and collaborating with sponsors on joint posts.
                    </p>
                    <p>
                      Now I create <strong className='dark:text-neutral-100 light:text-neutral-900'>digital experiences</strong> that engage, convert, and inspire.
                    </p>
                  </div>
                </div>
              )}
              
              {mobileDrawer === 'location' && (
                <div>
                  <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
                    Broomfield, CO
                  </h3>
                  <div className='space-y-3 text-sm dark:text-neutral-300 light:text-neutral-700'>
                    <p>
                      I&apos;m a <strong className='dark:text-neutral-100 light:text-neutral-900'>Colorado native,</strong> Born and raised in Broomfield. 
                      I went to the same K-12 school my whole life and found my love for community through student leadership and community involvement.
                    </p>
                    <p>
                      That&apos;s where I got into <strong className='dark:text-neutral-100 light:text-neutral-900'>event planning</strong> and developed an obsession with the details. 
                      At <strong className='dark:text-neutral-100 light:text-neutral-900'>CU Boulder</strong>, I applied those same ideas to CU Boulder Barbell, which we founded and grew into a nonprofit club with tax-exempt status and 100+ active members.
                    </p>
                    <p>
                      I&apos;ve worked in and around Denver my whole life and love it. I&apos;m a big people person and care deeply about <strong className='dark:text-neutral-100 light:text-neutral-900'>community</strong>. This is home.
                    </p>
                  </div>
                  <button 
                    onClick={handleLocationClick}
                    className='mt-4 w-full py-3 rounded-lg text-sm font-medium
                               dark:bg-neutral-800 dark:text-neutral-100 
                               light:bg-neutral-100 light:text-neutral-900
                               transition-colors'
                  >
                    View on Google Maps →
                  </button>
                </div>
              )}
              
              {mobileDrawer === 'philosophy' && (
                <div>
                  <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
                    Change the Culture
                  </h3>
                  <div className='space-y-3 text-sm dark:text-neutral-300 light:text-neutral-700'>
                    <p>
                      <strong className='dark:text-neutral-100 light:text-neutral-900'>Change the Culture.</strong> That&apos;s my life mantra. 
                    </p>
                    <p>
                      Culture isn&apos;t a slogan or a set of values on a wall. It&apos;s how people act under pressure, how decisions get made when the answer isn&apos;t obvious, 
                      and what behavior gets tolerated when things are hard.
                    </p>
                    <p>
                      Changing culture is <strong className='dark:text-neutral-100 light:text-neutral-900'>uncomfortable work</strong>. It demands discipline, strength, and radical accountability 
                      at the company level, the community level, and personally. I take responsibility for that and build it directly into how I operate.
                    </p>
                    <p>
                      I value clarity, respect, detail, doing the right thing, and refusing to cut corners. I&apos;ve applied that mindset across software, retail, and travel/hospitality 
                      environments where execution, standards, and customer experience matter.
                    </p>
                    <p>
                      I&apos;m a <strong className='dark:text-neutral-100 light:text-neutral-900'>creator</strong> at heart: 
                      building software, digital experiences, teams, and cultures that don&apos;t happen by accident and actually last.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
