export type Trip = {
  id: string;
  title: string;
  city: string;
  state: string;
  start: string; // ISO yyyy-mm-dd
  end: string;   // ISO
  days: number;
  km: number;
  members: number;
  max: number;
  budget: number;
  diff: "Easy" | "Moderate" | "Hard";
  type: "ADV" | "Roadster" | "Cruiser";
  host: string;
  saved: boolean;
};

export type SortKey = "soon" | "popular" | "distance" | "budget";

export type Filters = {
  q: string;
  sort: SortKey;
  loc: string;
  from: string;
  to: string;
  budget: number | null;
  maxKm: number | null;
  diffs: Trip["diff"][];
  types: Trip["type"][];
};
