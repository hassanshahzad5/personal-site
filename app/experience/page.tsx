'use client'

import { useState } from 'react';
import ExperienceChip from '../components/experienceChip'
import { experienceData } from '../data/experience'

export default function Experience() {
  const [experienceSection, setExperienceSection] = useState('work')

  const renderButtons = () => {
    const buttonJSX = experienceData.map((dataBlock) => {
      return (
        <button type='button' key={dataBlock.state} onClick={() => setExperienceSection(dataBlock.state)} className={`clickable base-navtab experience-navtab ${experienceSection === dataBlock.state ? 'experience-navtab-active' : ''}`}>{dataBlock.label}</button>
      )
    });

    return buttonJSX
  }

  const renderInformation = () => {
    const matchedExperience = experienceData.find((dataBlock) => dataBlock.state === experienceSection);
    if (!matchedExperience) return (<div>Coming Soon...</div>); // No 'state' matched in experience.ts data file
    if (!matchedExperience.data || matchedExperience.data.length === 0) return (<div>Coming Soon...</div>); // No data in matched 'state' data array

    const experienceJSX = matchedExperience.data.map((dp, idx) => {
      const isLast = idx === matchedExperience.data.length - 1;
      return (
        <ExperienceChip
          key={dp.company}
          photo={dp.photo}
          altPhotoText={dp.altPhotoText}
          company={dp.company}
          location={dp.location}
          role={dp.role}
          industry={dp.industry}
          timeline={dp.timeline}
          info={dp.info}
          tech={dp.tech}
          display={dp.display}
          isLast={isLast}
          >
        </ExperienceChip>
      )
    });

    return experienceJSX;
  }

  return (
    <section className='w-[100%] flex flex-col justify-center md:justify-between items-center border-1 dark:border-zinc-800 light:border-zinc-200 p-4 rounded-xl dark:bg-zinc-900/50 light:bg-white/80 dark:shadow-lg dark:shadow-zinc-900/50 light:shadow-lg light:shadow-zinc-200/50 backdrop-blur-sm'>
      <h2 className='text-2xl md:text-3xl mb-3 font-semibold bg-gradient-to-r dark:from-zinc-100 dark:to-zinc-400 light:from-zinc-700 light:to-zinc-900 bg-clip-text text-transparent'>Experience</h2>
      <nav className='w-[100%] flex flex-row border-1 dark:border-zinc-800 light:border-zinc-200'>
        {renderButtons()}
      </nav>
      <article className='w-[100%] border-1 dark:border-zinc-800 light:border-zinc-200 p-4 flex flex-col'>
        {renderInformation()}
      </article>
    </section>
  );
}
