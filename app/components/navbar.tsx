'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { MdEmail, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { AiOutlineDownload } from 'react-icons/ai';
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import Link from 'next/link';

import { ThemeContext } from '../theme'

// Breakpoints: mobile < 640px (sm), tablet 640-1024px (sm-lg), desktop > 1024px (lg)
const MOBILE_BREAKPOINT = 640;

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const closeMenuOnMobile = () => {
    if (isMobile) setIsMenuOpen(false);
  }

  const handleResumeClick = () => {
    window.open('/resume.pdf', '_blank');
  }

  const navTabs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Design', href: '/design' },
    { label: 'Fitness', href: '/fitness' },
  ]

  return (
    <nav className={`w-full flex flex-col sm:flex-row justify-center sm:justify-between 
                     py-3 px-5 items-center sticky top-0 z-50 transition-all duration-200
                     ${isScrolled 
                       ? 'dark:bg-neutral-900/80 light:bg-white/80 backdrop-blur-md border-b dark:border-neutral-800/50 light:border-neutral-200/50' 
                       : 'dark:bg-transparent light:bg-transparent'}`}>
      
      {/* Mobile Header - only shows below sm breakpoint */}
      <div className={`${isMobile ? 'flex' : 'hidden'} w-[95%] items-center justify-between py-2 ${isMenuOpen ? 'mb-2' : 'mb-0'}`}>
        <button 
          onClick={() => toggleTheme()} 
          className='clickable flex items-center justify-center w-9 h-9 
                     dark:bg-neutral-800/60 light:bg-white/60
                     border dark:border-neutral-700/50 light:border-neutral-300/50 
                     rounded-md backdrop-blur-sm transition-all duration-200'
          aria-label='Toggle theme'
        >
          {theme === 'dark' 
            ? <MdOutlineDarkMode className='w-5 h-5 dark:text-neutral-400'/> 
            : <MdOutlineLightMode className='w-5 h-5 light:text-neutral-600'/>}
        </button>
        
        <button 
          aria-label='Toggle Menu' 
          onClick={toggleMenu}
          className='clickable flex items-center justify-center w-9 h-9
                     dark:bg-neutral-800/60 light:bg-white/60
                     border dark:border-neutral-700/50 light:border-neutral-300/50 
                     rounded-md backdrop-blur-sm transition-all duration-200'
        >
          {isMenuOpen 
            ? <RxCross1 className='w-5 h-5'/> 
            : <RxHamburgerMenu className='w-5 h-5'/>}
        </button>
      </div>

      {/* Main Nav Content */}
      <div className={`${(isMobile && isMenuOpen || !isMobile) ? 'flex' : 'hidden'} 
                       w-full flex-col sm:flex-row justify-center sm:justify-between items-center
                       ${isMobile ? 'animate-fade-in' : ''}`}>
        
        {/* Navigation Links */}
        <div className='flex flex-col w-full sm:w-auto sm:flex-row mb-3 sm:mb-0 sm:gap-1'>
          {navTabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link 
                key={tab.href} 
                href={tab.href} 
                onClick={closeMenuOnMobile} 
                className={`px-4 py-2 rounded-none sm:rounded-md
                           text-center font-medium transition-all duration-200
                           ${active 
                             ? 'dark:text-neutral-100 light:text-neutral-900 dark:bg-neutral-900 light:bg-neutral-100' 
                             : 'dark:text-neutral-500 light:text-neutral-500 hover:dark:text-neutral-100 hover:light:text-neutral-900'}`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Action Icons */}
        <div className='flex flex-row gap-2 items-center'>
          <Link 
            href='mailto:hassanshahzad2002sm@gmail.com' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-9 h-9
                       dark:bg-neutral-800/60 light:bg-white/60
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md backdrop-blur-sm transition-all duration-200'
            aria-label='Email me'
          >
            <MdEmail className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600' onClick={closeMenuOnMobile}/>
          </Link>
          
          <Link 
            href='https://www.linkedin.com/in/thehassanshahzad/' 
            target='_blank' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-9 h-9
                       dark:bg-neutral-800/60 light:bg-white/60
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md backdrop-blur-sm transition-all duration-200'
            aria-label='LinkedIn Profile'
          >
            <FaLinkedin className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600' onClick={closeMenuOnMobile}/>
          </Link>
          
          <Link 
            href='https://www.github.com/hassanshahzad5/' 
            target='_blank' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-9 h-9
                       dark:bg-neutral-800/60 light:bg-white/60
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md backdrop-blur-sm transition-all duration-200'
            aria-label='GitHub Profile'
          >
            <FaGithub className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600' onClick={closeMenuOnMobile}/>
          </Link>
          
          <button 
            type='button' 
            onClick={() => {
              handleResumeClick();
              closeMenuOnMobile();
            }} 
            className='clickable flex flex-row items-center justify-center gap-2 
                       px-4 py-2 rounded-md font-medium text-sm
                       dark:bg-neutral-100 dark:text-neutral-900
                       light:bg-neutral-900 light:text-neutral-100
                       transition-all duration-200'
          >
            <AiOutlineDownload className='w-4 h-4'/>
            Resume
          </button>
          
          <button 
            onClick={() => toggleTheme()} 
            className={`${isMobile ? 'hidden' : 'flex'} clickable items-center justify-center w-9 h-9
                       dark:bg-neutral-800/60 light:bg-white/60
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md backdrop-blur-sm transition-all duration-200`}
            aria-label='Toggle theme'
          >
            {theme === 'dark' 
              ? <MdOutlineDarkMode className='w-5 h-5 dark:text-neutral-400'/> 
              : <MdOutlineLightMode className='w-5 h-5 light:text-neutral-600'/>}
          </button>
        </div>
      </div>
    </nav>
  )
}
