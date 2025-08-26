export default function SummarySticky({
  totals,
}: {
  totals: { total: number; thisMonth: number; trip: number; bike: number; due: number };
}) {
  const Stat = ({ label, value }: { label: string; value: number }) => (
    <div className="stat">
      <div className="text-xs text-textmuted">{label}</div>
      <div className="stat-num mono">₹{value.toLocaleString()}</div>
    </div>
  );
  return (
    <div className="sticky top-0 z-20 bg-slatebg/85 backdrop-blur border-b border-border">
      <div className="px-1 py-3 grid sm:grid-cols-5 gap-2">
        <Stat label="Total Spent" value={totals.total} />
        <Stat label="This Month" value={totals.thisMonth} />
        <Stat label="Trip Spent" value={totals.trip} />
        <Stat label="Bike-Life Spent" value={totals.bike} />
        <Stat label="Outstanding" value={totals.due} />
      </div>
    </div>
  );
}
