export type Milestone = { label: string; pct: number };
export type Leader = { rank: number; name: string; km: number; rides: number; avatar: string };

export type InsightsData = {
  tripsCompleted: number;
  distanceKm: number;
  profileVisits: number;
  newFollowers: number;

  tripsCompletedSeries: number[];
  tripsUpcomingSeries: number[];
  riderHoursSeries: number[];
  communityGrowth: number[]; // [friends, groups, collab%]
  usageActions: number[]; // [Chats, Trips, Expenses, SOS, Helpers]

  avgTripLengthKm: number;
  avgDurationDays: number;
  successRatePct: number;
  expenseSplitPct: [number, number, number];

  greenScore: number;
  co2SavedKg: number;
  ecoBadgeLevel: number;

  milestones: Milestone[];
  leaderboard: Leader[];
};

export const THEME = {
  ACCENT: "#F25C2A",
  TICK: "#9CA3AF",
  GRID: "rgba(255,255,255,.08)",
  WHITE: "#ffffff",
} as const;

export const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
