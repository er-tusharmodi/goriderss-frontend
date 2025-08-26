"use client";

import { useEffect, useRef } from "react";
import { THEME } from "../types";
import { getChart } from "../_components/chart";

export default function AppUsage({
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
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Actions",
              data: series,
              backgroundColor: THEME.ACCENT,
              borderRadius: 8,
              barThickness: 22,
            },
          ],
        },
        options: {
          scales: {
            x: { grid: { display: false }, ticks: { color: THEME.TICK } },
            y: {
              grid: { color: THEME.GRID },
              ticks: { color: THEME.TICK },
              beginAtZero: true,
              suggestedMax: 80,
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#1F2933",
              borderColor: "#3B4753",
              borderWidth: 1,
            },
          },
        },
      });
    })();
    return () => {
      mounted = false;
      inst.current?.destroy?.();
    };
  }, []);

  useEffect(() => {
    if (!inst.current) return;
    inst.current.data.datasets[0].data = series;
    inst.current.update();
  }, [series]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">App Usage Insights</h2>
        <span className="text-xs text-textmuted">Feature activity</span>
      </div>
      <canvas ref={ref} height={220} />
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Tiny label="Active Hours" value="7–10 AM" />
        <Tiny label="Response Rate" value="82%" />
        <Tiny label="SOS Checks" value="OK" />
      </div>
    </div>
  );
}

function Tiny({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg px-2.5 py-1.5 text-center">
      <div className="text-textmuted">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
