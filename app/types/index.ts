/**
 * Shared TypeScript types and interfaces
 */

// ============================================
// TOOLTIP TYPES
// ============================================

export interface TextTooltip {
  type: 'text';
  content: string;
}

export interface PowerliftingTooltip {
  type: 'powerlifting';
  intro: string;
  lifts: LiftStat[];
  recordCount: number;
  meetCount: number;
}

export type TooltipData = TextTooltip | PowerliftingTooltip;

// ============================================
// PROFILE TYPES
// ============================================

export interface ProfileImage {
  src: string;
  alt: string;
  name: string;
  tooltip: TooltipData | null;
}

// ============================================
// LIFT TYPES
// ============================================

export interface LiftStat {
  label: string;
  value: string;
}

export interface Placement {
  division: string;
  place: number;
}

// ============================================
// POWERLIFTING TYPES
// ============================================

export interface Meet {
  name: string;
  date: string;
  placements: Placement[];
  squat: number;
  bench: number;
  deadlift: number;
  total: number;
  bodyweight: number;
  dots: number;
  usaplUrl?: string;
  openPowerliftingUrl?: string;
}

export interface Record {
  type: string;
  division: string;
  weightClass: string;
  lift: string;
  weight: number;
  date: string;
}

export interface PowerliftingData {
  squat: number;
  bench: number;
  deadlift: number;
  total: number;
  bodyweight: number;
  dots: number;
  records: Record[];
  meets: Meet[];
}

// ============================================
// EXPERIENCE TYPES
// ============================================

export interface Experience {
  photo: string;
  altPhotoText: string;
  company: string;
  website?: string;
  location: string;
  role: string;
  industry: string;
  timeline: string;
  info: string[];
  tech: string[];
  display: boolean;
}

// ============================================
// TECHNOLOGY TYPES
// ============================================

export interface Technology {
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface TechnologyCategory {
  name: string;
  technologies: Technology[];
}
