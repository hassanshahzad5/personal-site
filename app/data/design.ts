import type { Project } from '../components/projectCard';

export interface ProjectCategory {
  title: string;
  description?: string;
  projects: Project[];
}

export interface ProjectWithTab extends Project {
  tab: 'professional' | 'academic' | 'personal';
}

const ATLS_PATH = '/projects/design/academic/atls-2300-text';
const PERSONAL_PATH = '/projects/design/personal';
const PROFESSIONAL_PATH = '/projects/design/professional';

export const professionalProjects: ProjectCategory[] = [
  {
    title: 'Iron Fortress',
    description: 'Event graphics and marketing materials for Iron Fortress gym',
    projects: [
      {
        id: 'if-grand-opening',
        title: 'Grand Opening Event Graphics',
        description: 'Complete event graphics package for the Iron Fortress Grand Opening competitions on January 24th, 2026. Includes a cover photo and individual posts for five events: Dips, Pull Ups, Bench Press, Squat, and Deadlift. Each graphic features consistent branding with the Iron Fortress logo, competitor listings, event timing, and motivational taglines. Ideated and executed in just 9 hours from scratch using Adobe Illustrator.',
        tags: ['Adobe Illustrator', 'Social Media Marketing'],
        pages: [
          `${PROFESSIONAL_PATH}/iron-fortress/grand-opening-poster.png`,
          `${PROFESSIONAL_PATH}/iron-fortress/heat-dips.png`,
          `${PROFESSIONAL_PATH}/iron-fortress/heat-pullups.png`,
          `${PROFESSIONAL_PATH}/iron-fortress/heat-bench.png`,
          `${PROFESSIONAL_PATH}/iron-fortress/heat-squat.png`,
          `${PROFESSIONAL_PATH}/iron-fortress/heat-deadlift.png`,
        ],
        links: [
          { label: 'View on Instagram', url: 'https://www.instagram.com/p/DTyMCiPCVie/' },
        ],
      },
    ],
  },
  {
    title: 'CU Boulder Barbell',
    description: 'Branding, social media marketing, and sponsored content for the club and Colorado Collegiate Showdown events',
    projects: [
      {
        id: 'cubb-logos',
        title: 'Brand Logos',
        description: 'Official logo system created for CU Boulder Barbell in coordination with the Brand & Messaging department at CU Boulder to remain in compliance with university guidelines. Includes primary logos, secondary marks, and text-based variations across multiple color schemes.',
        tags: ['Adobe Illustrator', 'Social Media Marketing', 'Branding', 'Logo Design'],
        padImages: true,
        pages: [
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/BBLogo-GoldBlack.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/BBLogo-BlackGold.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/BBLogo-GoldWhite.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/BBLogo-WhiteGold.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/BBLogo2-GoldBlack.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/BBLogo2-BlackGold.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/BBLogo2-GoldWhite.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/BBLogo2-WhiteGold.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/TextLogo-GoldBlack.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/TextLogo-Black.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/TextLogo-GoldWhite.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/TextLogo-White.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/TextLogo2-GoldBlack.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/TextLogo2-Black.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/TextLogo2-GoldWhite.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/TextLogo2-White.PNG`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/Buff&Barbell-Detailed-Gold.png`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/Buff&Barbell-Detailed-Black.png`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/Buff&Barbell-Detailed-White.png`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/Buff&Barbell-Flat-Gold.png`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/Buff&Barbell-Flat-Black.png`,
          `${PROFESSIONAL_PATH}/cu-boulder-barbell/Buff&Barbell-Flat-White.png`,
        ],
      },
    ],
  },
];

