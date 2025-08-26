'use client';

import React, { useEffect, useMemo, useState } from 'react';

type Member = { id: string; name: string };
type Message = { me: boolean; text?: string; time?: string; imgDataUrl?: string | null; fileName?: string | null };
type Trip = {
  id: string;
  title: string;
  meta: string;
  thumb: string;
  my: boolean;
  completed: boolean;
  startDate: string;      // YYYY-MM-DD
  members: Member[];
  messages: Message[];
  expenses?: Array<{ title: string; amount: number; paidBy: string; shares: Record<string, number> }>;
};

const SENDER_BUBBLE =
  'bg-[linear-gradient(135deg,_#F25C2A_0%,_#FF7A4D_100%)] text-white shadow-[0_8px_24px_rgba(242,92,42,0.18)]';
const RECEIVER_BUBBLE = 'bg-white/5 text-white';

const DUMMY_IMG = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';

const seed: Trip[] = [
  { id:'t1', title:'Udaipur Weekend Sprint', meta:'2d • 420 km', thumb:DUMMY_IMG, my:true,  completed:false, startDate:'2025-08-20',
    members:[{id:'u1',name:'You'},{id:'u2',name:'Sidhi'},{id:'u3',name:'Karan'}],
    messages:[{me:false,text:'Meet 6am sharp at Ajmer Rd.',time:'09:10'},{me:true,text:'On it! 🙌',time:'09:12'}]},
  { id:'t2', title:'Desert Trail Sam', meta:'1d • 280 km', thumb:DUMMY_IMG, my:false, completed:true, startDate:'2025-06-10',
    members:[{id:'u1',name:'You'},{id:'u4',name:'Anushka'}],
    messages:[{me:false,text:'Bring extra water.',time:'10:20'},{me:true,text:'✅',time:'10:22'}]},
  { id:'t3', title:'Jaipur Monsoon Loop', meta:'Half-day • 120 km', thumb:DUMMY_IMG, my:true, completed:true, startDate:'2025-07-05',
    members:[{id:'u1',name:'You'},{id:'u5',name:'Rahul'},{id:'u6',name:'Pooja'}], messages:[]},
  { id:'t4', title:'Mount Abu Sunrise Dash', meta:'1d • 310 km', thumb:DUMMY_IMG, my:false, completed:false, startDate:'2025-08-25',
    members:[{id:'u1',name:'You'},{id:'u7',name:'Ravi'}], messages:[]},
];

