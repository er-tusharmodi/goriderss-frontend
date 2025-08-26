"use client";

import { useMemo, useRef, useState } from "react";
import TitleBar from "./_sections/TitleBar";
import SummarySticky from "./_sections/SummarySticky";
import TabsFilters from "./_sections/TabsFilters";
import ListPanel from "./_sections/ListPanel";
import ReportsPanel from "./_sections/ReportsPanel";
import ExpenseModal from "./_sections/ExpenseModal";
import { Budgets, Expense, Recurring, Tab, Filters } from "./_sections/types";

const ACCENT = "#F25C2A";
const MEMBERS = ["You", "Anushka", "Karan", "Rajesh"] as const;

const initialExpenses: Expense[] = [
  // personal
  { id: "e1", type: "personal", category: "Gear", amount: 2200, date: "2025-08-08", payment: "Card", tag: "Gloves", notes: "Rynox", settled: true },
  { id: "e2", type: "personal", category: "Misc", amount: 350, date: "2025-08-05", payment: "UPI", tag: "Chain lube", notes: "", settled: true },
  // trip
  { id: "e3", type: "trip", category: "Fuel", amount: 800, date: "2025-08-10", payment: "UPI", tag: "Day 1", notes: "Jaipur → Kishangarh", split: { You: 200, Anushka: 200, Karan: 200, Rajesh: 200 }, settled: false },
  { id: "e4", type: "trip", category: "Food", amount: 560, date: "2025-08-10", payment: "Cash", tag: "Lunch", notes: "Ajmer dhaba", split: { You: 140, Anushka: 140, Karan: 140, Rajesh: 140 }, settled: true },
  // bike life
  { id: "e5", type: "bike", category: "Service", amount: 1800, date: "2025-07-30", payment: "UPI", tag: "10k service", notes: "Oil + filter", settled: true },
  { id: "e6", type: "bike", category: "Insurance", amount: 2100, date: "2025-07-01", payment: "Card", tag: "Annual", notes: "OD+TP", settled: true },
];

const initialRecurring: Recurring[] = [
  { id: "r1", title: "Insurance", type: "bike", category: "Insurance", cycle: "Yearly", next: "2026-07-01", amount: 2100, payment: "Card" },
  { id: "r2", title: "Chain Lube", type: "personal", category: "Service", cycle: "Quarterly", next: "2025-10-10", amount: 350, payment: "UPI" },
];

const initialBudgets: Budgets = { personal: 5000, trip: 8000, bike: 3000 };

function nowYM() {
  return new Date().toISOString().slice(0, 7);
}
function sum(arr: Expense[]) {
  return Math.round(arr.reduce((a, c) => a + (Number(c.amount) || 0), 0));
}