export const academicProjects: ProjectCategory[] = [
  {
    title: 'ATLS 2300 - Text',
    description: 'Exploring visual communication through typography and text-based design',
    projects: [
      {
        id: 'postermailer',
        title: 'Postermailer',
        description: 'Colorado Symphony Classics postermailer designed using only typography, basic shapes, and 3 spot colors. When printed, cut, and folded, the dates on the front align as a calendar view of the seven months with only show dates visible. The back accommodates detailed show descriptions within tight constraints. Printed as a physical piece.',
        tags: ['Adobe Illustrator', 'Print'],
        pages: [
          `${ATLS_PATH}/postermailer/page-1.png`,
          `${ATLS_PATH}/postermailer/back-page-1.png`,
        ],
        links: [
          { label: 'View PDF', url: `${ATLS_PATH}/postermailer/Postermailer.pdf` },
        ],
      },
      {
        id: 'type-specimen-senator',
        title: 'Type Specimen - Senator',
        description: 'Type specimen showcasing the Senator typeface, its variants, and all available features. Designed with only 2 spot colors allowed.',
        tags: ['Adobe Illustrator'],
        pages: [
          `${ATLS_PATH}/type-specimen-senator/page-1.png`,
        ],
        links: [
          { label: 'View PDF', url: `${ATLS_PATH}/type-specimen-senator/TypeSpecimen.pdf` },
        ],
      },
      {
        id: 'type-specimen-mrs-eaves',
        title: 'Type Specimen - Mrs. Eaves',
        description: 'Type specimen showcasing the Mrs. Eaves typeface, its variants, and all available features. Designed with only 2 spot colors allowed.',
        tags: ['Adobe Illustrator'],
        pages: [
          `${ATLS_PATH}/type-specimen-mrs-eaves/page-1.png`,
        ],
        links: [
          { label: 'View PDF', url: `${ATLS_PATH}/type-specimen-mrs-eaves/TypeSpecimenMrsEaves.pdf` },
        ],
      },
      {
        id: 'accordion-book',
        title: 'Accordion Book',
        description: 'Accordion book created using only 1 spot color, 2 typefaces, and basic shapes. Design inspired by the lyrics of "She Calls Me Back" by Noah Kahan. Printed and assembled as a physical accordion book.',
        tags: ['Adobe Illustrator', 'Print'],
        pages: [
          `${ATLS_PATH}/accordion-book/page-01.png`,
          `${ATLS_PATH}/accordion-book/page-02.png`,
          `${ATLS_PATH}/accordion-book/page-03.png`,
          `${ATLS_PATH}/accordion-book/page-04.png`,
          `${ATLS_PATH}/accordion-book/page-05.png`,
          `${ATLS_PATH}/accordion-book/page-06.png`,
          `${ATLS_PATH}/accordion-book/page-07.png`,
          `${ATLS_PATH}/accordion-book/page-08.png`,
          `${ATLS_PATH}/accordion-book/page-09.png`,
          `${ATLS_PATH}/accordion-book/page-10.png`,
        ],
        links: [
          { label: 'View PDF', url: `${ATLS_PATH}/accordion-book/AccordionBook.pdf` },
        ],
      },
      {
        id: 'menu-redesign',
        title: 'Menu Redesign',
        description: 'Menu redesign focused on formatting and visual hierarchy. Created in InDesign with no colors allowed.',
        tags: ['Adobe InDesign'],
        pages: [
          `${ATLS_PATH}/menu-redesign/page-1.png`,
        ],
        links: [
          { label: 'View PDF', url: `${ATLS_PATH}/menu-redesign/MenuRedesign.pdf` },
        ],
      },
      {
        id: '29-rules-of-type',
        title: '29 Rules of Type',
        description: 'Poster displaying the 29 rules for type. Created in InDesign to learn layout and hierarchy.',
        tags: ['Adobe InDesign'],
        pages: [
          `${ATLS_PATH}/29-rules-of-type/page-1.png`,
        ],
        links: [
          { label: 'View PDF', url: `${ATLS_PATH}/29-rules-of-type/29RulesOfType.pdf` },
        ],
      },
      {
        id: 'logotype',
        title: 'Logotype',
        description: 'Personal logotype featuring an H and S intertwined and contrasted. Created in Illustrator with no colors allowed.',
        tags: ['Adobe Illustrator', 'Logo Design'],
        pages: [
          `${ATLS_PATH}/logotype/page-1.png`,
        ],
        links: [
          { label: 'View PDF', url: `${ATLS_PATH}/logotype/Logotype.pdf` },
        ],
      },
    ],
  },
];

