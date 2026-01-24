'use client';

import { useSyncExternalStore, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProjectGroup from '../components/projectGroup';
import { personalProjects, professionalProjects, academicProjects } from '../data/design';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const DESIGN_TABS = [
  { id: 'professional' as const, label: 'Professional' },
  { id: 'academic' as const, label: 'Academic' },
  { id: 'personal' as const, label: 'Personal' },
] as const;

type DesignTab = typeof DESIGN_TABS[number]['id'];

interface TabContentProps {
  tab: DesignTab;
  openProjectId: string | null;
  onProjectOpenChange: (projectId: string | null) => void;
}

function TabContent({ tab, openProjectId, onProjectOpenChange }: TabContentProps) {
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
          openProjectId={openProjectId}
          onProjectOpenChange={onProjectOpenChange}
        />
      ))}
    </div>
  );
}

function DesignContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current tab from URL or default to professional
  const tabParam = searchParams.get('tab');
  const validTabs: DesignTab[] = ['professional', 'academic', 'personal'];
  const activeTab: DesignTab = validTabs.includes(tabParam as DesignTab) 
    ? (tabParam as DesignTab) 
    : 'professional';

  // Get current project from URL
  const openProjectId = searchParams.get('project');

  const setActiveTab = useCallback((tab: DesignTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'professional') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    // Clear project when switching tabs
    params.delete('project');
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const handleProjectOpenChange = useCallback((projectId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (projectId) {
      params.set('project', projectId);
    } else {
      params.delete('project');
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [searchParams, router, pathname]);

  return (
    <div className='w-full flex flex-col justify-center sm:justify-between items-center card p-5'>
      <h1 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-1'>
        Design
      </h1>
      <p className='text-sm dark:text-neutral-500 light:text-neutral-500 mb-3 text-center w-full'>
        Visual storytelling, brand building, and marketing
      </p>

      {/* Tab Navigation */}
      <nav className='w-full flex flex-row border dark:border-neutral-800 light:border-neutral-200 rounded-md overflow-hidden'>
        {DESIGN_TABS.map((tab) => (
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

      {/* Tab Content */}
      <article 
        key={activeTab}
        className='w-full mt-4 flex flex-col animate-fade-in'
      >
        <TabContent
          tab={activeTab}
          openProjectId={openProjectId}
          onProjectOpenChange={handleProjectOpenChange}
        />
      </article>
    </div>
  );
}

function DesignFallback() {
  return (
    <div className='w-full flex flex-col justify-center sm:justify-between items-center card p-5'>
      <h1 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-1'>
        Design
      </h1>
      <p className='text-sm dark:text-neutral-500 light:text-neutral-500 mb-3 text-center w-full'>
        Visual storytelling, brand building, and marketing
      </p>
    </div>
  );
}

export default function DesignClient() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <section className='custom-section'>
      <div className={`transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <Suspense fallback={<DesignFallback />}>
          <DesignContent />
        </Suspense>
      </div>
    </section>
  );
}
