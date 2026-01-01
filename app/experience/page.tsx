'use client'

import { useState, useEffect } from 'react';
import ExperienceChip from '../components/experienceChip'
import { experienceData } from '../data/experience'

export default function Experience() {
  const [experienceSection, setExperienceSection] = useState('work')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const renderButtons = () => {
    const buttonJSX = experienceData.map((dataBlock) => {
      return (
        <button 
          type='button' 
          key={dataBlock.state} 
          onClick={() => setExperienceSection(dataBlock.state)} 
          className={`clickable base-navtab experience-navtab ${experienceSection === dataBlock.state ? 'experience-navtab-active' : ''}`}
        >
          {dataBlock.label}
        </button>
      )
    });

    return buttonJSX
  }

  const renderInformation = () => {
    const matchedExperience = experienceData.find((dataBlock) => dataBlock.state === experienceSection);
    if (!matchedExperience) return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <p className='text-base dark:text-neutral-500 light:text-neutral-500'>Coming Soon</p>
      </div>
    );
    if (!matchedExperience.data || matchedExperience.data.length === 0) return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <p className='text-base dark:text-neutral-500 light:text-neutral-500'>Coming Soon</p>
      </div>
    );

    const experienceJSX = matchedExperience.data.map((dp, idx) => {
      const isLast = idx === matchedExperience.data.length - 1;
      return (
        <ExperienceChip
          key={dp.company + dp.role}
          photo={dp.photo}
          altPhotoText={dp.altPhotoText}
          company={dp.company}
          website={dp.website}
          location={dp.location}
          role={dp.role}
          industry={dp.industry}
          timeline={dp.timeline}
          info={dp.info}
          tech={dp.tech}
          display={dp.display}
          isLast={isLast}
          index={idx}
        />
      )
    });

    return experienceJSX;
  }

  return (
    <section className={`w-full flex flex-col justify-center sm:justify-between items-center card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Section Header */}
      <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
        Experience
      </h2>

      {/* Tab Navigation */}
      <nav className='w-full flex flex-row border dark:border-neutral-800 light:border-neutral-200 rounded-md overflow-hidden'>
        {renderButtons()}
      </nav>

      {/* Content Area */}
      <article 
        key={experienceSection}
        className='w-full mt-4 flex flex-col animate-fade-in'
      >
        {renderInformation()}
      </article>
    </section>
  );
}
