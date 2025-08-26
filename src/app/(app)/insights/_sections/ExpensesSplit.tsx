"use client";

import { useEffect, useRef } from "react";
import { THEME } from "../types";
import { getChart } from "../_components/chart";

export default function ExpensesSplit({ splitPct }: { splitPct: [number, number, number] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const inst = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const Chart = await getChart();
      if (!mounted) return;
      inst.current = new Chart(ref.current!, {
        type: "doughnut",
        data: {
          labels: ["Fuel", "Food", "Stay"],
          datasets: [{ data: splitPct, backgroundColor: [THEME.ACCENT, "rgba(255,255,255,.55)", "rgba(255,255,255,.22)"], borderWidth: 0 }],
        },
        options: {
          cutout: "62%",
          plugins: {
            legend: { position: "bottom", labels: { color: THEME.WHITE, usePointStyle: true, pointStyle: "circle" } },
            tooltip: { backgroundColor: "#1F2933", borderColor: "#3B4753", borderWidth: 1 },
          },
        },
      });
    })();
    return () => { mounted = false; inst.current?.destroy?.(); };
  }, []);

  useEffect(() => {
    if (!inst.current) return;
    inst.current.data.datasets[0].data = splitPct;
    inst.current.update();
  }, [splitPct]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Expenses Split</h2>
        <div className="text-xs text-textmuted">Fuel • Food • Stay</div>
      </div>
      <canvas ref={ref} height={220} />
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Tiny label="Avg/km" value="₹5.6" />
        <Tiny label="Per Trip" value="₹3,420" />
        <Tiny label="Group Share" value="38%" />
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
