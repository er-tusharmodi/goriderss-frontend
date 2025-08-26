import React from "react";
import { Expense, ExpenseType } from "./types";

function uid() { return "x" + Math.random().toString(36).slice(2, 9); }

export default function ExpenseModal({
  open,
  onClose,
  initial,
  defaultType,
  members,
  onSave,
  onDelete,
  focusSplitOnOpen,
  accent = "#F25C2A",
}: {
  open: boolean;
  onClose: () => void;
  initial?: Expense;
  defaultType: ExpenseType;
  members: string[];
  onSave: (e: Expense) => void;
  onDelete: (id: string) => void;
  focusSplitOnOpen?: boolean;
  accent?: string;
}) {
  const [form, setForm] = React.useState<Expense>(() => ({
    id: uid(),
    type: defaultType,
    category: "Fuel",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    payment: "UPI",
    tag: "",
    notes: "",
    settled: false,
  }));
  const splitRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setForm(
      initial ?? {
        id: uid(),
        type: defaultType,
        category: "Fuel",
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        payment: "UPI",
        tag: "",
        notes: "",
        settled: false,
      }
    );
  }, [open, initial, defaultType]);

  React.useEffect(() => {
    if (open && focusSplitOnOpen && form.type === "trip" && splitRef.current) {
      splitRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      splitRef.current.style.boxShadow = `0 0 0 3px ${accent}55`;
      const el = splitRef.current;
      const t = setTimeout(() => { el.style.boxShadow = "none"; }, 800);
      return () => clearTimeout(t);
    }
  }, [open, focusSplitOnOpen, form.type, accent]);

  const showSplit = form.type === "trip";
  const split = React.useMemo<Record<string, number>>(
    () => (initial?.split ? { ...initial.split } : {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initial?.id]
  );
  const [splitState, setSplitState] = React.useState<Record<string, number>>(split);

  React.useEffect(() => {
    setSplitState(split);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id, form.type]);

  function save() {
    const data: Expense = {
      ...form,
      split: showSplit && Object.values(splitState).some((v) => (Number(v) || 0) > 0) ? splitState : undefined,
    };
    onSave(data);
  }

  function splitEqual() {
    const share = Math.round((Number(form.amount) || 0) / Math.max(1, members.length));
    const next: Record<string, number> = {};
    members.forEach((m) => (next[m] = share));
    setSplitState(next);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50">
      <div className="mx-auto mt-10 max-w-2xl bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="font-semibold">{initial ? "Edit Expense" : "Add Expense"}</div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">✕</button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="label block">
              <span className="text-textmuted">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ExpenseType }))}
                className="field mt-1"
              >
                <option className="bg-slatebg" value="personal">Personal</option>
                <option className="bg-slatebg" value="trip">This Trip</option>
                <option className="bg-slatebg" value="bike">Bike Life</option>
              </select>
            </label>
            <label className="label block">
              <span className="text-textmuted">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="field mt-1"
              >
                {["Fuel","Food","Stay","Toll","Repair","Gear","Insurance","Service","Misc"].map((c)=>(
                  <option key={c} className="bg-slatebg" value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="label block">
              <span className="text-textmuted">Amount (₹)</span>
              <input
                type="number"
                className="field mt-1"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) || 0 }))}
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <label className="label block">
              <span className="text-textmuted">Date</span>
              <input
                type="date"
                className="field mt-1"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </label>
            <label className="label block">
              <span className="text-textmuted">Payment</span>
              <select
                value={form.payment}
                onChange={(e) => setForm((f) => ({ ...f, payment: e.target.value }))}
                className="field mt-1"
              >
                {["UPI","Cash","Card"].map((p)=><option key={p} className="bg-slatebg" value={p}>{p}</option>)}
              </select>
            </label>
            <label className="label block">
              <span className="text-textmuted">Tag</span>
              <input
                className="field mt-1"
                placeholder="e.g. Day 1 / Gear / Hotel"
                value={form.tag || ""}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              />
            </label>
          </div>

          <label className="label block">
            <span className="text-textmuted">Notes</span>
            <textarea
              rows={2}
              className="field mt-1"
              placeholder="Short note"
              value={form.notes || ""}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </label>

          {/* Split for Trip */}
          {form.type === "trip" && (
            <div ref={splitRef} className="border border-border rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Split Among Members</div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={!!form.settled}
                    onChange={(e) => setForm((f) => ({ ...f, settled: e.target.checked }))}
                  />
                  <span className="text-textmuted">Mark settled</span>
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                {members.map((name) => (
                  <label key={name} className="label block">
                    <span className="text-textmuted">{name}</span>
                    <input
                      className="field mt-1"
                      placeholder="₹ amount"
                      value={splitState[name] ?? ""}
                      onChange={(e) =>
                        setSplitState((s) => ({ ...s, [name]: Number(e.target.value) || 0 }))
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={splitEqual} className="btn btn-ghost">Split Equal</button>
                <button onClick={() => setSplitState({})} className="btn btn-ghost">Clear</button>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center justify-end gap-2">
          {initial && (
            <button onClick={() => onDelete(initial.id)} className="btn btn-ghost">Delete</button>
          )}
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button
            onClick={save}
            className="btn btn-primary"
            style={{ background: accent, color: "#fff" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
