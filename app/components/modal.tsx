'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  const shouldRender = isOpen || isClosing;
  if (!shouldRender) return null;

  const modalContent = (
    <div className='fixed inset-0 z-50'>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />
      
      {/* Mobile/Tablet: Slide from bottom | Desktop: Right drawer 75% width */}
      <div className={`absolute inset-x-0 bottom-0 top-0
                      md:inset-y-0 md:left-auto md:right-0 md:w-3/4
                      overflow-hidden
                      dark:bg-neutral-900 light:bg-white
                      md:border-l dark:border-neutral-700 light:border-neutral-200
                      shadow-2xl
                      flex flex-col
                      transition-transform duration-300 ease-out
                      ${isClosing 
                        ? 'translate-y-full md:translate-y-0 md:translate-x-full' 
                        : 'translate-y-0 md:translate-x-0 modal-enter'
                      }`}>
        
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b dark:border-neutral-800 light:border-neutral-200 shrink-0'>
          {/* Drag handle - mobile only */}
          <div className='absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full dark:bg-neutral-700 light:bg-neutral-300 md:hidden' />
          
          <h3 className='text-lg font-semibold dark:text-neutral-100 light:text-neutral-900 pr-8 mt-2 md:mt-0'>
            {title}
          </h3>
          
          <button
            type='button'
            onClick={handleClose}
            className='absolute right-4 top-4 p-1.5 rounded-full cursor-pointer
                       dark:text-neutral-400 light:text-neutral-500
                       hover:dark:bg-neutral-800 hover:light:bg-neutral-100
                       transition-colors'
            aria-label='Close'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4'>
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
