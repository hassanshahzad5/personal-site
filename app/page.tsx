'use client';

import ExperienceSection from './components/experience'
import AboutMe from './components/about'


export default function Home() {
  return (
    <section className='custom-section'>
      <AboutMe />
      <ExperienceSection />
    </section>
  )
}
