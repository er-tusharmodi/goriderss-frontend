"use client";

import { useEffect, useRef } from "react";
import { THEME } from "../types";
import { getChart } from "../_components/chart";

export default function CommunityNetwork({ values }: { values: number[] }) {
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
          labels: ["Friends", "Groups", "Collab rides"],
          datasets: [{
            label: "Growth",
            data: values,
            backgroundColor: [THEME.ACCENT, "rgba(255,255,255,.28)", "rgba(255,255,255,.18)"],
            borderRadius: 8,
            barThickness: 24
          }],
        },
        options: {
          scales: {
            x: { grid: { display: false }, ticks: { color: THEME.TICK } },
            y: { grid: { color: THEME.GRID }, ticks: { color: THEME.TICK }, beginAtZero: true },
          },
          plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1F2933", borderColor: "#3B4753", borderWidth: 1 } },
        },
      });
    })();
    return () => { mounted = false; inst.current?.destroy?.(); };
  }, []);

  useEffect(() => {
    if (!inst.current) return;
    inst.current.data.datasets[0].data = values;
    inst.current.update();
  }, [values]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Community & Network</h2>
        <div className="text-xs text-textmuted">This quarter</div>
      </div>
      <canvas ref={ref} height={220} />
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Tiny label="Friends" value="+41" />
        <Tiny label="Groups" value="+3" />
        <Tiny label="Collab%" value="57%" />
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
