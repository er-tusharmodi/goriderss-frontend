import type { Metadata } from "next";
import InsightsClient from "./InsightsClient";
import type { InsightsData } from "./types";

export const metadata: Metadata = {
  title: "GoRiderss — Insights",
  description: "Analytics for your riding activity",
};

export default async function Page() {
  // TODO: Replace with real API (JWT -> userId)
  const initial: InsightsData = {
    tripsCompleted: 26,
    distanceKm: 8450,
    profileVisits: 3182,
    newFollowers: 124,

    tripsCompletedSeries: [3, 4, 5, 3, 6, 5],
    tripsUpcomingSeries: [2, 1, 1, 2, 1, 2],
    riderHoursSeries: [12, 16, 14, 18, 20, 17],
    communityGrowth: [41, 3, 57],
    usageActions: [72, 48, 33, 3, 11],

    avgTripLengthKm: 325,
    avgDurationDays: 1.8,
    successRatePct: 92,
    expenseSplitPct: [55, 22, 23],

    greenScore: 78,
    co2SavedKg: 46,
    ecoBadgeLevel: 3,

    milestones: [
      { label: "Longest Ride: 612 km", pct: 100 },
      { label: "States Covered: 7/10", pct: 70 },
      { label: "Badges Earned: 12/20", pct: 60 },
    ],
    leaderboard: [
      { rank: 1, name: "Anushka", km: 1120, rides: 4, avatar: "https://i.pravatar.cc/32?img=8" },
      { rank: 2, name: "Karan", km: 980, rides: 3, avatar: "https://i.pravatar.cc/32?img=12" },
      { rank: 3, name: "Tusharthi (You)", km: 845, rides: 2, avatar: "https://i.pravatar.cc/32?img=5" },
    ],
  };

  return (
    <main className="bg-slatebg text-white min-h-screen">
      <div className="px-4 sm:px-6 py-6">
        <InsightsClient initial={initial} />
      </div>
    </main>
  );
}
