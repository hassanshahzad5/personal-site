import Image from 'next/image';
import { MdLocationPin } from 'react-icons/md';

export default function AboutMe() {
  const handleLocationClick = () => {
    window.open(
      'https://www.google.com/maps/place/Broomfield,+CO/@39.9667804,-105.145963,12z/',
      '_blank'
    )
  }

  return (
    <article className='w-[100%] flex flex-col md:flex-row justify-center md:justify-between items-center border-1 dark:border-zinc-800 light:border-zinc-200 p-6 rounded-xl dark:bg-zinc-900/50 light:bg-white/80 dark:shadow-lg dark:shadow-zinc-900/50 light:shadow-lg light:shadow-zinc-200/50 backdrop-blur-sm'>
      <section className='relative'>
        <div className='absolute inset-0 rounded-lg dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-purple-500/20 light:bg-gradient-to-br light:from-blue-200/40 light:to-purple-200/40 blur-xl'></div>
        <Image src='/profile.jpg' alt='Picture of Hassan Shahzad' width={50} height={0} className='relative rounded-lg w-50 h-auto dark:shadow-xl dark:shadow-zinc-800/50 light:shadow-xl light:shadow-zinc-300/50 ring-2 dark:ring-zinc-700/50 light:ring-zinc-200/50'></Image>  
      </section>

      <section className='flex flex-col items-center justify-center flex-1 md:ml-4 h-auto md:pl-5'>
        <h1 className='text-3xl md:text-5xl mt-3 text-center font-semibold bg-gradient-to-r dark:from-zinc-100 dark:to-zinc-400 light:from-zinc-700 light:to-zinc-900 bg-clip-text text-transparent'>Hi, I&apos;m Hassan Shahzad</h1>
        <h2 className='text-xl md:text-2xl text-center dark:text-zinc-300 light:text-zinc-600 mt-1'>Full Stack Developer, Software Engineer</h2>
        <button type="button" onClick={handleLocationClick} className='clickable flex items-center text-sm md:text-base text-center mt-2 dark:text-zinc-400 light:text-zinc-500 hover:dark:text-zinc-200 hover:light:text-zinc-700 transition-colors'>
          <MdLocationPin className='icon icon-small mr-1'></MdLocationPin>
          Broomfield, Colorado, United States
        </button>
      </section>
    </article>
  )
}
