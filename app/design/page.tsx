'use client';

import { useEffect, useState } from 'react';

export default function Design() {
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
          Design
        </h2>

        {/* Coming Soon Content */}
        <div className='w-full flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-lg dark:text-neutral-300 light:text-neutral-700 mb-2'>
            Coming Soon
          </p>
          <p className='text-sm dark:text-neutral-500 light:text-neutral-500 max-w-sm'>
            Currently curating design work from my Creative Technology & Design minor. Check back soon.
          </p>
        </div>
      </div>
    </section>
  );
}
