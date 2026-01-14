'use client';

import Image from 'next/image';
import { technologyMap } from '../data/technologyMap'
import TechnologyChip from './technologyChip'

// Breakpoints: mobile < 640px (sm), tablet 640-1024px (sm-lg), desktop > 1024px (lg)

type ChipProps = {
  photo: string | { light: string; dark: string };
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
  const hasVariants = typeof photo === 'object';
  const photoLight = hasVariants ? photo.light : photo;
  const photoDark = hasVariants ? photo.dark : photo;
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
        <div className='h-20 w-20 rounded-xl bg-white dark:bg-neutral-900/60 p-3
                        border dark:border-neutral-800 light:border-neutral-200
                        shadow-sm dark:shadow-none flex items-center justify-center'>
          {hasVariants ? (
            <>
              <Image 
                src={photoLight} 
                alt={altPhotoText} 
                width={64} 
                height={64} 
                className='w-full h-full object-contain dark:hidden'
              />
              <Image 
                src={photoDark} 
                alt={altPhotoText} 
                width={64} 
                height={64} 
                className='w-full h-full object-contain hidden dark:block'
              />
            </>
          ) : (
            <Image 
              src={photoLight} 
              alt={altPhotoText} 
              width={64} 
              height={64} 
              className='w-full h-full object-contain'
            />
          )}
        </div>
      </div>

      {/* Tablet/Desktop: Timeline connector on the left */}
      <div className='hidden sm:flex flex-col items-center mr-4 lg:mr-5'>
        <div className='relative z-10 shrink-0'>
          <div className='h-16 w-16 lg:h-20 lg:w-20 rounded-xl bg-white dark:bg-neutral-900/60 p-2.5
                          border dark:border-neutral-800 light:border-neutral-200
                          shadow-sm dark:shadow-none flex items-center justify-center'>
            {hasVariants ? (
              <>
                <Image 
                  src={photoLight} 
                  alt={altPhotoText} 
                  width={80} 
                  height={80} 
                  className='w-full h-full object-contain dark:hidden'
                />
                <Image 
                  src={photoDark} 
                  alt={altPhotoText} 
                  width={80} 
                  height={80} 
                  className='w-full h-full object-contain hidden dark:block'
                />
              </>
            ) : (
              <Image 
                src={photoLight} 
                alt={altPhotoText} 
                width={80} 
                height={80} 
                className='w-full h-full object-contain'
              />
            )}
          </div>
        </div>
        {!isLast && (
          <div className='w-px grow dark:bg-neutral-800 light:bg-neutral-300'></div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-8 sm:pb-5'}`}>
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
            <span className='text-xs px-1.5 py-0.5 rounded
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
          <div className="mt-3">
            {/* Mobile: 2x2 grid with Other spanning full width */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {(() => {
                const entries = Object.entries(categorizedTech);
                const nonOtherEntries = entries.filter(([categoryName]) => categoryName !== 'Other');
                const hasOther = !!categorizedTech['Other'];
                const totalCategories = nonOtherEntries.length + (hasOther ? 1 : 0);
                const shouldSpanFull = totalCategories === 1;

                return (
                  <>
                    {nonOtherEntries.map(([categoryName, techArray]) => (
                      <div 
                        key={categoryName} 
                        className={`flex flex-col justify-between p-2 rounded-lg dark:bg-neutral-800/30 light:bg-neutral-50 min-h-24
                                   ${shouldSpanFull ? 'col-span-2' : ''}`}
                      >
                        <div className="flex-1 flex flex-row flex-wrap gap-1 items-center justify-center content-center">
                          {techArray.map((technology, idx) => (
                            <TechnologyChip key={idx} {...technology} />
                          ))}
                        </div>
                        <p className="text-xs font-medium text-center mt-2
                                      dark:text-neutral-500 light:text-neutral-500">
                          {categoryName}
                        </p>
                      </div>
                    ))}
                    {hasOther && (
                      <div 
                        className="col-span-2 flex flex-col justify-between p-2 rounded-lg dark:bg-neutral-800/30 light:bg-neutral-50 min-h-24"
                      >
                        <div className="flex-1 flex flex-row flex-wrap gap-1 items-center justify-center content-center">
                          {categorizedTech['Other'].map((technology, idx) => (
                            <TechnologyChip key={idx} {...technology} />
                          ))}
                        </div>
                        <p className="text-xs font-medium text-center mt-2
                                      dark:text-neutral-500 light:text-neutral-500">
                          Other
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Tablet/Desktop: Original row layout */}
            <div className="hidden sm:flex flex-col gap-2">
              {Object.entries(categorizedTech).map(([categoryName, techArray]) => (
                <div 
                  key={categoryName} 
                  className="grid grid-cols-5 gap-2 items-center"
                >
                  <p className="text-xs font-medium col-span-1 text-left
                                dark:text-neutral-500 light:text-neutral-500
                                border-r dark:border-neutral-800 light:border-neutral-300 
                                pr-3 py-1 w-full self-center">
                    {categoryName}
                  </p>
                  <div className="flex flex-row flex-wrap gap-1.5 items-center justify-start col-span-4 w-full">
                    {techArray.map((technology, idx) => (
                      <TechnologyChip key={idx} {...technology} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
