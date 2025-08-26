"use client";

import { useMemo, useState } from "react";
import type { InsightsData } from "./types";
import { MONTHS } from "./types";
import {
  HeaderBar,
  QuickStats,
  TripsAnalytics,
  ExpensesSplit,
  RiderPerformance,
  CommunityNetwork,
  GreenScore,
  Milestones,
  Leaderboard,
  AppUsage,
} from "./_sections";

export default function InsightsClient({ initial }: { initial: InsightsData }) {
  const [range, setRange] = useState<30 | 90 | 365>(90);

  const scaled = useMemo(() => {
    const mod = range === 30 ? 0.8 : range === 365 ? 1.2 : 1;
    return {
      ...initial,
      tripsCompletedSeries: initial.tripsCompletedSeries.map((v) => Math.round(v * mod)),
      tripsUpcomingSeries: initial.tripsUpcomingSeries.map((v) => Math.round(v * mod)),
    };
  }, [initial, range]);

  function exportCSV() {
    const rows: (string | number)[][] = [
      ["Trips Completed", initial.tripsCompleted],
      ["Distance (km)", initial.distanceKm],
      ["Profile Visits", initial.profileVisits],
      ["New Followers", initial.newFollowers],
      ["Avg Trip Length (km)", initial.avgTripLengthKm],
      ["Avg Duration (days)", initial.avgDurationDays],
      ["Success Rate (%)", initial.successRatePct],
      ["Expense Fuel (%)", initial.expenseSplitPct[0]],
      ["Expense Food (%)", initial.expenseSplitPct[1]],
      ["Expense Stay (%)", initial.expenseSplitPct[2]],
      ["Green Score", initial.greenScore],
      ["CO2 Saved (kg)", initial.co2SavedKg],
      ["Eco Badge Level", initial.ecoBadgeLevel],
    ];
    initial.leaderboard.forEach((r) => rows.push([`Leaderboard Rank ${r.rank} (${r.name}) km`, r.km]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "goriderss_insights.csv"; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <HeaderBar range={range} onRangeChange={setRange} onExport={exportCSV} />

      <QuickStats
        tripsCompleted={initial.tripsCompleted}
        distanceKm={initial.distanceKm}
        profileVisits={initial.profileVisits}
        newFollowers={initial.newFollowers}
      />

      <section className="grid lg:grid-cols-3 gap-4">
        <TripsAnalytics
          labels={MONTHS}
          completed={scaled.tripsCompletedSeries}
          upcoming={scaled.tripsUpcomingSeries}
          avgTripLengthKm={initial.avgTripLengthKm}
          avgDurationDays={initial.avgDurationDays}
          successRatePct={initial.successRatePct}
        />
        <ExpensesSplit splitPct={initial.expenseSplitPct} />
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <RiderPerformance labels={MONTHS} series={initial.riderHoursSeries} />
        <CommunityNetwork values={initial.communityGrowth} />
        <GreenScore score={initial.greenScore} co2={initial.co2SavedKg} badgeLevel={initial.ecoBadgeLevel} />
      </section>

      <section className="grid xl:grid-cols-3 gap-4">
        <Milestones items={initial.milestones} />
        <Leaderboard rows={initial.leaderboard} />
        <AppUsage labels={["Chats", "Trips", "Expenses", "SOS", "Helpers"]} series={initial.usageActions} />
      </section>
    </div>
  );
}
