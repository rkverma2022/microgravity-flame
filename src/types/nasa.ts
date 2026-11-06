export interface NasaExperiment {
  id: string;
  svsId?: number;
  title: string;
  acronym: string;
  projectOrSeries: 'SoFIE' | 'Saffire' | 'ACME' | 'FLEX' | 'BASS' | 'SAME' | 'DAFT' | 'Lunar/Mars';
  facility: 'ISS CIR' | 'ISS MSG' | 'Cygnus Saffire' | 'Drop Tower' | 'Lunar Surface (Future)';
  hardwareApparatus: 'CIR ACME' | 'CIR MDCA' | 'CIR SoFIE' | 'MSG Flow Duct' | 'Cygnus Flight Duct' | 'SAME Chamber';
  safetyPillar: 'Prevention' | 'Detection' | 'Suppression' | 'Partial-g Simulation';
  fuelType: string;
  fuelForm: 'Solid Polymer' | 'Solid Fabric' | 'Liquid Droplet' | 'Gaseous Burner' | 'Particulate Aerosol';
  flowRegime:
    | 'Quiescent'
    | 'Opposed Flow'
    | 'Concurrent Flow'
    | 'Ventilated / Fan-Driven'
    | 'E-Field Induced'
    | 'Inside-Out Spherical'
    | 'Weak Buoyancy Transition';
  flowVelocity: string;
  oxygenPercent: number;
  pressureKPa: number;
  gravityLevel: 'Microgravity (0g)' | 'Lunar (0.16g)' | 'Martian (0.38g)' | 'Earth (1g)' | 'E-Field Simulated';
  description: string;
  keyFinding: string;
  fireSafetyInsight: string;
  earthApplication: string;
  imagePath: string;
  imageAlt: string;
  citationUrl: string;
  releaseDate: string;
  relevanceRating: number; // 1 - 5 stars for human habitat safety
  tags: string[];
}

export interface AtmosphereEnvironment {
  id: string;
  name: string;
  category: 'Spacecraft' | 'Planetary Base' | 'EVA Suit' | 'Laboratory Test';
  oxygenPercent: number; // e.g. 34
  pressurePsi: number; // e.g. 8.2
  pressureKPa: number; // e.g. 56.5
  flammabilityIndex: number; // multiplier compared to Earth baseline (1.0)
  preBreatheTimeMinutes: number; // minutes required to purge nitrogen before EVA
  description: string;
  keyChallenge: string;
}

export interface SpaceIncident {
  mission: string;
  year: number;
  cause: string;
  atmosphere: string;
  outcome: string;
  quote?: string;
  lessonsLearned: string;
}

export interface TeamTrack {
  id: string;
  title: string;
  skills: string[];
  focusArea: string;
  deliverables: string[];
}
