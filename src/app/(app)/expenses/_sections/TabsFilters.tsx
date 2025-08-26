import { Filters, Tab } from "./types";

export default function TabsFilters({
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  onClear,
}: {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  onClear: () => void;
}) {
  const TabBtn = ({ t, children }: { t: Tab; children: React.ReactNode }) => {
    const on = activeTab === t;
    return (
      <button
        data-tab={t}
        onClick={() => setActiveTab(t)}
        className={`tab-btn px-4 py-2 rounded-2xl font-medium ${on ? "bg-white/10" : "hover:bg-white/10"}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <TabBtn t="personal">Personal</TabBtn>
      <TabBtn t="trip">This Trip</TabBtn>
      <TabBtn t="bike">Bike Life</TabBtn>
      <TabBtn t="reports">Reports</TabBtn>

      {activeTab !== "reports" && (
        <div className="ml-auto flex items-center gap-2">
          <input
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
            className="field h-10 w-48"
            placeholder="Search notes / tag"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
            className="field h-10 w-40"
          >
            <option className="bg-slatebg" value="">All Categories</option>
            {["Fuel","Food","Stay","Toll","Repair","Gear","Insurance","Service","Misc"].map((c)=>(
              <option key={c} className="bg-slatebg" value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filters.payment}
            onChange={(e) => setFilters({ payment: e.target.value })}
            className="field h-10 w-36"
          >
            <option className="bg-slatebg" value="">Any Pay</option>
            {["Cash","UPI","Card"].map((p)=>(
              <option key={p} className="bg-slatebg" value={p}>{p}</option>
            ))}
          </select>
          <input value={filters.from} onChange={(e)=>setFilters({from:e.target.value})} type="date" className="field h-10 w-40" />
          <input value={filters.to} onChange={(e)=>setFilters({to:e.target.value})} type="date" className="field h-10 w-40" />
          <label className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-2xl bg-white/5 border border-border">
            <input
              type="checkbox"
              className="toggle"
              checked={filters.unsettled}
              onChange={(e) => setFilters({ unsettled: e.target.checked })}
            />
            <span className="text-textmuted">Unsettled only</span>
          </label>
          <button onClick={onClear} className="btn btn-ghost">Clear</button>
        </div>
      )}
    </div>
  );
}
