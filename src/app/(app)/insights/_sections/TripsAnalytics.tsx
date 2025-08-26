"use client";

import { useEffect, useRef } from "react";
import { THEME } from "../types";
import { MiniCard } from "../_components/cards";
import { getChart } from "../_components/chart";

export default function TripsAnalytics({
  labels,
  completed,
  upcoming,
  avgTripLengthKm,
  avgDurationDays,
  successRatePct,
}: {
  labels: string[];
  completed: number[];
  upcoming: number[];
  avgTripLengthKm: number;
  avgDurationDays: number;
  successRatePct: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const inst = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const Chart = await getChart();
      if (!mounted) return;
      inst.current = new Chart(ref.current!, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "Completed", data: completed, backgroundColor: THEME.ACCENT, borderRadius: 6, barThickness: 18 },
            { label: "Upcoming", data: upcoming, backgroundColor: "rgba(255,255,255,.18)", borderRadius: 6, barThickness: 18 },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { grid: { display: false }, ticks: { color: THEME.TICK } },
            y: { grid: { color: THEME.GRID }, ticks: { color: THEME.TICK, precision: 0 }, suggestedMax: 8, beginAtZero: true },
          },
          plugins: {
            legend: { labels: { color: THEME.WHITE, usePointStyle: true, pointStyle: "circle" } },
            tooltip: { backgroundColor: "#1F2933", borderColor: "#3B4753", borderWidth: 1 },
          },
        },
      });
    })();
    return () => { mounted = false; inst.current?.destroy?.(); };
  }, []);

  useEffect(() => {
    if (!inst.current) return;
    inst.current.data.datasets[0].data = completed;
    inst.current.data.datasets[1].data = upcoming;
    inst.current.update();
  }, [completed, upcoming]);

  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Trips Analytics</h2>
        <div className="text-xs text-textmuted">Upcoming vs Completed</div>
      </div>
      <canvas ref={ref} height={220} />
      <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
        <MiniCard label="Avg Trip Length" value={`${avgTripLengthKm} km`} />
        <MiniCard label="Avg Duration" value={`${avgDurationDays} days`} />
        <MiniCard label="Success Rate" value={`${successRatePct}%`} />
      </div>
    </div>
  );
}
