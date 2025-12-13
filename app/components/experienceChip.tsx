import Image from 'next/image';
import { technologyMap } from '../data/technologyMap'
import TechnologyChip from './technologyChip'

type ChipProps = {
  photo: string;
  altPhotoText: string;
  company: string;
  location: string;
  role: string;
  industry: string;
  timeline: string;
  info: string[];
  tech: string[];
  display: boolean;
  isLast?: boolean;
}

export default function ExperienceChip({photo, altPhotoText, company, location, role, industry, timeline, info, tech, display, isLast = false}: ChipProps) {
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
    <article className='flex flex-col md:flex-row md:mx-2 relative'>
      {/* Mobile: Centered logo with line below */}
      <div className={`flex md:hidden flex-col items-center ${isLast ? 'mb-3' : 'mb-4'}`}>
        <div className='relative z-10 shrink-0'>
          <Image src={photo} alt={altPhotoText} width={0} height={0} className='h-16 w-16 bg-white p-2 object-contain rounded-full shadow-lg dark:shadow-zinc-700 light:shadow-zinc-400'></Image>
        </div>
        {!isLast && (
          <div className='w-0.5 h-6 mt-3 dark:bg-zinc-700 light:bg-zinc-300'></div>
        )}
      </div>

      {/* Desktop: Timeline connector on the left */}
      <div className='hidden md:flex flex-col items-center mr-5'>
        <div className='relative z-10 shrink-0'>
          <Image src={photo} alt={altPhotoText} width={0} height={0} className='h-20 w-20 bg-white p-2 object-contain rounded-full shadow-md dark:shadow-zinc-700 light:shadow-zinc-400'></Image>
        </div>
        {!isLast && (
          <div className='w-0.5 grow dark:bg-zinc-700 light:bg-zinc-300'></div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
        <p className='text-sm md:text-md text-center md:text-start dark:text-zinc-400 light:text-zinc-500'>{company} • {location}</p>
        <p className='text-xl md:text-2xl text-center md:text-start font-medium'>{role}</p>
        <p className='text-sm md:text-md text-center md:text-start mb-3 dark:text-zinc-400 light:text-zinc-500'>{timeline}</p>
        <ul className='text-sm md:text-base text-center md:text-start leading-relaxed'>
          { info.map((accomplishment, idx) => <li key={idx}>{accomplishment}</li>) }
        </ul>

        <div className="flex flex-col gap-2 md:gap-2 justify-start mt-3">
          {
            Object.entries(categorizedTech).map(([categoryName, techArray]) => (
              <div key={categoryName} className="flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-3 items-center md:items-start justify-center mt-2 md:mt-3 h-[100%]">
                <p className="text-sm md:text-md flex font-semibold md:col-span-1 border-b-2 md:border-r-3 md:border-b-0 dark:border-zinc-700 light:border-zinc-300 px-2 md:px-1 py-0.5 h-[100%] w-auto md:w-[100%]">{categoryName}</p>
                <div className="flex flex-row flex-wrap gap-2 items-center justify-center md:justify-start md:col-span-3 h-[100%] w-[100%]">
                  {techArray.map((technology, idx) => (
                    <TechnologyChip key={idx} {...technology} />
                  ))}
                </div>
              </div>
            ))
          }
        </div>

      </div>
    </article>
  );
}
