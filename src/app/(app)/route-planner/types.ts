export type Pace = "relaxed" | "normal" | "fast";
export type Prefer = "scenic" | "fastest" | "food";

export type Suggestion = {
  title: string;
  description?: string;
  km: number;
  timeToReach: number; // minutes
  details?: string;
  highlights?: string[];
  photo?: string;
};

export type Checkpoint = {
  title: string;
  description?: string;
  dateTime: string; // ISO
  km: number;
  timeToReach: number; // minutes
  details?: string;
  highlights: string[];
  photo?: string;
};

export type PlannerInputs = {
  from: string;
  to: string;
  start: string; // ISO
  pace: Pace;
  maxLeg: number;
  prefer: Prefer;
  avoidHighways: boolean;
  fuelEvery150: boolean;
};

export type Place = { lat: number; lng: number; highlights: string[] };
