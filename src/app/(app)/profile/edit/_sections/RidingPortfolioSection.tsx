'use client';

import { useEffect, useState, useTransition } from 'react';
import { addTripAction, editTripAction, listTripsAction } from '../actions';
import type { Bike } from './RidingPortfolioListSection';
export type Trip = {
  _id?: string; id?: string;
  title?: string;
  fromDate: string; toDate: string;
  source: string; destination: string;
  details?: string; bike?: string | Bike; kilometer?: number;
};

function toId(v?: string | Bike) { return typeof v === 'string' ? v : (v?._id || v?.id || ''); }
function toArray<T=any>(v:any): T[] {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.items)) return v.items;
  return [];
}
function todayISO(){ const d=new Date(); d.setHours(0,0,0,0); return d.toISOString().slice(0,10); }

export default function RidingPortfolioSection({
  id,
  bikes,
  tripsInit,
  onTripsChange,
  editRequest,
  onEditHandled,
}: {
  id?: string;
  bikes: Bike[];
  tripsInit: Trip[];
  onTripsChange?: (t: Trip[]) => void;
  editRequest?: Trip | null;
  onEditHandled?: () => void;
}) {
  const [trips, setTrips] = useState<Trip[]>(Array.isArray(tripsInit) ? tripsInit : []);
  const [saving, startSaving] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: '' as string | '',
    title: '',
    fromDate: '',
    toDate: '',
    source: '',
    destination: '',
    details: '',
    bike: '',
    kilometer: '' as any,
  });

  useEffect(() => { setTrips(Array.isArray(tripsInit) ? tripsInit : []); }, [tripsInit]);

  // बाहरी Edit request आने पर prefill
  useEffect(() => {
    if (!editRequest) return;
    const t = editRequest;
    setForm({
      id: (t._id || t.id || '') as string,
      title: t.title || '',
      fromDate: (t.fromDate || '').slice(0,10),
      toDate: (t.toDate || '').slice(0,10),
      source: t.source || '',
      destination: t.destination || '',
      details: t.details || '',
      bike: typeof t.bike === 'string' ? t.bike : (t.bike?._id || t.bike?.id || ''),
      kilometer: t.kilometer ?? '' as any,
    });
    onEditHandled?.();
  }, [editRequest, onEditHandled]);

  function set<K extends keyof typeof form>(k:K, v:any){ setForm(f => ({ ...f, [k]: v })); }

  async function save() {
    setErr(null); setMsg(null);
    const payload = {
      title: form.title.trim(),
      fromDate: form.fromDate,
      toDate: form.toDate,
      source: form.source.trim(),
      destination: form.destination.trim(),
      details: form.details.trim(),
      bike: form.bike,
      kilometer: Number(form.kilometer || 0),
    };

    if (!payload.title || !payload.fromDate || !payload.toDate || !payload.source || !payload.destination || !payload.bike) {
      setErr('Please fill all required fields'); return;
    }

    startSaving(async () => {
      try {
        if (form.id) await editTripAction(form.id, payload);
        else         await addTripAction(payload);

        // reset + refetch
        setForm({ id:'', title:'', fromDate:'', toDate:'', source:'', destination:'', details:'', bike:'', kilometer:'' as any });

        const r:any = await listTripsAction();
        const arr:Trip[] = toArray<Trip>(r?.data ?? r);
        setTrips(arr); onTripsChange?.(arr);
        setMsg(form.id ? 'Trip updated' : 'Trip added');
      } catch (e:any) { setErr(e?.message || 'Save failed'); }
    });
  }

  const today = todayISO();
  const minFrom = '1900-01-01';
  const minTo = form.fromDate || minFrom;
  const maxTo = today;

  return (
    <section id={id} className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4 md:col-span-1">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{form.id ? 'Edit Trip' : 'Riding Portfolio'}</h2>
      </div>

      {msg && <div className="text-sm rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-emerald-300">{msg}</div>}
      {err && <div className="text-sm rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-300">{err}</div>}

      <div className="space-y-3">
        <input className="field" placeholder="Title (e.g., Desert Trail Sam)" value={form.title} onChange={e=>set('title', e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <label className="label block">
            <span className="text-textmuted">From</span>
            <input type="date" className="field mt-1" max={today} value={form.fromDate} onChange={e=>set('fromDate', e.target.value)} />
          </label>
          <label className="label block">
            <span className="text-textmuted">To</span>
            <input type="date" className="field mt-1" min={minTo} max={maxTo} value={form.toDate} onChange={e=>set('toDate', e.target.value)} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input className="field" placeholder="Source" value={form.source} onChange={e=>set('source', e.target.value)} />
          <input className="field" placeholder="Destination" value={form.destination} onChange={e=>set('destination', e.target.value)} />
        </div>

        {/* Select bike & kilometer → 50/50 */}
        <div className="grid grid-cols-2 gap-3">
          <select className="field" value={form.bike} onChange={e=>set('bike', e.target.value)}>
            <option value="" className="bg-slatebg">Select bike</option>
            {bikes.map(b => {
              const id = (b._id || b.id || '') as string;
              return <option key={id || b.bikeName} value={id} className="bg-slatebg">{b.bikeName}</option>;
            })}
          </select>
          <input type="number" min={0} className="field" placeholder="Kilometer" value={form.kilometer} onChange={e=>set('kilometer', e.target.value)} />
        </div>

        <textarea className="field" rows={11} placeholder="Details (comma or • separated)" value={form.details} onChange={e=>set('details', e.target.value)} />

        <div className="flex gap-2 justify-end">
          {form.id && (
            <button type="button" onClick={()=>setForm({ id:'', title:'', fromDate:'', toDate:'', source:'', destination:'', details:'', bike:'', kilometer:'' as any })} className="rounded-xl px-3 py-1.5 bg-white/5 border border-border">
              Cancel
            </button>
          )}
          <button type="button" onClick={save} aria-busy={saving} className="rounded-xl px-3 py-1.5 bg-accent text-white">
            {saving ? 'Saving…' : (form.id ? 'Update Trip' : 'Add Trip')}
          </button>
        </div>
      </div>
    </section>
  );
}
