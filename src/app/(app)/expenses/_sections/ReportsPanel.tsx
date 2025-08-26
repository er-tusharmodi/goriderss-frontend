import { Expense } from "./types";

function sum(arr: Expense[]) { return Math.round(arr.reduce((a,c)=>a+(Number(c.amount)||0),0)); }
function groupSum(arr: Expense[], key: keyof Expense) {
  return arr.reduce<Record<string, number>>((acc, e) => {
    const k = String(e[key] ?? "—");
    acc[k] = (acc[k] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {});
}

export default function ReportsPanel({ expenses, accent = "#F25C2A" }: { expenses: Expense[]; accent?: string }) {
  const total = sum(expenses) || 1;
  const cats = Object.entries(groupSum(expenses, "category")).sort((a,b)=>b[1]-a[1]);
  const pays = Object.entries(groupSum(expenses, "payment")).sort((a,b)=>b[1]-a[1]);
  const settled = sum(expenses.filter(e=>e.settled));
  const unsettled = sum(expenses.filter(e=>!e.settled));

  const Bar = ({ label, val }: { label: string; val: number }) => {
    const pct = Math.min(100, Math.round((val / total) * 100));
    return (
      <div>
        <div className="flex items-center justify-between text-sm">
          <span>{label}</span>
          <span className="mono">₹{val.toLocaleString()}</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-1">
          <div className="h-full" style={{ width: `${pct}%`, background: accent }} />
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 grid lg:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="font-semibold mb-2">By Category</div>
        <div className="space-y-2">
          {cats.length ? cats.map(([k,v]) => <Bar key={k} label={k} val={v} />) : <div className="text-xs text-textmuted">No data</div>}
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="font-semibold mb-2">By Payment</div>
        <div className="space-y-2">
          {pays.length ? pays.map(([k,v]) => <Bar key={k} label={k} val={v} />) : <div className="text-xs text-textmuted">No data</div>}
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="font-semibold mb-2">Settlement</div>
        <div className="space-y-2">
          <Bar label="Settled" val={settled} />
          <Bar label="Unsettled" val={unsettled} />
        </div>
      </div>
    </div>
  );
}
