"use client";

export default function StatCards({
  km,
  minutes,
  stops,
}: {
  km: number;
  minutes: number;
  stops: number;
}) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return (
    <div className="grid grid-cols-3 gap-2">
      <Card label="Total Distance" value={`${km.toLocaleString()} km`} />
      <Card label="Ride Time (est)" value={`${h}h ${m}m`} />
      <Card label="Stops" value={String(stops)} />
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-border rounded-xl px-3 py-2 text-center">
      <div className="text-xs text-textmuted">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
