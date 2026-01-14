'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, useSyncExternalStore } from 'react';
import { MdLocationPin } from 'react-icons/md';
import { FaCode, FaBolt, FaPaintbrush } from 'react-icons/fa6';
import { RxCross1 } from 'react-icons/rx';
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
    { src: '/profiles/profile-main.jpg', alt: 'Picture of Hassan Shahzad', name: 'Hassan Shahzad', tooltip: null },
    { 
      src: '/profiles/profile-theshah.jpg', 
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
      src: '/profiles/profile-littleshah.jpg', 
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

// Shared content for badge tooltips and drawers
const badgeContent = {
  role: {
    title: 'Full Stack Developer',
    paragraphs: [
      <>I declared Computer Science as my major <strong>knowing absolutely nothing</strong> about it. My first semester humbled me. I went from being at the top of my class in high school to failing classes and struggling to find balance between work, school, training, personal projects, and life.</>,
      <>I needed to figure out if coding was something I truly wanted to do for a living, so <strong>I quit my job</strong> at the end of my 3rd year of college with no backup plan. Shortly after, I reached out to a freshman year friend, who founded <strong>Second Edition</strong>, a luxury furniture resale and consignment startup in Denver. They took a huge chance on me. It was my first interaction with code in the real world.</>,
      <>I fell in love with building and our mission to reduce wastefulness in the furniture industry. I was finally putting the pieces together and <strong>creating meaningful, impactful software</strong>, pulling 80+ hour weeks as the sole developer just because of the fulfillment I got from learning, collaborating, and shipping with my team.</>,
      <>After graduating, I joined <strong>Exclusive Resorts</strong> and am getting my first experience on a larger cross-functional team. I&apos;m just getting started and am eager to see where this journey takes me.</>,
    ],
  },
  creator: {
    title: 'Creator',
    paragraphs: [
      <>I started creating in high school, <strong>seeing a clear gap</strong> in our Student Council&apos;s ability to communicate and connect with the student body. I taught myself <strong>Photoshop, Illustrator, and Premiere Pro</strong> from scratch, diving into graphic design, apparel design, video editing, and social media management.</>,
      <>I led our council&apos;s <strong>Challenge the Culture</strong> campaign my senior year, aimed at improving school spirit through social media recognition—ads for games, events, and student life. I also created and led our first ever <strong>Color Dance</strong>, a new annual event to welcome students back before homecoming.</>,
      <>In college, I picked up a minor in <strong>Creative Technology &amp; Design</strong>, expanding my skillset and connecting design to code. I designed logos and marketing materials for CU Boulder Barbell and led the <strong>2024 & 2025 Colorado Collegiate Showdowns</strong>, mock powerlifting meets bringing together athletes from university clubs across the state.</>,
      <>Now <strong>I create digital experiences that engage, convert, and inspire</strong> - with an attention to detail shaped by years of management, event planning, and hands-on execution.</>,
    ],
  },
  location: {
    title: 'Broomfield, CO',
    paragraphs: [
      <>I&apos;m a <strong>Colorado native</strong> born and raised in Broomfield to a Pakistani immigrant family. I went to the same school from Kindergarten through High School and found my <strong>love for community</strong> through student leadership and involvement.</>,
      <>I believe deeply in <strong>giving back to the communities, organizations, and people that invested in me</strong>. My university gave me opportunities to grow, and I spent my time there focusing on ways to make college better and less lonely for the people around me. I co-founded CU Boulder Barbell and grew it from a school club into a 501(c)(3) nonprofit organization serving 100+ members.</>,
      <>I&apos;m a <strong>family and community man</strong> who knows that the grass is greenest where you water it - and I&apos;ve spent my life watering Colorado. This is home, and I will absolutely keep building here.</>,
    ],
  },
  philosophy: {
    title: 'Change the Culture',
    paragraphs: [
      <><strong>This is my life mantra.</strong></>,
      <>Culture isn&apos;t an abstract idea or a slogan or a set of values on a wall. It&apos;s revealed in how people act under pressure, the decisions that get made when the answer isn&apos;t obvious, and in what gets tolerated when things get hard and doing the right thing is uncomfortable.</>,
      <><strong>Changing culture is slow, uncomfortable, and necessary work</strong>. It starts with individuals, compounds through teams and communities, and ultimately shapes the systems and outcomes that affect the world at large. It demands vigilance, consistency, discipline, attention to detail, and radical accountability at every level.</>,
      <>I take responsibility for that work and integrate this mindset into how I operate - through leadership, software, and design - across luxury goods and services environments, fitness organizations, and other communities where execution, high standards, and customer experience matter.</>,
      <>Great people, teams, and cultures don&apos;t come to be by accident. I build them by holding myself and those around me to a <strong>consistently higher standard</strong>.</>,
    ],
  },
};

// Reusable component for rendering badge content
const BadgeContentParagraphs = ({ 
  paragraphs, 
  variant 
}: { 
  paragraphs: React.ReactNode[]; 
  variant: 'tooltip' | 'drawer';
}) => {
  const baseClass = variant === 'tooltip' 
    ? 'text-xs leading-relaxed' 
    : 'text-sm';
  const spacingClass = variant === 'tooltip' ? 'mb-2 last:mb-0' : '';
  const containerClass = variant === 'drawer' ? 'space-y-3' : '';
  const strongClass = 'dark:text-neutral-100 light:text-neutral-900';

  return (
    <div className={containerClass}>
      {paragraphs.map((paragraph, index) => (
        <p 
          key={index} 
          className={`dark:text-neutral-300 light:text-neutral-700 ${baseClass} ${spacingClass} [&>strong]:${strongClass}`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default function AboutMe() {
  const mounted = useSyncExternalStore(subscribeNoop, getMounted, getServerMounted);
  const useMetric = useSyncExternalStore(subscribeNoop, getUseMetric, getServerUseMetric);
  const {isDesktop, isMobileOrTablet } = useViewportState();
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
  const nameTooltipRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const creatorRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  
  const nameTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const roleTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const creatorTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const locationTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const philosophyTooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  // Lock body scroll when drawer is open (mobile and tablet)
  useEffect(() => {
    if (isMobileOrTablet && mobileDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOrTablet, mobileDrawer]);

  // Focus trap and keyboard handling for drawer
  useEffect(() => {
    if (!mobileDrawer || !drawerRef.current) return;

    // Focus the close button when drawer opens
    setTimeout(() => drawerCloseRef.current?.focus(), 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        setMobileDrawer(null);
        return;
      }

      // Focus trap on Tab
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawer]);

  useEffect(() => {
    if (isDesktop) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) {
        setShowNameTooltip(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktop]);

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
                <span className='text-xs font-medium dark:text-neutral-300 light:text-neutral-600'>
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
              onKeyDown={profileImages[profileIndex].tooltip ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowNameTooltip(!showNameTooltip);
                }
              } : undefined}
              onMouseEnter={isDesktop && profileImages[profileIndex].tooltip ? handleNameTooltipEnter : undefined}
              onMouseLeave={isDesktop && profileImages[profileIndex].tooltip ? handleNameTooltipLeave : undefined}
              onFocus={isDesktop && profileImages[profileIndex].tooltip ? () => setShowNameTooltip(true) : undefined}
              onBlur={isDesktop && profileImages[profileIndex].tooltip ? (e) => {
                // Don't close if focus is moving into the tooltip
                if (nameTooltipRef.current?.contains(e.relatedTarget as Node)) return;
                setShowNameTooltip(false);
              } : undefined}
              tabIndex={profileImages[profileIndex].tooltip ? 0 : undefined}
              role={profileImages[profileIndex].tooltip ? 'button' : undefined}
              aria-expanded={profileImages[profileIndex].tooltip ? showNameTooltip : undefined}
              aria-haspopup={profileImages[profileIndex].tooltip ? 'dialog' : undefined}
              className={`text-2xl sm:text-3xl font-semibold dark:text-neutral-100 light:text-neutral-900 tracking-tight
                         ${profileImages[profileIndex].tooltip ? 'cursor-pointer transition-all focus:underline focus:underline-offset-4' : ''}
                         ${nameAnimation === 'out' ? 'animate-name-out' : ''}
                         ${nameAnimation === 'in' ? 'animate-name-in' : ''}`}
            >
              {profileImages[profileIndex].name}
            </h1>
          </div>
          
          {showNameTooltip && profileImages[profileIndex].tooltip && (
            <div 
              ref={nameTooltipRef}
              role="dialog"
              aria-label={`${profileImages[profileIndex].name} details`}
              className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-4 rounded-lg
                         dark:bg-neutral-900 light:bg-white
                         dark:border-neutral-700 light:border-neutral-200 border
                         shadow-lg z-50 text-left animate-slide-in-down'
              onMouseEnter={isDesktop ? handleNameTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handleNameTooltipLeave : undefined}
              onBlur={(e) => {
                // Close tooltip when focus leaves the tooltip entirely
                if (!e.currentTarget.contains(e.relatedTarget as Node) && 
                    e.relatedTarget !== nameRef.current?.querySelector('h1')) {
                  setShowNameTooltip(false);
                }
              }}
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
                        <span className='text-xs leading-none dark:text-neutral-500 light:text-neutral-400 mt-1'>{lift.label}</span>
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
                        <span className='text-xs leading-none dark:text-neutral-500 light:text-neutral-400 mt-1'>{lift.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className='flex items-center justify-between text-xs dark:text-neutral-400 light:text-neutral-500 mb-3'>
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
            <button
              type="button"
              onClick={isMobileOrTablet ? () => setMobileDrawer('role') : () => setShowRole(!showRole)}
              onMouseEnter={isDesktop ? handleRoleTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handleRoleTooltipLeave : undefined}
              onFocus={isDesktop ? () => setShowRole(true) : undefined}
              onBlur={isDesktop ? () => setShowRole(false) : undefined}
              aria-expanded={showRole}
              aria-haspopup="dialog"
              aria-label="Full Stack Developer - click to learn more"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         cursor-pointer
                         ${showRole ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaCode className='w-3 h-3' aria-hidden="true" />
              Full Stack Developer
            </button>
            
            {isDesktop && showRole && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={handleRoleTooltipEnter}
                onMouseLeave={handleRoleTooltipLeave}
              >
                <BadgeContentParagraphs paragraphs={badgeContent.role.paragraphs} variant="tooltip" />
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
              </div>
            )}
          </div>
          
          <div className='relative' ref={creatorRef}>
            <button
              type="button"
              onClick={isMobileOrTablet ? () => setMobileDrawer('creator') : () => setShowCreator(!showCreator)}
              onMouseEnter={isDesktop ? handleCreatorTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handleCreatorTooltipLeave : undefined}
              onFocus={isDesktop ? () => setShowCreator(true) : undefined}
              onBlur={isDesktop ? () => setShowCreator(false) : undefined}
              aria-expanded={showCreator}
              aria-haspopup="dialog"
              aria-label="Creator - click to learn more"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         cursor-pointer
                         ${showCreator ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaPaintbrush className='w-3 h-3' aria-hidden="true" />
              Creator
            </button>
            
            {isDesktop && showCreator && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={handleCreatorTooltipEnter}
                onMouseLeave={handleCreatorTooltipLeave}
              >
                <BadgeContentParagraphs paragraphs={badgeContent.creator.paragraphs} variant="tooltip" />
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
              </div>
            )}
          </div>
          
          <div className='relative' ref={locationRef}>
            <button
              type="button"
              onClick={isMobileOrTablet ? () => setMobileDrawer('location') : () => setShowLocation(!showLocation)}
              onMouseEnter={isDesktop ? handleLocationTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handleLocationTooltipLeave : undefined}
              onFocus={isDesktop ? () => setShowLocation(true) : undefined}
              onBlur={isDesktop ? () => setShowLocation(false) : undefined}
              aria-expanded={showLocation}
              aria-haspopup="dialog"
              aria-label="Broomfield, Colorado - click to learn more"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         ${showLocation ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <MdLocationPin className='w-3 h-3' aria-hidden="true" />
              <span>Broomfield, CO</span>
            </button>
            
            {isDesktop && showLocation && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={handleLocationTooltipEnter}
                onMouseLeave={handleLocationTooltipLeave}
              >
                <BadgeContentParagraphs paragraphs={badgeContent.location.paragraphs} variant="tooltip" />
                <button 
                  type="button"
                  onClick={handleLocationClick}
                  aria-label="View Broomfield, Colorado on Google Maps (opens in new tab)"
                  className='mt-3 w-full py-2 rounded-md text-xs font-medium
                             dark:bg-neutral-800 dark:text-neutral-100 
                             light:bg-neutral-100 light:text-neutral-900
                             hover:dark:bg-neutral-700 hover:light:bg-neutral-200
                             transition-colors'
                >
                  View on Google Maps →
                </button>
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
              </div>
            )}
          </div>
          
          <div className='relative' ref={philosophyRef}>
            <button
              type="button"
              onClick={isMobileOrTablet ? () => setMobileDrawer('philosophy') : () => setShowPhilosophy(!showPhilosophy)}
              onMouseEnter={isDesktop ? handlePhilosophyTooltipEnter : undefined}
              onMouseLeave={isDesktop ? handlePhilosophyTooltipLeave : undefined}
              onFocus={isDesktop ? () => setShowPhilosophy(true) : undefined}
              onBlur={isDesktop ? () => setShowPhilosophy(false) : undefined}
              aria-expanded={showPhilosophy}
              aria-haspopup="dialog"
              aria-label="Change the Culture - click to learn more"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors 
                         text-xs dark:bg-neutral-800/60 light:bg-neutral-100
                         dark:text-neutral-300 light:text-neutral-600
                         border dark:border-neutral-700/50 light:border-neutral-300/50
                         hover:dark:bg-neutral-700/60 hover:light:bg-neutral-200
                         cursor-pointer
                         ${showPhilosophy ? 'dark:bg-neutral-700/60 light:bg-neutral-200' : ''}`}
            >
              <FaBolt className='w-3 h-3' aria-hidden="true" />
              Change the Culture
            </button>
            
            {isDesktop && showPhilosophy && (
              <div 
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-lg
                           dark:bg-neutral-900 light:bg-white
                           dark:border-neutral-700 light:border-neutral-200 border
                           shadow-lg z-50 text-left animate-slide-in-down'
                onMouseEnter={handlePhilosophyTooltipEnter}
                onMouseLeave={handlePhilosophyTooltipLeave}
              >
                <BadgeContentParagraphs paragraphs={badgeContent.philosophy.paragraphs} variant="tooltip" />
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 
                                dark:bg-neutral-900 light:bg-white
                                dark:border-l dark:border-t dark:border-neutral-700 
                                light:border-l light:border-t light:border-neutral-200'></div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile & Tablet Drawer */}
      {isMobileOrTablet && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300
                       ${mobileDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMobileDrawer(null)}
          />
          
          {/* Drawer */}
          <div 
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={
              mobileDrawer === 'role' ? 'Full Stack Developer details' :
              mobileDrawer === 'creator' ? 'Creator details' :
              mobileDrawer === 'location' ? 'Location details' :
              mobileDrawer === 'philosophy' ? 'Change the Culture details' : 'Details'
            }
            className={`fixed bottom-0 left-0 right-0 z-50 
                       dark:bg-neutral-900 light:bg-white
                       rounded-t-2xl shadow-2xl
                       transition-transform duration-300 ease-out
                       ${mobileDrawer ? 'translate-y-0' : 'translate-y-full'}`}
          >
            {/* Header with Handle and Close Button */}
            <div className='flex items-center justify-between px-5 pt-3 pb-2'>
              <div className='w-9' /> {/* Spacer for centering */}
              <div className='w-10 h-1 rounded-full dark:bg-neutral-700 light:bg-neutral-300' />
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={() => setMobileDrawer(null)}
                aria-label="Close drawer"
                className='flex items-center justify-center w-9 h-9 rounded-full
                           dark:bg-neutral-800 light:bg-neutral-100
                           dark:text-neutral-400 light:text-neutral-600
                           hover:dark:bg-neutral-700 hover:light:bg-neutral-200
                           transition-colors'
              >
                <RxCross1 className='w-4 h-4' aria-hidden="true" />
              </button>
            </div>
            
            {/* Content */}
            <div className='px-5 pb-8 max-h-[70vh] overflow-y-auto'>
              {mobileDrawer === 'role' && (
                <div>
                  <h2 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
                    {badgeContent.role.title}
                  </h2>
                  <BadgeContentParagraphs paragraphs={badgeContent.role.paragraphs} variant="drawer" />
                </div>
              )}
              
              {mobileDrawer === 'creator' && (
                <div>
                  <h2 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
                    {badgeContent.creator.title}
                  </h2>
                  <BadgeContentParagraphs paragraphs={badgeContent.creator.paragraphs} variant="drawer" />
                </div>
              )}
              
              {mobileDrawer === 'location' && (
                <div>
                  <h2 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
                    {badgeContent.location.title}
                  </h2>
                  <BadgeContentParagraphs paragraphs={badgeContent.location.paragraphs} variant="drawer" />
                  <button 
                    type="button"
                    onClick={handleLocationClick}
                    aria-label="View Broomfield, Colorado on Google Maps (opens in new tab)"
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
                  <h2 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
                    {badgeContent.philosophy.title}
                  </h2>
                  <BadgeContentParagraphs paragraphs={badgeContent.philosophy.paragraphs} variant="drawer" />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
