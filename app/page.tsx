'use client';

import Experience from './experience/page'
import AboutMe from './components/about'


export default function Home() {
  return (
    <section className='custom-section'>
      <AboutMe />
      <Experience />
    </section>
  )
}