export const personalProjects: ProjectCategory[] = [
  {
    title: 'Change the Culture',
    description: 'Personal project exploring cultural change through design',
    projects: [
      {
        id: 'change-the-culture',
        title: 'How to Change the Culture',
        description: 'A self-initiated project exploring Spanish priest, theologian, scholar, chemist, and philosopher Raimon Panikkar\'s 29 ways to change culture. Created as a series of design cards visualizing each method of cultural transformation. Made using Adobe Photoshop Mix in 2020 as part of learning how to effect meaningful change in communities and organizations.',
        tags: ['Adobe Photoshop Mix - iOS'],
        pages: [
          `${PERSONAL_PATH}/change-the-culture/00-model-of-cultural-change.jpg`,
          `${PERSONAL_PATH}/change-the-culture/00-summary.jpg`,
          `${PERSONAL_PATH}/change-the-culture/01-growth.jpg`,
          `${PERSONAL_PATH}/change-the-culture/02-development.jpg`,
          `${PERSONAL_PATH}/change-the-culture/03-evolution.jpg`,
          `${PERSONAL_PATH}/change-the-culture/04-involution.jpg`,
          `${PERSONAL_PATH}/change-the-culture/05-renovation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/06-reconception.jpg`,
          `${PERSONAL_PATH}/change-the-culture/07-reform.jpg`,
          `${PERSONAL_PATH}/change-the-culture/08-innovation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/09-revivalism.jpg`,
          `${PERSONAL_PATH}/change-the-culture/10-revolution.jpg`,
          `${PERSONAL_PATH}/change-the-culture/11-mutation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/12-progress.jpg`,
          `${PERSONAL_PATH}/change-the-culture/13-diffusion.jpg`,
          `${PERSONAL_PATH}/change-the-culture/14-osmosis.jpg`,
          `${PERSONAL_PATH}/change-the-culture/15-borrowing.jpg`,
          `${PERSONAL_PATH}/change-the-culture/16-eclecticism.jpg`,
          `${PERSONAL_PATH}/change-the-culture/17-syncretism.jpg`,
          `${PERSONAL_PATH}/change-the-culture/18-modernization.jpg`,
          `${PERSONAL_PATH}/change-the-culture/19-indigenization.jpg`,
          `${PERSONAL_PATH}/change-the-culture/20-adaptation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/21-accommodation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/22-adoption.jpg`,
          `${PERSONAL_PATH}/change-the-culture/23-translation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/24-conversion.jpg`,
          `${PERSONAL_PATH}/change-the-culture/25-transformation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/26-fecundation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/27-acculturation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/28-inculturation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/29-interculturation.jpg`,
          `${PERSONAL_PATH}/change-the-culture/30-collage.jpg`,
        ],
        links: [
          { label: 'View PDF', url: `${PERSONAL_PATH}/change-the-culture/ChangeTheCulture.pdf` },
        ],
      },
    ],
  },
];

// Helper to get all projects with their tab for sitemap and metadata
export function getAllProjects(): ProjectWithTab[] {
  const projects: ProjectWithTab[] = [];
  
  for (const category of professionalProjects) {
    for (const project of category.projects) {
      projects.push({ ...project, tab: 'professional' });
    }
  }
  
  for (const category of academicProjects) {
    for (const project of category.projects) {
      projects.push({ ...project, tab: 'academic' });
    }
  }
  
  for (const category of personalProjects) {
    for (const project of category.projects) {
      projects.push({ ...project, tab: 'personal' });
    }
  }
  
  return projects;
}

// Helper to find a project by ID
export function getProjectById(id: string): ProjectWithTab | undefined {
  return getAllProjects().find(p => p.id === id);
}
