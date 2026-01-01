'use client';

import { useEffect, useState } from 'react';

export default function Projects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className='custom-section'>
      {/* Card with Header and Content */}
      <div className={`w-full flex flex-col justify-center sm:justify-between items-center card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Section Header */}
        <h2 className='text-xl sm:text-2xl font-semibold dark:text-neutral-100 light:text-neutral-900 mb-3'>
          Projects
        </h2>

        {/* Coming Soon Content */}
        <div className='w-full flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-lg dark:text-neutral-300 light:text-neutral-700 mb-2'>
            Coming Soon
          </p>
          <p className='text-sm dark:text-neutral-500 light:text-neutral-500 max-w-sm'>
            Currently curating projects to showcase. Check back soon or visit my{' '}
            <a 
              href='https://github.com/hassanshahzad5' 
              target='_blank' 
              rel='noopener noreferrer'
              className='underline underline-offset-2 hover:dark:text-neutral-300 hover:light:text-neutral-700 transition-colors'
            >
              GitHub
            </a>
            {' '}in the meantime.
          </p>
        </div>
      </div>
    </section>
  );
}
