"use client";

import TripCard from "./TripCard";
import type { Trip } from "../types";

export default function TripsGrid({
  items,
  imageUrl,
  onView,
  onJoin,
  onToggleSave,
}: {
  items: Trip[];
  imageUrl: string;
  onView: (id: string) => void;
  onJoin: (id: string) => void;
  onToggleSave: (id: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((t) => (
        <TripCard
          key={t.id}
          trip={t}
          imageUrl={imageUrl}
          onView={() => onView(t.id)}
          onJoin={() => onJoin(t.id)}
          onToggleSave={() => onToggleSave(t.id)}
        />
      ))}
    </div>
  );
}