export default function ExpensesClient() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [recurring, setRecurring] = useState<Recurring[]>(initialRecurring);
  const [budgets, setBudgets] = useState<Budgets>(initialBudgets);

  const [filters, setFilters] = useState<Filters>({
    q: "",
    category: "",
    payment: "",
    from: "",
    to: "",
    unsettled: false,
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const focusSplitOnOpen = useRef(false);

  // Filtered list for current tab
  const list = useMemo(() => {
    if (activeTab === "reports") return [];
    let out = expenses.filter((e) => e.type === activeTab);
    const qv = filters.q.trim().toLowerCase();
    if (qv) out = out.filter((e) => (e.notes || "").toLowerCase().includes(qv) || (e.tag || "").toLowerCase().includes(qv));
    if (filters.category) out = out.filter((e) => e.category === filters.category);
    if (filters.payment) out = out.filter((e) => e.payment === filters.payment);
    if (filters.from) out = out.filter((e) => e.date >= filters.from);
    if (filters.to) out = out.filter((e) => e.date <= filters.to);
    if (filters.unsettled) out = out.filter((e) => !e.settled);
    return out.sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, activeTab, filters]);

  // Summary
  const summary = useMemo(() => {
    const total = sum(expenses);
    const ym = nowYM();
    const thisMonth = sum(expenses.filter((e) => e.date.slice(0, 7) === ym));
    const trip = sum(expenses.filter((e) => e.type === "trip"));
    const bike = sum(expenses.filter((e) => e.type === "bike"));
    const due = sum(expenses.filter((e) => !e.settled));
    return { total, thisMonth, trip, bike, due };
  }, [expenses]);

  // CRUD
  function upsertExpense(e: Expense) {
    setExpenses((prev) => {
      const i = prev.findIndex((x) => x.id === e.id);
      if (i > -1) {
        const cp = prev.slice();
        cp[i] = e;
        return cp;
      }
      return [...prev, e];
    });
  }
  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((x) => x.id !== id));
  }
  function markSettled(id: string) {
    setExpenses((prev) => prev.map((x) => (x.id === id ? { ...x, settled: true } : x)));
  }

  // Title actions
  function exportCSV() {
    const headers = ["id", "type", "category", "amount", "date", "payment", "tag", "notes", "settled", "split"];
    const lines = [headers.join(",")];
    expenses.forEach((e) => {
      lines.push(
        [
          e.id,
          e.type,
          e.category,
          e.amount,
          e.date,
          e.payment,
          (e.tag || "").replace(/,/g, ";"),
          (e.notes || "").replace(/,/g, ";"),
          e.settled ? "1" : "0",
          e.split ? JSON.stringify(e.split).replace(/,/g, ";") : "",
        ].join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function importCSV(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result || "");
      const lines = raw.split(/\r?\n/).filter(Boolean);
      const hdr = lines.shift()?.split(",") || [];
      const idx = (k: string) => hdr.indexOf(k);
      const next: Expense[] = [];
      lines.forEach((line) => {
        const cols = line.split(",");
        const obj: Expense = {
          id: cols[idx("id")] || `x${Math.random().toString(36).slice(2, 9)}`,
          type: (cols[idx("type")] as Expense["type"]) || "personal",
          category: cols[idx("category")] || "Misc",
          amount: Number(cols[idx("amount")]) || 0,
          date: cols[idx("date")] || new Date().toISOString().slice(0, 10),
          payment: cols[idx("payment")] || "UPI",
          tag: (cols[idx("tag")] || "").replace(/;/g, ","),
          notes: (cols[idx("notes")] || "").replace(/;/g, ","),
          settled: cols[idx("settled")] === "1",
        };
        const sp = cols[idx("split")] || "";
        if (sp) {
          try {
            obj.split = JSON.parse(sp.replace(/;/g, ","));
          } catch {}
        }
        next.push(obj);
      });
      setExpenses((prev) => [...prev, ...next]);
    };
    reader.readAsText(file);
  }

  // Modal open helpers
  function openAdd() {
    setEditing(null);
    focusSplitOnOpen.current = false;
    setModalOpen(true);
  }
  function openEdit(id: string, openSplit = false) {
    const e = expenses.find((x) => x.id === id) || null;
    setEditing(e);
    focusSplitOnOpen.current = openSplit;
    setModalOpen(true);
  }

  // Budgets save
  function saveBudgets(b: Budgets) {
    setBudgets(b);
  }

  // Recurring
  function addRecurringQuick() {
    const item: Recurring = {
      id: `x${Math.random().toString(36).slice(2, 9)}`,
      title: "New Item",
      type: activeTab === "reports" ? "personal" : activeTab,
      category: "Misc",
      cycle: "Monthly",
      next: new Date().toISOString().slice(0, 10),
      amount: 0,
      payment: "UPI",
    };
    setRecurring((r) => [...r, item]);
  }
  function removeRecurring(id: string) {
    setRecurring((r) => r.filter((x) => x.id !== id));
  }

  return (
    <>
      {/* Title / Actions */}
      <TitleBar onAdd={openAdd} onExport={exportCSV} onImport={importCSV} />

      {/* Sticky summary */}
      <SummarySticky totals={summary} />

      {/* Tabs + Filters */}
      <section className="bg-card border border-border rounded-2xl">
        <div className="px-4 sm:px-6 pt-4">
          <TabsFilters
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filters={filters}
            setFilters={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            onClear={() => setFilters({ q: "", category: "", payment: "", from: "", to: "", unsettled: false })}
          />
        </div>

        {/* Panels */}
        <div className="px-4 sm:px-6 pb-5">
          {activeTab === "reports" ? (
            <ReportsPanel expenses={expenses} accent={ACCENT} />
          ) : (
            <ListPanel
              items={list}
              fullCount={list.length}
              onEdit={(id) => openEdit(id)}
              onDelete={(id) => deleteExpense(id)}
              onSettle={(id) => markSettled(id)}
              onEditSplit={(id) => openEdit(id, true)}
              budgets={budgets}
              onSaveBudgets={saveBudgets}
              recurring={recurring}
              onAddRecurring={addRecurringQuick}
              onRemoveRecurring={removeRecurring}
              accent={ACCENT}
            />
          )}
        </div>
      </section>

      {/* Add / Edit Modal */}
      <ExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing || undefined}
        defaultType={activeTab === "reports" ? "personal" : activeTab}
        members={Array.from(MEMBERS)}
        onSave={(e) => {
          upsertExpense(e);
          setModalOpen(false);
        }}
        onDelete={(id) => {
          deleteExpense(id);
          setModalOpen(false);
        }}
        focusSplitOnOpen={focusSplitOnOpen.current}
        accent={ACCENT}
      />
    </>
  );
}
