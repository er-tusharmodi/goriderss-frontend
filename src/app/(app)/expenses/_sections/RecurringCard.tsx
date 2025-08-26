import { Recurring } from "./types";

export default function RecurringCard({
  items,
  onAdd,
  onRemove,
}: {
  items: Recurring[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
      <div className="font-semibold">Recurring</div>
      <div className="space-y-2 text-sm text-textmuted">
        {items.length === 0 && <div className="text-xs">No recurring items.</div>}
        {items.map((r) => (
          <div key={r.id} className="border border-border rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-white">{r.title}</div>
              <button onClick={() => onRemove(r.id)} className="text-xs underline">Remove</button>
            </div>
            <div className="text-xs text-textmuted">{r.type} • {r.category} • {r.cycle}</div>
            <div className="text-xs text-textmuted mt-1">Next: {r.next} • ₹{r.amount} • {r.payment}</div>
          </div>
        ))}
      </div>
      <button onClick={onAdd} className="btn btn-ghost mt-2">+ Add Recurring</button>
    </div>
  );
}
