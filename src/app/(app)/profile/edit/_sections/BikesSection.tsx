'use client';

import { useEffect, useState, useTransition } from 'react';
import { addBikeAction, listBikesAction, deleteBikeAction } from '../actions';

export type Bike = { _id?: string; id?: string; bikeName: string; bikeDetails?: string };

function toArray<T = any>(v: any): T[] {
  if (Array.isArray(v)) return v;
  if (v && Array.isArray(v.data)) return v.data;
  if (v && Array.isArray(v.items)) return v.items;
  if (v?.data?.bikes && Array.isArray(v.data.bikes)) return v.data.bikes;
  return [];
}

export default function BikesSection({
  bikesInit,
  onBikesChange,
}: {
  bikesInit: Bike[];
  onBikesChange?: (b: Bike[]) => void;
}) {
  const [bikes, setBikes] = useState<Bike[]>(Array.isArray(bikesInit) ? bikesInit : []);
  const [newBike, setNewBike] = useState({ name: '', details: '' });
  const [addingBike, startAddBike] = useTransition();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { onBikesChange?.(bikes); }, [bikes, onBikesChange]);
  useEffect(() => { void reload(); /* ensure fresh */ }, []);

  function clearMsgs() { setOk(null); setErr(null); }

  async function reload() {
    clearMsgs();
    setLoading(true);
    try {
      const r: any = await listBikesAction();
      const a = toArray<Bike>(r?.data ?? r);
      setBikes(a);
    } catch (e: any) {
      setErr(e?.message || 'Could not load bikes.');
    } finally { setLoading(false); }
  }

  function addBike() {
    clearMsgs();
    if (!newBike.name.trim() || !newBike.details.trim()) {
      setErr('Please enter both Name and Details.');
      return;
    }
    startAddBike(async () => {
      try {
        await addBikeAction(newBike.name.trim(), newBike.details.trim());
        setNewBike({ name: '', details: '' });
        await reload();
        setOk('Bike added successfully.');
      } catch (e: any) {
        setErr(e?.message || 'Add bike failed.');
      }
    });
  }

  function removeBike(id?: string) {
    clearMsgs();
    const _id = id || '';
    if (!_id) return;
    deleteBikeAction(_id)
      .then(() => {
        setBikes(prev => prev.filter(b => (b._id || b.id) !== _id));
        setOk('Bike removed.');
      })
      .catch((e: any) => setErr(e?.message || 'Delete bike failed.'));
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
      {/* <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Bikes</h2>
        <button
          type="button"
          onClick={addBike}
          className="text-sm rounded-full px-4 py-2 bg-accent text-white shadow hover:opacity-95 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
          aria-busy={addingBike}
          disabled={addingBike}
        >
          {addingBike ? 'Adding…' : '+ Add'}
        </button>
      </div> */}

      {err && <div className="text-sm rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-300">{err}</div>}
      {ok &&  <div className="text-sm rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-emerald-300">{ok}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input className="field" placeholder="Name"
               value={newBike.name} onChange={(e) => setNewBike(s => ({ ...s, name: e.target.value }))} />
        <input className="field" placeholder="Details"
               value={newBike.details} onChange={(e) => setNewBike(s => ({ ...s, details: e.target.value }))} />
        <div className="flex sm:justify-end">
          <button
            type="button"
            onClick={addBike}
            className="ml-auto text-sm rounded-full px-4 py-2 bg-accent text-white shadow hover:opacity-95 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={addingBike}
            disabled={addingBike}
          >
            {addingBike ? 'Adding…' : 'Add'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="cp min-w-full">
          <thead>
            <tr>
              <th className="text-left">BIKE NAME</th>
              <th className="text-left">BIKE DETAILS</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={3} className="py-3 text-sm text-textmuted">Loading bikes…</td></tr>
            )}
            {!loading && bikes.map((b) => {
              const id = (b._id || b.id || '') as string;
              return (
                <tr key={id || b.bikeName}>
                  <td>{b.bikeName}</td>
                  <td>{b.bikeDetails}</td>
                  <td>
                    {id ? (
                      <button onClick={() => removeBike(id)} className="text-red-400 hover:text-red-300">Remove</button>
                    ) : <span className="text-textmuted text-xs">id missing</span>}
                  </td>
                </tr>
              );
            })}
            {!loading && !bikes.length && (
              <tr><td colSpan={3} className="py-3 text-sm text-textmuted">No bikes added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
