'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { MdEmail, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa';
import { AiOutlineDownload } from 'react-icons/ai';
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import Link from 'next/link';

import { ThemeContext } from '../theme'
import { socialLinks } from '../config/site'

// Breakpoints: mobile < 768px (md), desktop >= 768px (md+)

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const closeMenuOnMobile = () => {
    setIsMenuOpen(false);
  }

  const handleResumeClick = () => {
    window.open('/documents/resume.pdf', '_blank');
  }

  const navTabs = [
    { label: 'Home', href: '/', description: 'About Me' },
    { label: 'Projects', href: '/projects', description: 'Full Stack / SWE Projects' },
    { label: 'Design', href: '/design', description: 'Creative Technology & Design Projects' },
    { label: 'Fitness', href: '/fitness', description: 'Powerlifting & Fitness Projects' },
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`hidden md:flex w-full flex-row justify-between 
                       py-3 px-5 items-center sticky top-0 z-50 transition-all duration-200
                       ${isScrolled 
                         ? 'dark:bg-neutral-900/80 light:bg-white/80 backdrop-blur-md border-b dark:border-neutral-800/50 light:border-neutral-200/50' 
                         : 'dark:bg-transparent light:bg-transparent'}`}>
        
        {/* Navigation Links */}
        <div className='flex flex-row gap-1'>
          {navTabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link 
                key={tab.href} 
                href={tab.href} 
                className={`px-4 py-2 rounded-md text-center font-medium transition-all duration-200
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
            href={`mailto:${socialLinks.email}`} 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-9 h-9
                       dark:bg-neutral-800/60 light:bg-white/60
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md backdrop-blur-sm transition-all duration-200'
            aria-label='Email me'
          >
            <MdEmail className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600'/>
          </Link>
          
          <Link 
            href={socialLinks.linkedin} 
            target='_blank' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-9 h-9
                       dark:bg-neutral-800/60 light:bg-white/60
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md backdrop-blur-sm transition-all duration-200'
            aria-label='LinkedIn Profile'
          >
            <FaLinkedin className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600'/>
          </Link>
          
          <Link 
            href={socialLinks.github} 
            target='_blank' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-9 h-9
                       dark:bg-neutral-800/60 light:bg-white/60
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md backdrop-blur-sm transition-all duration-200'
            aria-label='GitHub Profile'
          >
            <FaGithub className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600'/>
          </Link>
          
          <Link 
            href={socialLinks.youtube} 
            target='_blank' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-9 h-9
                       dark:bg-neutral-800/60 light:bg-white/60
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md backdrop-blur-sm transition-all duration-200'
            aria-label='YouTube Channel'
          >
            <FaYoutube className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600'/>
          </Link>
          
          <button 
            type='button' 
            onClick={handleResumeClick} 
            className='clickable flex flex-row items-center justify-center gap-2 
                       px-3 py-2 rounded-md font-medium text-sm
                       dark:bg-neutral-800/60 light:bg-white/60
                       dark:text-neutral-300 light:text-neutral-600
                       dark:hover:text-neutral-100 light:hover:text-neutral-900
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       backdrop-blur-sm transition-all duration-200'
          >
            <AiOutlineDownload className='w-4 h-4'/>
            Resume
          </button>
          
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
        </div>
      </nav>

      {/* Mobile Header Bar */}
      <nav className={`flex md:hidden w-full items-center justify-between px-5 py-3 sticky top-0 z-50 transition-all duration-200
                       ${isScrolled && !isMenuOpen
                         ? 'dark:bg-neutral-900/80 light:bg-white/80 backdrop-blur-md border-b dark:border-neutral-800/50 light:border-neutral-200/50' 
                         : 'dark:bg-transparent light:bg-transparent'}`}>
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
                     rounded-md backdrop-blur-sm transition-all duration-200 z-60'
        >
          {isMenuOpen 
            ? <RxCross1 className='w-5 h-5'/> 
            : <RxHamburgerMenu className='w-5 h-5'/>}
        </button>
      </nav>

      {/* Mobile Full-Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 md:hidden flex flex-col
                    dark:bg-neutral-900/85 light:bg-neutral-100/85 backdrop-blur-lg
                    transition-all duration-300 ease-out
                    ${isMenuOpen 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 -translate-y-full pointer-events-none'}`}
      >
        {/* Navigation Links - Top */}
        <div className='flex-1 flex flex-col items-start justify-start pt-16 px-5 w-full'>
          {navTabs.map((tab, index) => {
            const active = pathname === tab.href;
            const isLast = index === navTabs.length - 1;
            return (
              <Link 
                key={tab.href} 
                href={tab.href}
                onClick={closeMenuOnMobile}
                className={`w-full p-2 block transition-all duration-300
                           ${!isLast ? 'border-b dark:border-neutral-800 light:border-neutral-200' : ''}`}
                style={{ 
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)'
                }}
              >
                <span className={`block text-xl font-serif
                                 ${active 
                                   ? 'font-bold dark:text-neutral-100 light:text-neutral-900' 
                                   : 'font-medium dark:text-neutral-400 light:text-neutral-600'}`}>
                  {tab.label}
                </span>
                <span className='block text-sm dark:text-neutral-500 light:text-neutral-500 mt-0.5'>
                  {tab.description}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Social Links & Resume - Bottom */}
        <div 
          className={`flex flex-row items-center justify-center gap-3 p-3
                      transition-all duration-300 ease-out delay-200
                      ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <Link 
            href={`mailto:${socialLinks.email}`} 
            onClick={closeMenuOnMobile}
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-11 h-11
                       dark:bg-neutral-800/60 light:bg-neutral-100
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md transition-colors duration-200'
            aria-label='Email me'
          >
            <MdEmail className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600'/>
          </Link>
          
          <Link 
            href={socialLinks.linkedin} 
            onClick={closeMenuOnMobile}
            target='_blank' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-11 h-11
                       dark:bg-neutral-800/60 light:bg-neutral-100
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md transition-colors duration-200'
            aria-label='LinkedIn Profile'
          >
            <FaLinkedin className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600'/>
          </Link>
          
          <Link 
            href={socialLinks.github} 
            onClick={closeMenuOnMobile}
            target='_blank' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-11 h-11
                       dark:bg-neutral-800/60 light:bg-neutral-100
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md transition-colors duration-200'
            aria-label='GitHub Profile'
          >
            <FaGithub className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600'/>
          </Link>
          
          <Link 
            href={socialLinks.youtube} 
            onClick={closeMenuOnMobile}
            target='_blank' 
            rel='noopener noreferrer'
            className='clickable flex items-center justify-center w-11 h-11
                       dark:bg-neutral-800/60 light:bg-neutral-100
                       border dark:border-neutral-700/50 light:border-neutral-300/50
                       rounded-md transition-colors duration-200'
            aria-label='YouTube Channel'
          >
            <FaYoutube className='w-5 h-5 dark:text-neutral-400 light:text-neutral-600'/>
          </Link>
          
          <button 
            type='button' 
            onClick={() => {
              handleResumeClick();
              closeMenuOnMobile();
            }} 
            className='clickable flex flex-row items-center justify-center gap-2 
                       px-4 py-2.5 rounded-md font-medium text-sm
                       dark:bg-neutral-800 light:bg-neutral-100
                       dark:text-neutral-100 light:text-neutral-900
                       border dark:border-neutral-700 light:border-neutral-300
                       transition-colors duration-200'
          >
            <AiOutlineDownload className='w-4 h-4'/>
            Resume
          </button>
        </div>
      </div>
    </>
  )
}
