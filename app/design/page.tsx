'use client';

import { useSyncExternalStore } from 'react';
import Tabs from '../components/tabs';
import ProjectGroup from '../components/projectGroup';
import { personalProjects, professionalProjects, academicProjects } from '../data/design';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const DESIGN_TABS = [
  { id: 'personal' as const, label: 'Personal' },
  { id: 'professional' as const, label: 'Professional' },
  { id: 'academic' as const, label: 'Academic' },
] as const;

type DesignTab = typeof DESIGN_TABS[number]['id'];

function renderTabContent(tab: DesignTab) {
  const categories = {
    personal: personalProjects,
    professional: professionalProjects,
    academic: academicProjects,
  }[tab];

  return (
    <div>
      {categories.map((category) => (
        <ProjectGroup
          key={category.title}
          title={category.title}
          description={category.description}
          projects={category.projects}
        />
      ))}
    </div>
  );
}

export default function Design() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <section className='custom-section'>
      <div className={`w-full flex flex-col justify-center sm:justify-between items-center card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-1'>
          Design
        </h2>
        <p className='text-sm dark:text-neutral-500 light:text-neutral-500 mb-3 text-center w-full'>
          Visual storytelling, brand building, and marketing
        </p>

        <Tabs tabs={DESIGN_TABS} defaultTab='personal'>
          {renderTabContent}
        </Tabs>
      </div>
    </section>
  );
}
