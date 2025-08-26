'use client';

import { useEffect, useMemo, useState } from 'react';
import { listTripsAction, deleteTripAction } from '../actions';

export type Bike = { _id?: string; id?: string; bikeName: string; bikeDetails?: string };
export type Trip = {
  _id?: string; id?: string;
  title?: string; tripTitle?: string;
  fromDate: string; toDate: string;
  source: string; destination: string;
  details?: string; bike?: string | Bike; kilometer?: number;
  coverImageUrl?: string;
};

const PLACEHOLDER = '/assets/dummyUser.png';

/* ---------- helpers ---------- */
function toId(v?: string | Bike) { return typeof v === 'string' ? v : (v?._id || v?.id || ''); }
function bikeNameById(bikes: Bike[], id?: string) {
  return id ? (bikes.find(b => (b._id || b.id) === id)?.bikeName || '—') : '—';
}
function niceDateISO(d?: string) {
  // SSR-safe fixed format → 01 Aug 2025 (हाइड्रेशन mismatch नहीं)
  if (!d) return '—';
  try {
    const dt = new Date(d);
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    const MMM = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getUTCMonth()];
    const yyyy = dt.getUTCFullYear();
    return `${dd} ${MMM} ${yyyy}`;
  } catch { return (d || '').slice(0, 10); }
}
function daysBetween(a: string, b: string) {
  const A = new Date(a).setHours(0,0,0,0);
  const B = new Date(b).setHours(0,0,0,0);
  return Math.max(1, Math.round((B - A) / 86400000) + 1); // inclusive
}
function tripTitleOf(t: Trip) { return t.title || t.tripTitle || `${t.source} → ${t.destination}`; }
function toArray<T=any>(v:any): T[] {
  if (Array.isArray(v)) return v;
  if (v && Array.isArray(v.data)) return v.data;
  if (v && Array.isArray(v.items)) return v.items;
  return [];
}

export default function RidingPortfolioListSection({
  trips,
  bikes,
  pageSize = 4,              // 2 x 2
  title = 'Your Trips',
  fetchOnMount = true,
  className = '',
  onEditRequest,
  onChanged,
}: {
  trips: Trip[];
  bikes: Bike[];
  pageSize?: number;
  title?: string;
  fetchOnMount?: boolean;
  className?: string;
  onEditRequest?: (t: Trip) => void;
  onChanged?: (t: Trip[]) => void;
}) {
  const [data, setData] = useState<Trip[]>(Array.isArray(trips) ? trips : []);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string>('');

  // props change पर sync
  useEffect(() => { setData(Array.isArray(trips) ? trips : []); }, [trips]);

  // खाली हो तो fetch
  useEffect(() => {
    if (!fetchOnMount) return;
    if (data.length > 0) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const r:any = await listTripsAction();
        const arr = toArray<Trip>(r?.data ?? r);
        setData(arr);
        onChanged?.(arr);
      } catch (e:any) {
        setErr(e?.message || 'Failed to load trips');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedTrips = useMemo(
    () => (Array.isArray(data) ? data : []).map(t => ({ ...t, title: tripTitleOf(t) })),
    [data]
  );

  const total = normalizedTrips.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const items = normalizedTrips.slice(start, start + pageSize);

  function go(n:number){ if (n<1||n>totalPages) return; setPage(n); }

  async function handleDelete(id?: string) {
    const _id = id || '';
    if (!_id || deletingId) return;
    try {
      setDeletingId(_id);
      await deleteTripAction(_id);
      setData(prev => {
        const next = prev.filter(t => (t._id || t.id) !== _id);
        onChanged?.(next);
        return next;
      });
    } catch (e:any) {
      setErr(e?.message || 'Delete failed');
    } finally {
      setDeletingId('');
    }
  }

  return (
    <section className={`col-span-full bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5 ${className}`}>
      <h2 className="text-xl font-semibold">{title}</h2>

      {err && (
        <div className="text-sm rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-300">
          {err}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-textmuted">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
          Loading trips…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((t) => {
              const id = (t._id || t.id || '') as string;
              const days = daysBetween(t.fromDate, t.toDate);
              const km = Number(t.kilometer || 0);
              const bikeName = bikeNameById(bikes, toId(t.bike));
              const img = t.coverImageUrl || PLACEHOLDER;

              return (
                <article
                  key={id || `${t.source}-${t.destination}-${t.fromDate}-${t.title}`}
                  className="flex gap-4 items-start rounded-2xl border border-border bg-white/5 p-4"
                >
                  <img
                    src={img}
                    alt=""
                    className="h-16 w-16 rounded-xl object-cover bg-white/10 flex-shrink-0"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).src = PLACEHOLDER)}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold truncate max-w-[16rem]">{t.title}</h3>
                          <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 whitespace-nowrap">
                            {days}d • {km} km
                          </span>
                        </div>
                        <div className="text-sm text-textmuted mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                          {niceDateISO(t.fromDate)} – {niceDateISO(t.toDate)}
                        </div>
                        <div className="text-sm text-textmuted mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                          {t.source} → {t.destination}
                        </div>
                        <div className="text-xs text-textmuted mt-0.5">
                          Bike: <span className="text-white/80">{bikeName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => onEditRequest?.(t)}
                          className="px-3 py-1.5 text-sm rounded-full bg-white/10 hover:bg-white/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={deletingId === id}
                          className="px-3 py-1.5 text-sm rounded-full bg-red-600/85 hover:bg-red-600 text-white disabled:opacity-60"
                        >
                          {deletingId === id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </div>

                    {/* SCROLLER AREA — top margin + higher max-height, no bg / no rounded */}
                    {!!t.details && (
                      <div className="mt-3 max-h-48 overflow-auto pr-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {t.details}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
            {!items.length && (
              <div className="col-span-full text-sm text-textmuted">No trips to show.</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <button onClick={() => go(current - 1)} disabled={current === 1} className="px-3 py-1 rounded-full border border-white/20 text-sm disabled:opacity-50">Prev</button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                const n = i + 1;
                const active = n === current;
                return (
                  <button
                    key={n}
                    onClick={() => go(n)}
                    className={`h-8 w-8 rounded-full text-sm font-medium ${active ? 'bg-accent text-white' : 'border border-white/20 hover:bg-white/5'}`}
                  >
                    {n}
                  </button>
                );
              })}
              <button onClick={() => go(current + 1)} disabled={current === totalPages} className="px-3 py-1 rounded-full border border-white/20 text-sm disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
