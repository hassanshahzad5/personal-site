'use client';

import ProjectCard, { type Project } from './projectCard';

interface ProjectGroupProps {
  title: string;
  description?: string;
  projects: Project[];
}

export default function ProjectGroup({ title, description, projects }: ProjectGroupProps) {
  if (projects.length === 0) {
    return (
      <div className='mb-6 last:mb-0'>
        <h3 className='text-base font-semibold dark:text-neutral-100 light:text-neutral-900 mb-2'>
          {title}
        </h3>
        {description && (
          <p className='text-sm dark:text-neutral-500 light:text-neutral-500 mb-4'>
            {description}
          </p>
        )}
        <div className='flex items-center justify-center py-8 rounded-lg border border-dashed dark:border-neutral-800 light:border-neutral-300'>
          <span className='text-sm dark:text-neutral-600 light:text-neutral-400'>Coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className='mb-6 last:mb-0'>
      <h3 className='text-base font-semibold dark:text-neutral-100 light:text-neutral-900 mb-2'>
        {title}
      </h3>
      {description && (
        <p className='text-sm dark:text-neutral-500 light:text-neutral-500 mb-4'>
          {description}
        </p>
      )}
      <div className={`grid gap-3 ${projects.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} fullWidth={projects.length === 1} />
        ))}
      </div>
    </div>
  );
}

