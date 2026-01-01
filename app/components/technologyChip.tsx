'use client';

import { technologyMap } from '../data/technologyMap'

type TechnologyChipProps = {
  name?: string;
}

export default function TechnologyChip({ name }: TechnologyChipProps) {
  let techObj: { name?: string; logo?: React.ComponentType<{ className?: string; color?: string }>; color?: string; description?: string } | undefined;
  
  for (const category of technologyMap) {
    const found = category.technologies.find(t => t.name === name);
    if (found) {
      techObj = found;
      break;
    }
  }

  if (!techObj) {
    techObj = { name };
  }

  const Logo = techObj.logo;

  return (
    <div 
      className="flex items-center gap-1.5 px-2 py-1 rounded-md 
                 border dark:border-neutral-800 light:border-neutral-200
                 dark:bg-neutral-800/50 light:bg-neutral-50
                 transition-colors duration-200 cursor-default"
    >
      {Logo && (
        <Logo 
          className="w-3.5 h-3.5" 
          color={techObj.color} 
        />
      )}
      <span className="text-xs dark:text-neutral-400 light:text-neutral-600">
        {techObj.name}
      </span>
    </div>
  );
}
