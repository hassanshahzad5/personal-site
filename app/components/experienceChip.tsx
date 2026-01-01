'use client';

import Image from 'next/image';
import { technologyMap } from '../data/technologyMap'
import TechnologyChip from './technologyChip'

// Breakpoints: mobile < 640px (sm), tablet 640-1024px (sm-lg), desktop > 1024px (lg)

type ChipProps = {
  photo: string;
  altPhotoText: string;
  company: string;
  website?: string;
  location: string;
  role: string;
  industry: string;
  timeline: string;
  info: string[];
  tech: string[];
  display: boolean;
  isLast?: boolean;
  index?: number;
}

export default function ExperienceChip({photo, altPhotoText, company, website, location, role, industry, timeline, info, tech, isLast = false, index = 0}: ChipProps) {
  const categorizedTech: Record<string, object[]> = {};

  tech.forEach((techName) => {
    let found = false;

    technologyMap.forEach((category) => {
      const match = category.technologies.find(t => t.name === techName);
      if (match) {
        if (!categorizedTech[category.name]) categorizedTech[category.name] = [];
        categorizedTech[category.name].push(match);
        found = true;
      }
    });

    if (!found) {
      const otherCategory = technologyMap.find(c => c.name === 'Other');
      if (!categorizedTech['Other']) categorizedTech['Other'] = [];
      if (otherCategory) {
        const match = otherCategory.technologies.find(t => t.name === techName);
        if (match) categorizedTech['Other'].push(match);
        else categorizedTech['Other'].push({ name: techName });
      } else {
        categorizedTech['Other'].push({ name: techName });
      }
    }
  });

  return (
    <article 
      className='flex flex-col sm:flex-row relative animate-fade-in-up'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Mobile: Logo only, no timeline */}
      <div className='flex sm:hidden flex-col items-center mb-3'>
        <div className='h-14 w-14 rounded-xl bg-white dark:bg-neutral-800 p-2.5
                        border dark:border-neutral-700 light:border-neutral-200
                        shadow-sm dark:shadow-neutral-900/20 flex items-center justify-center'>
          <Image 
            src={photo} 
            alt={altPhotoText} 
            width={64} 
            height={64} 
            className='w-full h-full object-contain'
          />
        </div>
      </div>

      {/* Tablet/Desktop: Timeline connector on the left */}
      <div className='hidden sm:flex flex-col items-center mr-4 lg:mr-5'>
        <div className='relative z-10 shrink-0'>
          <div className='h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-white dark:bg-neutral-800 p-2
                          border dark:border-neutral-700 light:border-neutral-200
                          shadow-sm dark:shadow-neutral-900/20 flex items-center justify-center'>
            <Image 
              src={photo} 
              alt={altPhotoText} 
              width={80} 
              height={80} 
              className='w-full h-full object-contain'
            />
          </div>
        </div>
        {!isLast && (
          <div className='w-px grow dark:bg-neutral-800 light:bg-neutral-300'></div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1'>
          <p className='text-sm text-center sm:text-start dark:text-neutral-500 light:text-neutral-500'>
            {website ? (
              <a 
                href={website} 
                target='_blank' 
                rel='noopener noreferrer'
                className='underline underline-offset-2 hover:dark:text-neutral-300 hover:light:text-neutral-700 transition-colors'
              >
                {company}
              </a>
            ) : (
              company
            )} · {location}
          </p>
          <span className='text-sm text-center sm:text-end dark:text-neutral-400 light:text-neutral-500 mt-1 sm:mt-0 shrink-0'>
            {timeline}
          </span>
        </div>
        <h3 className='text-lg sm:text-xl lg:text-2xl text-center sm:text-start font-semibold dark:text-neutral-100 light:text-neutral-900 mb-1'>
          {role}
        </h3>

        {/* Industry badge */}
        {industry && (
          <div className='flex justify-center sm:justify-start mb-2'>
            <span className='text-[11px] px-1.5 py-0.5 rounded
                            dark:bg-neutral-800/60 light:bg-neutral-100
                            dark:text-neutral-400 light:text-neutral-600
                            border dark:border-neutral-700/50 light:border-neutral-300/50'>
              {industry}
            </span>
          </div>
        )}

        {/* Accomplishments - Summary paragraph */}
        {info.length > 0 && (
          <p className='text-sm lg:text-base text-center sm:text-start leading-relaxed dark:text-neutral-300 light:text-neutral-700'>
            {info.map((accomplishment, idx) => (
              <span key={idx}>
                <span dangerouslySetInnerHTML={{ __html: accomplishment }} />
                {idx < info.length - 1 && ' '}
              </span>
            ))}
          </p>
        )}

        {/* Technologies */}
        {Object.keys(categorizedTech).length > 0 && (
          <div className="flex flex-col gap-2 justify-start mt-3">
            {Object.entries(categorizedTech).map(([categoryName, techArray]) => (
              <div 
                key={categoryName} 
                className="flex flex-col sm:grid sm:grid-cols-5 gap-2 items-center justify-center"
              >
                <p className="text-xs font-medium sm:col-span-1 text-center sm:text-left
                              dark:text-neutral-500 light:text-neutral-500
                              border-b sm:border-r sm:border-b-0 
                              dark:border-neutral-800 light:border-neutral-300 
                              px-2 sm:px-0 sm:pr-3 py-1 w-auto sm:w-full sm:self-center">
                  {categoryName}
                </p>
                <div className="flex flex-row flex-wrap gap-1.5 items-center justify-center sm:justify-start sm:col-span-4 w-full">
                  {techArray.map((technology, idx) => (
                    <TechnologyChip key={idx} {...technology} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
