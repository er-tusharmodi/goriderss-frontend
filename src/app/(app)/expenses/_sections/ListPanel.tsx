import { Budgets, Expense, Recurring } from "./types";
import { CatIcon } from "./Icons";
import BudgetsCard from "./BudgetsCard";
import RecurringCard from "./RecurringCard";

function sum(arr: Expense[]) {
  return Math.round(arr.reduce((a, c) => a + (Number(c.amount) || 0), 0));
}
function nowYM() { return new Date().toISOString().slice(0,7); }

export default function ListPanel({
  items,
  fullCount,
  onEdit,
  onEditSplit,
  onDelete,
  onSettle,
  budgets,
  onSaveBudgets,
  recurring,
  onAddRecurring,
  onRemoveRecurring,
  accent,
}: {
  items: Expense[];
  fullCount: number;
  onEdit: (id: string) => void;
  onEditSplit: (id: string) => void;
  onDelete: (id: string) => void;
  onSettle: (id: string) => void;
  budgets: Budgets;
  onSaveBudgets: (b: Budgets) => void;
  recurring: Recurring[];
  onAddRecurring: () => void;
  onRemoveRecurring: (id: string) => void;
  accent: string;
}) {
  const totals = {
    personal: sum(items.filter(e => e.type === "personal" && e.date.slice(0,7) === nowYM())),
    trip: sum(items.filter(e => e.type === "trip")),
    bike: sum(items.filter(e => e.type === "bike" && e.date.slice(0,7) === nowYM())),
  };

  return (
    <div className="mt-4 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-4">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="font-semibold">Expenses</div>
          <div className="text-xs text-textmuted">{fullCount} item{fullCount !== 1 ? "s" : ""}</div>
        </div>
        <div id="rows" className="divide-y divide-white/10 divide-y-[0.5px] max-h-[60vh] overflow-y-auto no-scrollbar">
          {items.length === 0 ? (
            <div className="p-6 text-sm text-textmuted">No expenses found.</div>
          ) : (
            items.map((e) => (
              <div key={e.id} className="row px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="shrink-0"><CatIcon cat={e.category} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{e.category}</div>
                      {e.tag && <span className="chip">{e.tag}</span>}
                      {e.type === "trip" && e.split && <span className="chip">Split</span>}
                      {!e.settled && <span className="chip">Unsettled</span>}
                    </div>
                    <div className="text-xs text-textmuted truncate">{e.notes || "-"}</div>
                    <div className="text-[11px] text-textmuted mt-0.5">{e.payment} • {e.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="amount-badge">₹{Number(e.amount).toLocaleString()}</div>
                    <div className="mt-1 flex items-center gap-2 justify-end">
                      {e.type === "trip" && (
                        <button onClick={() => onEditSplit(e.id)} className="text-xs underline">View Split</button>
                      )}
                      <button onClick={() => onEdit(e.id)} className="text-xs underline">Edit</button>
                      <button onClick={() => onDelete(e.id)} className="text-xs underline text-red-300">Delete</button>
                      {!e.settled && (
                        <button onClick={() => onSettle(e.id)} className="text-xs underline text-green-300">Mark Settled</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <BudgetsCard budgets={budgets} totals={totals} onSave={onSaveBudgets} accent={accent} />
        <RecurringCard items={recurring} onAdd={onAddRecurring} onRemove={onRemoveRecurring} />
      </aside>
    </div>
  );
}
