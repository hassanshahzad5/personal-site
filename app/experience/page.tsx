'use client'

import { useSyncExternalStore, Suspense } from 'react';
import ExperienceChip from '../components/experienceChip'
import { experienceData } from '../data/experience'
import { useTabParam } from '../hooks/useTabParam'

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const VALID_TABS = ['professional', 'education', 'leadership'] as const;
type ExperienceTab = typeof VALID_TABS[number];

function ExperienceContent() {
  const [experienceSection, setExperienceSection] = useTabParam<ExperienceTab>(VALID_TABS, 'professional');
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const renderButtons = () => {
    return experienceData.map((dataBlock) => (
      <button 
        type='button' 
        key={dataBlock.state} 
        onClick={() => setExperienceSection(dataBlock.state as ExperienceTab)} 
        className={`clickable base-navtab experience-navtab ${experienceSection === dataBlock.state ? 'experience-navtab-active' : ''}`}
      >
        {dataBlock.label}
      </button>
    ));
  }

  const renderInformation = () => {
    const matchedExperience = experienceData.find((dataBlock) => dataBlock.state === experienceSection);
    if (!matchedExperience?.data?.length) {
      return (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-base dark:text-neutral-500 light:text-neutral-500'>Coming Soon</p>
        </div>
      );
    }

    return matchedExperience.data.map((dp, idx) => (
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
        isLast={idx === matchedExperience.data.length - 1}
        index={idx}
      />
    ));
  }

  return (
    <section className={`w-full flex flex-col justify-center sm:justify-between items-center card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
        Experience
      </h2>

      <nav className='w-full flex flex-row border dark:border-neutral-800 light:border-neutral-200 rounded-md overflow-hidden'>
        {renderButtons()}
      </nav>

      <article 
        key={experienceSection}
        className='w-full mt-4 flex flex-col animate-fade-in'
      >
        {renderInformation()}
      </article>
    </section>
  );
}

export default function Experience() {
  return (
    <Suspense fallback={
      <section className='w-full flex flex-col justify-center sm:justify-between items-center card p-5 opacity-0'>
        <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
          Experience
        </h2>
      </section>
    }>
      <ExperienceContent />
    </Suspense>
  );
}
