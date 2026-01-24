'use client';

import Image from 'next/image';
import Modal from './modal';
import { SiAdobeillustrator, SiAdobeindesign, SiAdobephotoshop } from 'react-icons/si';
import { MdPrint, MdPhoneIphone } from 'react-icons/md';
import { FiTag, FiPenTool } from 'react-icons/fi';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  pages?: string[];
  tags?: string[];
  details?: React.ReactNode;
  links?: { label: string; url: string }[];
  padImages?: boolean;
}

interface ProjectCardProps {
  project: Project;
  fullWidth?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const tagIcons: Record<string, React.ReactNode> = {
  'Adobe Illustrator': <SiAdobeillustrator className='w-3 h-3' />,
  'Adobe InDesign': <SiAdobeindesign className='w-3 h-3' />,
  'Adobe Photoshop': <SiAdobephotoshop className='w-3 h-3' />,
  'Adobe Photoshop Mix - iOS': <SiAdobephotoshop className='w-3 h-3' />,
  'Social Media Marketing': <MdPhoneIphone className='w-3 h-3' />,
  'Print': <MdPrint className='w-3 h-3' />,
  'Branding': <FiTag className='w-3 h-3' />,
  'Logo Design': <FiPenTool className='w-3 h-3' />,
};

function TagBadge({ tag, size = 'sm' }: { tag: string; size?: 'sm' | 'md' }) {
  const icon = tagIcons[tag];
  const isSmall = size === 'sm';
  
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full
                  dark:bg-neutral-800/60 light:bg-neutral-100
                  dark:text-neutral-300 light:text-neutral-600
                  border dark:border-neutral-700/50 light:border-neutral-300/50
                  ${isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
    >
      {icon}
      {tag}
    </span>
  );
}

export default function ProjectCard({ project, fullWidth = false, isOpen = false, onOpenChange }: ProjectCardProps) {
  const thumbnailSrc = project.thumbnail || (project.pages && project.pages[0]);

  const handleOpen = () => {
    onOpenChange?.(true);
  };

  const handleClose = () => {
    onOpenChange?.(false);
  };

  return (
    <>
      <button
        type='button'
        onClick={handleOpen}
        className='group text-left w-full p-4 rounded-lg
                   dark:bg-neutral-800/30 light:bg-neutral-50
                   border dark:border-neutral-800 light:border-neutral-200
                   hover:dark:border-neutral-700 hover:light:border-neutral-300
                   hover:dark:bg-neutral-800/50 hover:light:bg-neutral-100
                   transition-all duration-200 cursor-pointer'
      >
        {thumbnailSrc && (
          <div className={`relative w-full rounded-md overflow-hidden mb-3
                          dark:bg-neutral-800 light:bg-neutral-200
                          ${fullWidth ? 'h-48 sm:h-56' : 'aspect-[4/3]'}
                          ${project.padImages ? 'p-3' : ''}`}>
            <Image
              src={thumbnailSrc}
              alt={`${project.title} thumbnail`}
              fill
              className={`object-contain group-hover:scale-105 transition-transform duration-300 ${project.padImages ? 'p-2' : ''}`}
            />
          </div>
        )}

        <h3 className='font-semibold dark:text-neutral-100 light:text-neutral-900 mb-1
                       group-hover:dark:text-neutral-50 transition-colors'>
          {project.title}
        </h3>

        <p className='text-sm dark:text-neutral-400 light:text-neutral-600 line-clamp-2 mb-2'>
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {project.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} size='sm' />
            ))}
            {project.tags.length > 3 && (
              <span className='text-xs dark:text-neutral-500 light:text-neutral-400'>
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title={project.title}>
        {/* View PDF button */}
        {project.links && project.links.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-3'>
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm
                           dark:bg-neutral-800 light:bg-neutral-100
                           dark:text-neutral-200 light:text-neutral-800
                           hover:dark:bg-neutral-700 hover:light:bg-neutral-200
                           border dark:border-neutral-700 light:border-neutral-300
                           transition-colors'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                </svg>
                {link.label}
                <svg className='w-3 h-3 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mb-3'>
            {project.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} size='md' />
            ))}
          </div>
        )}

        {/* Description */}
        <p className='text-sm dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-4'>
          {project.description}
        </p>

        {/* Details */}
        {project.details && (
          <div className='mb-4'>
            {project.details}
          </div>
        )}

        {/* Pages gallery */}
        {project.pages && project.pages.length > 0 && (() => {
          const count = project.pages.length;
          // Calculate spans: items stretch to fill the row when fewer than max
          // Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col
          const getSpanClasses = () => {
            if (count === 1) return 'col-span-1 md:col-span-2 xl:col-span-4';
            if (count === 2) return 'col-span-1 md:col-span-1 xl:col-span-2';
            if (count === 3) return 'col-span-1 md:col-span-1 xl:col-span-1';
            return 'col-span-1';
          };
          const spanClasses = getSpanClasses();
          const isSingle = count === 1;

          return (
            <div className={isSingle ? 'flex-1 flex flex-col' : ''}>
              <div className={`gap-3 ${isSingle ? 'flex-1 flex' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4'}`}>
                {project.pages.map((page, idx) => (
                  <div 
                    key={page}
                    className={`relative rounded-lg overflow-hidden
                               dark:bg-neutral-800 light:bg-neutral-100
                               border dark:border-neutral-700 light:border-neutral-200
                               ${project.padImages ? 'p-3' : ''}
                               ${isSingle ? 'flex-1 flex items-center justify-center' : spanClasses + ' w-full'}`}
                  >
                    <Image
                      src={page}
                      alt={`${project.title} - Page ${idx + 1}`}
                      width={800}
                      height={1000}
                      className={isSingle ? 'max-w-full max-h-full object-contain' : 'w-full h-auto'}
                    />
                  </div>
                ))}
              </div>
              {project.pages.length > 1 && (
                <p className='text-xs text-center dark:text-neutral-500 light:text-neutral-400 mt-3'>
                  {project.pages.length} pages
                </p>
              )}
            </div>
          );
        })()}
      </Modal>
    </>
  );
}
