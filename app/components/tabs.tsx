'use client';

import { Suspense } from 'react';
import { useTabParam } from '../hooks/useTabParam';

interface Tab<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: readonly Tab<T>[];
  defaultTab: T;
  children: (activeTab: T) => React.ReactNode;
}

function TabsContent<T extends string>({ tabs, defaultTab, children }: TabsProps<T>) {
  const validTabIds = tabs.map(t => t.id) as unknown as readonly T[];
  const [activeTab, setActiveTab] = useTabParam<T>(validTabIds, defaultTab);

  return (
    <>
      <nav className='w-full flex flex-row border dark:border-neutral-800 light:border-neutral-200 rounded-md overflow-hidden'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            onClick={() => setActiveTab(tab.id)}
            className={`clickable base-navtab experience-navtab ${activeTab === tab.id ? 'experience-navtab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <article 
        key={activeTab}
        className='w-full mt-4 flex flex-col animate-fade-in'
      >
        {children(activeTab)}
      </article>
    </>
  );
}

export default function Tabs<T extends string>(props: TabsProps<T>) {
  return (
    <Suspense fallback={
      <nav className='w-full flex flex-row border dark:border-neutral-800 light:border-neutral-200 rounded-md overflow-hidden opacity-50'>
        {props.tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            className='clickable base-navtab experience-navtab'
            disabled
          >
            {tab.label}
          </button>
        ))}
      </nav>
    }>
      <TabsContent {...props} />
    </Suspense>
  );
}


