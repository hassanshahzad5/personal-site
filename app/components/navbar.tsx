'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { MdEmail } from 'react-icons/md';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { AiOutlineDownload } from 'react-icons/ai';
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import Link from 'next/link';

import { ThemeContext } from '../theme'

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
        setIsMobile(windowWidth < 768);

        const handleResize = () => {
          setWindowWidth(window.innerWidth);
          setIsMobile(windowWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }, [windowWidth, isMobile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const closeMenuOnMobile = () => {
    if (isMobile) setIsMenuOpen(false);
  }

  const handleResumeClick = () => {
    window.open(
      '/resume.pdf',
      '_blank'
    )
  }

  const navTabs = [
    { label: 'HOME', href: '/' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'DESIGN', href: '/design' },
  ]

  return (
    <nav className='w-[100vw] md:w-[100%] flex flex-col md:flex-row justify-center md:justify-between py-3 px-5 items-center sticky top-0 z-50 dark:bg-zinc-950 light:bg-zinc-50'>
      <div className={`${isMobile ? 'flex' : 'hidden'} w-[95%] items-center justify-between py-2 ${isMenuOpen ? 'mb-2' : 'mb-0'}`}>
        <button onClick={() => toggleTheme()} className='clickable icon border-1 rounded-full p-0.5'>
          {theme === 'dark' ? <MdOutlineDarkMode/> : <MdOutlineLightMode/>}
        </button>
        <button aria-labelledby='Menu Toggle Button' onClick={() => {toggleMenu();}}>
          <RxHamburgerMenu className='clickable icon'></RxHamburgerMenu>
        </button>
      </div>

      <div className={`${(isMobile && isMenuOpen || !isMobile) ? 'flex' : 'hidden'} w-[100%] flex-col md:flex-row justify-center md:justify-between items-center`}>
        <div className='flex flex-col w-[100%] md:w-auto md:flex-row mb-2 md:mb-0 md:navbar md:gap-2'>
          {
            navTabs.map(tab => {
              const active = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href} onClick={() => closeMenuOnMobile()} className={`clickable base-navtab ${active ? 'active-navtab' : 'inactive-navtab'}`}>
                  {tab.label}
                </Link>
              );
            })
          }
        </div>

        <div className='flex flex-row gap-3 items-center'>
          <Link href='mailto:hassanshahzad2002sm@gmail.com' rel='noopener noreferrer'>
            <MdEmail className='icon clickable' onClick={() => closeMenuOnMobile()}/>
          </Link>
          <Link href='https://www.linkedin.com/in/thehassanshahzad/' target='_blank' rel='noopener noreferrer'>
            <FaLinkedin className='icon clickable' onClick={() => closeMenuOnMobile()}/>
          </Link>
          <Link href='https://www.github.com/hassanshahzad5/' target='_blank' rel='noopener noreferrer'>
            <FaGithub className='icon clickable' onClick={() => closeMenuOnMobile()}/>
          </Link>
          <button type='button' onClick={() => {
            handleResumeClick();
            closeMenuOnMobile();
          }} className='clickable flex flex-row items-center justify-center border-1 py-0.5 px-1.5 border-l-10 h-[100%]'>
            <AiOutlineDownload className='icon mr-2'></AiOutlineDownload>
            Resume
          </button>
          <button onClick={() => toggleTheme()} className={`${isMobile ? 'hidden' : ''} clickable icon border-1 rounded-full p-0.5`}>
            {theme === 'dark' ? <MdOutlineDarkMode/> : <MdOutlineLightMode/>}
          </button>
        </div>
      </div>
    </nav>
  )
}