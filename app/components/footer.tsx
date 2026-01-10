'use client';

import Link from 'next/link';
import { FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { AiOutlineDownload } from 'react-icons/ai';
import { socialLinks } from '../config/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full flex flex-col items-center py-4 px-5 mt-6
                       border-t dark:border-neutral-800/50 light:border-neutral-300/50'>
      {/* Social Links */}
      <div className='flex gap-3 mb-4'>
        <Link 
          href={`mailto:${socialLinks.email}`} 
          rel='noopener noreferrer'
          className='clickable flex items-center justify-center w-9 h-9
                     dark:bg-neutral-800/50 light:bg-white/50
                     border dark:border-neutral-700/50 light:border-neutral-300/50
                     rounded-md backdrop-blur-sm transition-all duration-200'
          aria-label='Email'
        >
          <MdEmail className='w-4 h-4 dark:text-neutral-500 light:text-neutral-500'/>
        </Link>
        <Link 
          href={socialLinks.linkedin} 
          target='_blank' 
          rel='noopener noreferrer'
          className='clickable flex items-center justify-center w-9 h-9
                     dark:bg-neutral-800/50 light:bg-white/50
                     border dark:border-neutral-700/50 light:border-neutral-300/50
                     rounded-md backdrop-blur-sm transition-all duration-200'
          aria-label='LinkedIn'
        >
          <FaLinkedin className='w-4 h-4 dark:text-neutral-500 light:text-neutral-500'/>
        </Link>
        <Link 
          href={socialLinks.github} 
          target='_blank' 
          rel='noopener noreferrer'
          className='clickable flex items-center justify-center w-9 h-9
                     dark:bg-neutral-800/50 light:bg-white/50
                     border dark:border-neutral-700/50 light:border-neutral-300/50
                     rounded-md backdrop-blur-sm transition-all duration-200'
          aria-label='GitHub'
        >
          <FaGithub className='w-4 h-4 dark:text-neutral-500 light:text-neutral-500'/>
        </Link>
        <Link 
          href={socialLinks.youtube} 
          target='_blank' 
          rel='noopener noreferrer'
          className='clickable flex items-center justify-center w-9 h-9
                     dark:bg-neutral-800/50 light:bg-white/50
                     border dark:border-neutral-700/50 light:border-neutral-300/50
                     rounded-md backdrop-blur-sm transition-all duration-200'
          aria-label='YouTube'
        >
          <FaYoutube className='w-4 h-4 dark:text-neutral-500 light:text-neutral-500'/>
        </Link>
        <Link 
          href='/documents/resume.pdf'
          target='_blank' 
          rel='noopener noreferrer'
          className='clickable flex flex-row items-center justify-center gap-1.5 
                     px-3 py-2 rounded-md text-sm
                     dark:bg-neutral-800/50 light:bg-white/50
                     dark:text-neutral-500 light:text-neutral-500
                     border dark:border-neutral-700/50 light:border-neutral-300/50
                     backdrop-blur-sm transition-all duration-200'
          aria-label='Resume'
        >
          <AiOutlineDownload className='w-4 h-4'/>
          Resume
        </Link>
      </div>

      {/* Copyright */}
      <p className='text-xs dark:text-neutral-600 light:text-neutral-400'>
        &copy; {currentYear} Hassan Shahzad
      </p>
    </footer>
  )
}
