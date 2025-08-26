"use client";

export default function HeaderBar({
  range,
  onRangeChange,
  onExport,
}: {
  range: 30 | 90 | 365;
  onRangeChange: (r: 30 | 90 | 365) => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">Insights</h1>
      <div className="flex items-center gap-2">
        <select
          value={range}
          onChange={(e) => onRangeChange(Number(e.target.value) as 30 | 90 | 365)}
          className="w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35"
        >
          <option className="bg-slatebg" value={30}>Last 30 days</option>
          <option className="bg-slatebg" value={90}>Last 90 days</option>
          <option className="bg-slatebg" value={365}>Last year</option>
        </select>
        <button
          onClick={onExport}
          className="rounded-2xl px-4 py-2 bg-white/5 hover:bg-white/10 border border-border text-sm"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
