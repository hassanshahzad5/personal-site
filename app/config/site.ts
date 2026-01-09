export enum WorkStatus {
  Open = 'open',
  Selective = 'selective',
  Focused = 'focused',
  Entrepreneurial = 'entrepreneurial',
}

export interface StatusDisplay {
  color: string;
  text: string;
  pulse: boolean;
}

const statusDisplayMap: Record<WorkStatus, StatusDisplay> = {
  [WorkStatus.Open]: {
    color: 'bg-emerald-500 dark:bg-emerald-400',
    text: 'Open to Work',
    pulse: true,
  },
  [WorkStatus.Selective]: {
    color: 'bg-amber-500 dark:bg-amber-400',
    text: 'Open to Remote, Full-Time Roles',
    pulse: true,
  },
  [WorkStatus.Focused]: {
    color: 'bg-red-500 dark:bg-red-400',
    text: 'Focused on Current Role',
    pulse: false,
  },
  [WorkStatus.Entrepreneurial]: {
    color: 'bg-blue-500 dark:bg-blue-400',
    text: 'Building Something New',
    pulse: true,
  },
};

export const currentWorkStatus: WorkStatus = WorkStatus.Selective;

export function getWorkStatusDisplay(): StatusDisplay {
  return statusDisplayMap[currentWorkStatus];
}

export interface SocialLinks {
  email: string;
  linkedin: string;
  github: string;
  openpowerlifting: string;
  usapl: string;
  ironFortressInstagram: string;
  ironFortressStore: string;
}

export const socialLinks: SocialLinks = {
  email: 'hassanshahzad2002sm@gmail.com',
  linkedin: 'https://www.linkedin.com/in/thehassanshahzad/',
  github: 'https://www.github.com/hassanshahzad5/',
  openpowerlifting: 'https://www.openpowerlifting.org/u/hassanshahzad',
  usapl: 'https://usapl.liftingdatabase.com/lifters-view?id=135980',
  ironFortressInstagram: 'https://www.instagram.com/ironfortressfit_/',
  ironFortressStore: 'https://ironfortressco.com/',
};

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  tagline: string;
}

export const personalInfo: PersonalInfo = {
  name: 'Hassan Shahzad',
  title: 'Full Stack Developer',
  location: 'Broomfield, CO',
  tagline: 'Change the Culture',
};
