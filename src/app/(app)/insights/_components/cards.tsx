import { PropsWithChildren } from "react";

export function StatCard({
  title,
  value,
  delta,
  children,
}: PropsWithChildren<{ title: string; value: React.ReactNode; delta: string }>) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-textmuted text-sm">{title}</div>
        <div className="h-5 w-5 text-white/80">{children}</div>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-green-400">{delta}</div>
    </div>
  );
}

export function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-xl px-3 py-2">
      <div className="text-textmuted">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
