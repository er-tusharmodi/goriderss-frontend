"use client";

import { useEffect, useRef } from "react";
import { THEME } from "../types";
import { MiniCard } from "../_components/cards";
import { getChart } from "../_components/chart";

export default function RiderPerformance({
  labels,
  series,
}: {
  labels: string[];
  series: number[];
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const inst = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const Chart = await getChart();
      if (!mounted) return;
      inst.current = new Chart(ref.current!, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Hours",
            data: series,
            borderColor: THEME.ACCENT,
            backgroundColor: "rgba(242,92,42,.18)",
            fill: true,
            tension: .35,
            pointRadius: 0,
          }],
        },
        options: {
          scales: {
            x: { grid: { display: false }, ticks: { color: THEME.TICK } },
            y: { grid: { color: THEME.GRID }, ticks: { color: THEME.TICK }, beginAtZero: true, suggestedMax: 24 },
          },
          plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1F2933", borderColor: "#3B4753", borderWidth: 1 } },
        },
      });
    })();
    return () => { mounted = false; inst.current?.destroy?.(); };
  }, []);

  useEffect(() => {
    if (!inst.current) return;
    inst.current.data.datasets[0].data = series;
    inst.current.update();
  }, [series]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Rider Performance</h2>
        <div className="text-xs text-textmuted">Hours / Month</div>
      </div>
      <canvas ref={ref} height={220} />
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <MiniCard label="Avg Speed" value="62 km/h" />
        <MiniCard label="Stamina Score" value="84/100" />
      </div>
    </div>
  );
}