export default function TripsChatClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'completed'>('all');
  const [q, setQ] = useState('');
  const [trips, setTrips] = useState<Trip[]>(seed);
  const [activeId, setActiveId] = useState<string | null>(seed[0]?.id ?? null);

  const active = useMemo(() => trips.find(t => t.id === activeId) || null, [trips, activeId]);

  const filtered = useMemo(() => {
    return trips.filter(t =>
      (activeTab === 'all' ? true : activeTab === 'mine' ? t.my : t.completed) &&
      t.title.toLowerCase().includes(q.toLowerCase())
    );
  }, [trips, activeTab, q]);

  const counts = useMemo(() => ({
    all: trips.length,
    mine: trips.filter(t => t.my).length,
    completed: trips.filter(t => t.completed).length,
  }), [trips]);

  function daysLeft(startDateStr: string) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(startDateStr); start.setHours(0, 0, 0, 0);
    return Math.ceil((+start - +today) / (1000 * 60 * 60 * 24));
  }
  function statusText(t: Trip) {
    if (t.completed) return 'Completed';
    const d = daysLeft(t.startDate);
    if (d > 0) return `${d} days left`;
    if (d === 0) return 'Starting Today';
    return 'On Trip';
  }

  function appendMessage(msg: Message) {
    if (!active) return;
    setTrips(prev => prev.map(t => t.id === active.id ? { ...t, messages: [...t.messages, msg] } : t));
  }

  // menus (header + row) — robust click-away
  const [moreOpen, setMoreOpen] = useState(false);
  const [rowMenuOpenId, setRowMenuOpenId] = useState<string | null>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = e.target as HTMLElement;
      if (el.closest('[data-hmenu]') || el.closest('[data-hmenu-btn]') || el.closest('[data-row-menu]') || el.closest('[data-row-menu-btn]')) return;
      setMoreOpen(false);
      setRowMenuOpenId(null);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  /* ===== Expenses Drawer state ===== */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exTitle, setExTitle] = useState('');
  const [exAmount, setExAmount] = useState<number | ''>('');
  const [paidBy, setPaidBy] = useState<string>('');
  const [splitMode, setSplitMode] = useState<'equal' | 'custom' | 'percent'>('equal');
  const [customMap, setCustomMap] = useState<Record<string, number | ''>>({});
  const [percentMap, setPercentMap] = useState<Record<string, number | ''>>({});
  const [included, setIncluded] = useState<Record<string, boolean>>({});

  function resetExpenseForm() {
    setExTitle(''); setExAmount(''); setPaidBy(active?.members[0]?.id || '');
    setSplitMode('equal'); setCustomMap({}); setPercentMap({});
    if (active) setIncluded(Object.fromEntries(active.members.map(m => [m.id, true])));
  }
  function openDrawer() {
    if (!active) return;
    setPaidBy(active.members[0]?.id || '');
    setIncluded(Object.fromEntries(active.members.map(m => [m.id, true])));
    setDrawerOpen(true);
  }
  function addExpense() {
    if (!active) return;
    const amount = Number(exAmount || 0);
    if (!exTitle.trim() || !amount || !paidBy) return;

    const shares: Record<string, number> = {};
    if (splitMode === 'equal') {
      const ids = active.members.map(m => m.id).filter(id => included[id] !== false);
      const n = Math.max(1, ids.length);
      const each = Math.round((amount / n) * 100) / 100;
      ids.forEach(id => { shares[id] = each; });
      active.members.forEach(m => { if (!shares[m.id]) shares[m.id] = 0; });
    } else if (splitMode === 'percent') {
      const totalPct = active.members.reduce((s, m) => s + Number(percentMap[m.id] || 0), 0);
      const factor = totalPct > 0 ? amount / totalPct : 0;
      active.members.forEach(m => {
        const pct = Number(percentMap[m.id] || 0);
        shares[m.id] = Math.round((pct * factor) * 100) / 100;
      });
    } else {
      const sum = active.members.reduce((s, m) => s + Number(customMap[m.id] || 0), 0);
      const ratio = sum > 0 ? amount / sum : 0;
      active.members.forEach(m => {
        const val = Number(customMap[m.id] || 0);
        shares[m.id] = Math.round((val * ratio) * 100) / 100;
      });
    }

    setTrips(prev => prev.map(t => t.id === active.id
      ? { ...t, expenses: [...(t.expenses || []), { title: exTitle.trim(), amount, paidBy, shares }] }
      : t
    ));
    resetExpenseForm();
  }

  return (
    <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-4">
      {/* LEFT: Trips */}
      <aside className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
        {/* header: search + tabs */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center bg-white/5 rounded-xl px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input value={q} onChange={(e)=>setQ(e.target.value)} className="bg-transparent outline-none w-full placeholder:text-textmuted text-sm" placeholder="Search trips"/>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-3" role="tablist">
            {(['all','mine','completed'] as const).map(tab=>{
              const selected = activeTab===tab;
              const count = tab==='all'?counts.all:tab==='mine'?counts.mine:counts.completed;
              return (
                <button key={tab} onClick={()=>setActiveTab(tab)}
                  className={`py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1.5 ${selected?'bg-accent text-white':'bg-white/5 text-white'} text-xs`}
                  aria-selected={selected}>
                  <span className="truncate">{tab==='all'?'All Trips':tab==='mine'?'My Trips':'Completed'}</span>
                  <span className={`text-[10px] rounded-full px-1.5 py-[1px] ${selected?'bg-white/20':'bg-white/10'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border" aria-live="polite">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-textmuted">No trips found.</div>
          ) : filtered.map(t=>{
            const dLeft = daysLeft(t.startDate);
            const statusChip = t.completed
              ? <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5">Completed</span>
              : dLeft > 0
                ? <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5">{dLeft} days left</span>
                : <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5">Starting</span>;

            const isActive = activeId===t.id;

            return (
              <div key={t.id} className={`w-full px-4 py-3 ${isActive?'bg-white/5':''} hover:bg-white/5`}>
                <div className="flex items-center gap-3">
                  {/* thumb + small crown overlay (added) */}
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.thumb} className="h-12 w-12 rounded-lg object-cover" alt="" />
                    {t.my && !t.completed && (
                      <span
                        title="You created this trip"
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent grid place-items-center shadow"
                      >
                        <CrownIcon className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                  </div>

                  {/* title + second row */}
                  <div className="min-w-0 flex-1">
                    {/* row 1: title (+ existing My Trip pill stays as-is) */}
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={()=>setActiveId(t.id)} className="font-medium truncate text-left">
                        {t.title}
                      </button>
                    </div>

                    {/* row 2 */}
                    <div className="mt-1 mb-0.5 flex items-center gap-2">
                      {statusChip}
                      <span className="text-xs text-textmuted truncate">{t.meta}</span>
                    </div>
                  </div>

                  {/* row menu (3-dots) */}
                  <div className="relative">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-white/10"
                      title="More"
                      data-row-menu-btn
                      onClick={(e)=>{ e.stopPropagation(); setRowMenuOpenId(v=>v===t.id?null:t.id); }}
                    >
                      <MoreVerticalIcon className="h-5 w-5"/>
                    </button>

                    <div
                      data-row-menu
                      className={`absolute right-0 top-9 w-48 bg-card border border-border rounded-xl shadow-soft p-1 text-sm z-20 ${rowMenuOpenId===t.id?'':'hidden'}`}
                      onClick={(e)=>e.stopPropagation()}
                    >
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4"/> Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2">
                        <MuteIcon className="h-4 w-4"/> Mute Trip
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2">
                        <InfoIcon className="h-4 w-4"/> Trip Info
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2 text-red-300">
                        <ExitIcon className="h-4 w-4"/> Exit Trip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* CENTER: Chat */}
      <section className="bg-card border border-border rounded-2xl flex flex-col h-[calc(100vh-10.5rem)] min-h-[560px]">
        {/* Header — bottom border + pills to the RIGHT of title */}
        <div className="px-5 py-3 flex items-center gap-3 sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active?.thumb || DUMMY_IMG} className="h-10 w-10 rounded-lg object-cover" alt="" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="font-semibold truncate">{active ? active.title : 'Select a trip to start chat'}</div>
              {active && (
                <>
                  <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5">{statusText(active)}</span>
                  <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5">{active.members.length} members</span>
                </>
              )}
            </div>
            <div className="text-xs text-textmuted truncate">{active ? active.meta : '—'}</div>
          </div>

          {/* header menu */}
          <div className="ml-auto relative">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-white/10"
              title="More"
              data-hmenu-btn
              onClick={(e)=>{ e.stopPropagation(); setMoreOpen(v=>!v); }}
            >
              <MoreVerticalIcon className="h-5 w-5" />
            </button>
            <div
              data-hmenu
              className={`absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-soft p-1 text-sm z-20 ${moreOpen?'':'hidden'}`}
              onClick={(e)=>e.stopPropagation()}
            >
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" /> Settings
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2">
                <MuteIcon className="h-4 w-4" /> Mute Trip
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2">
                <InfoIcon className="h-4 w-4" /> Trip Info
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2 text-red-300">
                <ExitIcon className="h-4 w-4" /> Exit Trip
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-6">
          {!active ? (
            <div className="text-textmuted text-sm">Tip: Left से कोई भी Trip चुनो और चैट शुरू करो.</div>
          ) : active.messages.length === 0 ? (
            <div className="text-textmuted text-sm">No messages yet. Say hi 👋</div>
          ) : (
            active.messages.map((m, i) => (
              <div key={i} className={`max-w-[78%] ${m.me ? 'ml-auto' : ''}`}>
                {m.imgDataUrl && <img src={m.imgDataUrl} className="rounded-xl max-h-64 object-cover" alt="attachment" />}
                {m.fileName && !m.imgDataUrl && (
                  <div className={`${m.me ? SENDER_BUBBLE : RECEIVER_BUBBLE} rounded-2xl px-3 py-2 flex items-center gap-2`}>
                    <FileIcon className="h-4 w-4" /><span className="text-sm truncate">{m.fileName}</span>
                  </div>
                )}
                {m.text && (
                  <div className={`${m.me ? SENDER_BUBBLE : RECEIVER_BUBBLE} rounded-2xl px-3 py-2`}>
                    <div className="text-sm">{m.text}</div>
                  </div>
                )}
                <div className={`mt-1 text-[10px] text-textmuted ${m.me ? 'text-right' : ''}`}>
                  {m.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Composer */}
        <Composer
          disabled={!active}
          onSend={(text) => appendMessage({ me: true, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
          onAttachImage={(dataUrl) => appendMessage({ me: true, imgDataUrl: dataUrl })}
          onAttachFile={(fileName) => appendMessage({ me: true, fileName })}
          onOpenExpenses={openDrawer}
        />
      </section>

      {/* Expenses Drawer */}
      {active && (
        <ExpensesDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          trip={active}
          exTitle={exTitle}
          setExTitle={setExTitle}
          exAmount={exAmount}
          setExAmount={setExAmount}
          paidBy={paidBy}
          setPaidBy={setPaidBy}
          splitMode={splitMode}
          setSplitMode={setSplitMode}
          customMap={customMap}
          setCustomMap={setCustomMap}
          percentMap={percentMap}
          setPercentMap={setPercentMap}
          included={included}
          setIncluded={setIncluded}
          onAdd={() => { addExpense(); }}
        />
      )}
    </div>
  );
}

/* ===== Composer / Drawer / Icons (unchanged) ===== */

function Composer({
  disabled,
  onSend,
  onAttachImage,
  onAttachFile,
  onOpenExpenses,
}: {
  disabled?: boolean;
  onSend: (text: string) => void;
  onAttachImage: (dataUrl: string) => void;
  onAttachFile: (fileName: string) => void;
  onOpenExpenses: () => void;
}) {
  const [val, setVal] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  function send(){ const t=val.trim(); if(!t) return; onSend(t); setVal(''); }
  function chooseImage(e: React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>onAttachImage(String(ev.target?.result||'')); r.readAsDataURL(f); e.target.value=''; }
  function chooseFile(e: React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(!f)return; onAttachFile(f.name); e.target.value=''; }

  return (
    <div className="px-5 pb-3 pt-0">
      <div className="flex items-end gap-2 bg-white/5 rounded-2xl px-3 py-2">
        <div className="relative">
          <button type="button" className="p-2 rounded-lg hover:bg-white/10" title="Attach" onClick={(e)=>{ e.stopPropagation(); setMenuOpen(v=>!v); }} disabled={disabled}>
            <PaperclipIcon className="h-5 w-5" />
          </button>
          <div className={`absolute bottom-12 left-0 w-56 bg-card border border-border rounded-xl shadow-soft p-1 text-sm z-20 ${menuOpen?'':'hidden'}`} onClick={(e)=>e.stopPropagation()}>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <ImageIcon className="h-4 w-4"/><span>Image</span>
              <input onChange={chooseImage} type="file" accept="image/*" className="hidden"/>
            </label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <VideoIcon className="h-4 w-4"/><span>Video</span>
              <input onChange={chooseFile} type="file" accept="video/*" className="hidden"/>
            </label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <FileIcon className="h-4 w-4"/><span>File</span>
              <input onChange={chooseFile} type="file" className="hidden"/>
            </label>
            <button type="button" className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5" onClick={()=>setMenuOpen(false)}>
              <PinIcon className="h-4 w-4"/> Location
            </button>
          </div>
        </div>

        <button type="button" onClick={onOpenExpenses} className="p-2 rounded-lg hover:bg-white/10" title="Expenses" disabled={disabled}>
          <ReceiptRupeeIcon className="h-5 w-5" />
        </button>

        <textarea rows={1} value={val} onChange={(e)=>setVal(e.target.value)} placeholder="Write a message…" className="flex-1 bg-transparent outline-none resize-none max-h-32 placeholder:text-textmuted" disabled={disabled}/>
        <button type="button" onClick={send} disabled={disabled || !val.trim()} className="px-4 py-2 bg-accent/80 hover:bg-accent text-white rounded-xl font-medium disabled:opacity-50">Send</button>
      </div>

      <div className={`fixed inset-0 ${menuOpen?'':'pointer-events-none'} bg-transparent`} onClick={()=>setMenuOpen(false)} />
    </div>
  );
}

function ExpensesDrawer(props: {
  open: boolean; onClose: () => void; trip: Trip;
  exTitle: string; setExTitle: (v: string) => void;
  exAmount: number | ''; setExAmount: (v: number | '') => void;
  paidBy: string; setPaidBy: (v: string) => void;
  splitMode: 'equal' | 'custom' | 'percent'; setSplitMode: (v: 'equal' | 'custom' | 'percent') => void;
  customMap: Record<string, number | ''>; setCustomMap: (v: Record<string, number | ''>) => void;
  percentMap: Record<string, number | ''>; setPercentMap: (v: Record<string, number | ''>) => void;
  included: Record<string, boolean>; setIncluded: (v: Record<string, boolean>) => void;
  onAdd: () => void;
}) {
  const { open, onClose, trip, exTitle, setExTitle, exAmount, setExAmount, paidBy, setPaidBy, splitMode, setSplitMode, customMap, setCustomMap, percentMap, setPercentMap, included, setIncluded, onAdd } = props;

  return (
    <aside className={`fixed top-0 right-0 w-[420px] max-w-[92vw] h-full bg-card border-l border-border transition-transform duration-300 z-40 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="px-4 py-3 border-b border-border flex items-center">
        <div className="font-semibold">Trip Expenses</div>
        <button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-white/10" aria-label="Close">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 text-sm">
        {!trip.expenses || trip.expenses.length === 0 ? (
          <div className="text-textmuted">No expenses yet.</div>
        ) : trip.expenses.map((e, idx) => (
          <div key={idx} className="border border-border rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">₹{e.amount} — {e.title}</div>
              <div className="text-xs text-textmuted">Paid by {trip.members.find(m => m.id === e.paidBy)?.name || '—'}</div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {Object.entries(e.shares).map(([uid, val]) => {
                const nm = trip.members.find(m => m.id === uid)?.name || uid;
                return <span key={uid} className="bg-white/5 rounded-lg px-2 py-0.5">{nm}: ₹{val}</span>;
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input className="field" placeholder="Title (e.g., Lunch)" value={exTitle} onChange={(e)=>setExTitle(e.target.value)} />
          <input type="number" min={0} className="field" placeholder="Amount (₹)" value={exAmount} onChange={(e)=>setExAmount(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className="field" value={paidBy} onChange={(e)=>setPaidBy(e.target.value)}>
            {trip.members.map(m => <option key={m.id} className="bg-slatebg" value={m.id}>{m.name}</option>)}
          </select>
          <select className="field" value={splitMode} onChange={(e)=>setSplitMode(e.target.value as any)}>
            <option className="bg-slatebg" value="equal">Split equally</option>
            <option className="bg-slatebg" value="custom">Custom amounts</option>
            <option className="bg-slatebg" value="percent">Percent split</option>
          </select>
        </div>

        <div className="space-y-2">
          {trip.members.map(m=>(
            <div key={m.id} className="flex items-center gap-2">
              <label className="flex-1 text-sm">{m.name}</label>
              {splitMode==='equal' ? (
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-[var(--accent,#F25C2A)]" checked={included[m.id] !== false} onChange={(e)=>setIncluded({ ...included, [m.id]: e.target.checked })}/>
                  <span className="text-xs text-textmuted">Include</span>
                </label>
              ) : splitMode==='percent' ? (
                <input type="number" className="field w-28" placeholder="%" value={percentMap[m.id] ?? ''} onChange={(e)=>setPercentMap({ ...percentMap, [m.id]: e.target.value === '' ? '' : Number(e.target.value) })}/>
              ) : (
                <input type="number" className="field w-28" placeholder="₹" value={customMap[m.id] ?? ''} onChange={(e)=>setCustomMap({ ...customMap, [m.id]: e.target.value === '' ? '' : Number(e.target.value) })}/>
              )}
            </div>
          ))}
          {splitMode==='equal' && (<div className="text-xs text-textmuted">Only selected members will be included in equal split.</div>)}
        </div>

        <button onClick={onAdd} className="w-full bg-accent text-white font-semibold rounded-xl py-2.5">Add Expense</button>
      </div>
    </aside>
  );
}

/* ===== Icons ===== */
function PaperclipIcon({ className = 'h-5 w-5' }) {
  return (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 7.5l6.72-6.72a4.5 4.5 0 116.36 6.36L10.6 17.1a6 6 0 11-8.49-8.49l8.02-8.02 1.41 1.41-8.02 8.02a4 4 0 105.66 5.66l9-9a2.5 2.5 0 10-3.54-3.54L8.94 8.06"/></svg>);
}
function ImageIcon({ className = 'h-4 w-4' }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5a2 2 0 0 0-2-2H5C3.89 3 3 3.9 3 5v14a2 2 0 0 0 2 2h14c1.11 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5zM8 8a2 2 0 1 1-.001 4.001A2 2 0 0 1 8 8z"/></svg>);
}
function VideoIcon({ className = 'h-4 w-4' }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a2 2 0 00-2-2H5C3.9 5 3 5.9 3 7v10c0 1.1.9 2 2 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z"/></svg>);
}
function FileIcon({ className = 'h-4 w-4' }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm1 7V3.5L18.5 9H15z"/></svg>);
}
function PinIcon({ className = 'h-4 w-4' }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.5 7 13 7 13s7-7.5 7-13c0-3.9-3.1-7-7-7zm0 9.2a2.2 2.2 0 110-4.4 2.2 2.2 0 010 4.4z"/></svg>);
}
function ReceiptRupeeIcon({ className = 'h-5 w-5' }) {
  return (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a1 1 0 011 1v18l-3-2-3 2-3-2-3 2-3-2V3a1 1 0 011-1zM9 8h4a2 2 0 100-4H9v2h4a0 0 0 110 0 0 0 0 010 0H9a3 3 0 000 6h1v2H9v2h2v-2h1a3 3 0 100-6H9v2z"/></svg>);
}
function MoreVerticalIcon({ className = 'h-5 w-5' }) {
  return (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/></svg>);
}
function SettingsIcon({ className = 'h-4 w-4' }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 12.9a7.5 7.5 0 000-1.8l2-1.5-2-3.4-2.3.9a7.7 7.7 0 00-1.6-.9L15 2h-6l-.5 2.2c-.6.2-1.1.5-1.6.9l-2.3-.9-2 3.4 2 1.5a7.5 7.5 0 000 1.8l-2 1.5 2 3.4 2.3-.9c.5.4 1 .7 1.6.9L9 22h6l.5-2.2c.6-.2 1.1-.5 1.6-.9l2.3.9 2-3.4-2-1.5zM12 15.5A3.5 3.5 0 1112 8a3.5 3.5 0 010 7.5z"/></svg>);
}
function MuteIcon({ className = 'h-4 w-4' }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12a4.5 4.5 0 01-9 0V9l-3-3V4l5 5v3a3 3 0 006 0v-.59l2 2V12zM21 20.19L3.81 3 2.39 4.41 5 7.02V12a7 7 0 007 7c1.15 0 2.24-.28 3.2-.78l1.39 1.39L21 20.19z"/></svg>);
}
function InfoIcon({ className = 'h-4 w-4' }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11 9h2V7h-2v2zm0 8h2v-6h-2v6zm1-14C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3z"/></svg>);
}
function ExitIcon({ className = 'h-4 w-4' }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l5-5-5-5v10zM4 4h8v2H6v12h6v2H4V4z"/></svg>);
}
function CrownIcon({ className = 'h-3 w-3 text-white' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3 7l4 3 5-6 5 6 4-3v10H3V7zm4 9h10v-2H7v2z" />
    </svg>
  );
}
