// Powerlifting data from OpenPowerlifting & USAPL Lifting Database
// https://www.openpowerlifting.org/u/hassanshahzad
// https://usapl.liftingdatabase.com/lifters-view?id=135980

export type Placement = {
  division: string;
  place: number;
};

export type Meet = {
  name: string;
  date: string;
  placements: Placement[];
  bodyweight: number;
  squat: number;
  bench: number;
  deadlift: number;
  total: number;
  dots: number;
  openPowerliftingUrl?: string;
  usaplUrl?: string;
};

export type Record = {
  type: string;
  division: string;
  weightClass: string;
  lift: string;
  weight: number;
  date: string;
};

export type PowerliftingData = {
  squat: number;
  bench: number;
  deadlift: number;
  total: number;
  dots: number;
  bodyweight: number;
  meets: Meet[];
  records: Record[];
};

export const powerliftingData: PowerliftingData = {
  // Personal bests (in kg)
  squat: 305,
  bench: 147.5,
  deadlift: 287.5,
  total: 740,
  dots: 408.29,
  bodyweight: 136.7,
  
  // Colorado State Raw Records
  records: [
    { type: 'Colorado State', division: 'Raw Open', weightClass: '-140kg', lift: 'Squat', weight: 305, date: '2025-09-06' },
    { type: 'Colorado State', division: 'Raw Junior', weightClass: '-140kg', lift: 'Squat', weight: 305, date: '2025-09-06' },
    { type: 'Colorado State', division: 'Raw Junior', weightClass: '-140kg', lift: 'Deadlift', weight: 287.5, date: '2025-09-06' },
    { type: 'Colorado State', division: 'Raw Junior', weightClass: '-140kg', lift: 'Deadlift (Single)', weight: 287.5, date: '2025-09-06' },
  ],
  
  // Competition history (newest first)
  meets: [
    { 
      name: 'West Regionals', 
      date: '2025-09-06', 
      placements: [
        { division: 'Raw Junior', place: 1 },
        { division: 'Raw Open', place: 3 },
      ],
      bodyweight: 136.7, 
      squat: 305, 
      bench: 147.5, 
      deadlift: 287.5, 
      total: 740, 
      dots: 408.29,
      usaplUrl: 'https://usapl.liftingdatabase.com/competitions-view?id=121962',
    },
    { 
      name: 'Terror on the Platform', 
      date: '2024-11-02', 
      placements: [
        { division: 'Raw Junior', place: 2 },
        { division: 'Raw Open', place: 2 },
      ],
      bodyweight: 136.35, 
      squat: 285, 
      bench: 137.5, 
      deadlift: 265, 
      total: 687.5, 
      dots: 379.60,
      usaplUrl: 'https://usapl.liftingdatabase.com/competitions-view?id=121498',
    },
    { 
      name: 'Colorado Collegiate Qualifier', 
      date: '2024-02-04', 
      placements: [
        { division: 'Raw Collegiate', place: 1 },
      ],
      bodyweight: 138.05, 
      squat: 265, 
      bench: 142.5, 
      deadlift: 255, 
      total: 662.5, 
      dots: 364.50,
      usaplUrl: 'https://usapl.liftingdatabase.com/competitions-view?id=121043',
    },
    { 
      name: 'Colorado State Championships', 
      date: '2023-02-11', 
      placements: [
        { division: 'Raw Junior', place: 2 },
      ],
      bodyweight: 130.8, 
      squat: 245, 
      bench: 125, 
      deadlift: 220, 
      total: 590, 
      dots: 329.76,
      usaplUrl: 'https://usapl.liftingdatabase.com/competitions-view?id=120422',
    },
    { 
      name: 'Nightmare Before Liftmass II', 
      date: '2022-10-01', 
      placements: [
        { division: 'Raw Junior', place: 1 },
      ],
      bodyweight: 126.1, 
      squat: 222.5, 
      bench: 115, 
      deadlift: 222.5, 
      total: 560, 
      dots: 316.51,
      usaplUrl: 'https://usapl.liftingdatabase.com/competitions-view?id=120232',
    },
  ],
};
