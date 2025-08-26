"use client";

import { StatCard } from "../_components/cards";
import { IconEye, IconTrips, IconUsers, IconTick } from "../_components/icons";

export default function QuickStats({
  tripsCompleted,
  distanceKm,
  profileVisits,
  newFollowers,
}: {
  tripsCompleted: number;
  distanceKm: number;
  profileVisits: number;
  newFollowers: number;
}) {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Trips Completed" value={tripsCompleted} delta="+12% vs prev.">
        <IconTrips />
      </StatCard>

      <StatCard
        title="Distance Covered"
        value={<><span>{fmt(distanceKm)}</span><span className="text-base font-semibold ml-1">km</span></>}
        delta="+540 km this month"
      >
        <IconTick className="h-5 w-5 text-white/80" />
      </StatCard>

      <StatCard title="Profile Visits" value={fmt(profileVisits)} delta="+21% new viewers">
        <IconEye />
      </StatCard>

      <StatCard title="New Followers" value={newFollowers} delta="+9 in last 7d">
        <IconUsers />
      </StatCard>
    </section>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}
