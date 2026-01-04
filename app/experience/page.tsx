'use client'

import { useSyncExternalStore } from 'react';
import ExperienceChip from '../components/experienceChip'
import { experienceData } from '../data/experience'
import Tabs from '../components/tabs'

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const EXPERIENCE_TABS = experienceData.map(d => ({ id: d.state, label: d.label }));
type ExperienceTab = typeof EXPERIENCE_TABS[number]['id'];

function renderExperienceContent(tab: ExperienceTab) {
  const matchedExperience = experienceData.find((dataBlock) => dataBlock.state === tab);
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

export default function Experience() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <section className={`w-full flex flex-col justify-center sm:justify-between items-center card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
        Experience
      </h2>

      <Tabs tabs={EXPERIENCE_TABS} defaultTab='professional'>
        {renderExperienceContent}
      </Tabs>
    </section>
  );
}
