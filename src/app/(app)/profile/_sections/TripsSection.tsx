'use client';

import React, { useMemo, useState } from 'react';

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
function niceDateISO(d?: string) {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    const MMM = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getUTCMonth()];
    const yyyy = dt.getUTCFullYear();
    return `${dd} ${MMM} ${yyyy}`; // SSR-safe fixed format
  } catch { return (d || '').slice(0, 10); }
}
function daysBetween(a: string, b: string) {
  const A = new Date(a).setHours(0,0,0,0);
  const B = new Date(b).setHours(0,0,0,0);
  return Math.max(1, Math.round((B - A) / 86400000) + 1); // inclusive
}
function tripTitleOf(t: Trip) {
  return t.title || t.tripTitle || `${t.source} → ${t.destination}`;
}
function bikeNameOf(b?: string | Bike) {
  if (!b) return '—';
  return typeof b === 'string' ? '—' : (b.bikeName || '—');
}

export default function TripsSection({
  trips = [],
  pageSize = 4,                     // 2 x 2
  title = 'Your Trips',
  className = '',
}: {
  trips?: Trip[];
  pageSize?: number;
  title?: string;
  className?: string;
}) {
  const normalizedTrips = useMemo(
    () => (Array.isArray(trips) ? trips : []).map(t => ({ ...t, title: tripTitleOf(t) })),
    [trips]
  );

  const [page, setPage] = useState(1);
  const total = normalizedTrips.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const items = normalizedTrips.slice(start, start + pageSize);

  function go(n:number){ if (n<1||n>totalPages) return; setPage(n); }

  return (
    <section className={`bg-card border border-border rounded-2xl ${className}`}>
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="hidden sm:flex items-baseline gap-1 text-sm text-textmuted" />
      </div>

      <div className="px-4 sm:px-6 pb-3 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((t) => {
            const id = (t._id || t.id || '') as string;
            const days = daysBetween(t.fromDate, t.toDate);
            const km = Number(t.kilometer || 0);
            const bikeName = bikeNameOf(t.bike);
            const img = t.coverImageUrl || PLACEHOLDER;

            return (
              <div
                key={id || `${t.source}-${t.destination}-${t.fromDate}-${t.title}`}
                className="border border-border rounded-2xl p-3 grid grid-cols-[9rem,1fr]"
              >
                {/* image (left column) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  className="h-24 w-36 rounded-lg object-cover col-span-1 row-span-2"
                  alt="trip"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).src = PLACEHOLDER)}
                />

                {/* top meta (right column) */}
                <div className="">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold truncate">{t.title}</h4>
                    <span className="text-xs bg-white/10 rounded-full px-2 py-0.5 whitespace-nowrap">
                      {days}d • {km} km
                    </span>
                  </div>
                  <div className="text-sm text-textmuted mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {niceDateISO(t.fromDate)} - {niceDateISO(t.toDate)}
                  </div>
                  <div className="text-sm text-textmuted mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {t.source} → {t.destination}
                  </div>
                  <div className="text-xs text-textmuted mt-1">
                    Bike: <span className="text-white/80">{bikeName}</span>
                  </div>
                </div>

                {/* DETAILS — full width under image + meta */}
                {!!t.details && (
                  <div className="col-span-2 mt-1.5 max-h-48 overflow-auto pr-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {t.details}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {!items.length && (
            <div className="col-span-full text-sm text-textmuted">No trips to show.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-1.5">
            <button onClick={() => go(current - 1)} disabled={current === 1} className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50">Prev</button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const n = i + 1;
              const active = n === current;
              return (
                <button
                  key={n}
                  onClick={() => go(n)}
                  className={`px-4 py-1.5 rounded-xl ${active ? 'bg-accent text-white' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  {n}
                </button>
              );
            })}
            <button onClick={() => go(current + 1)} disabled={current === totalPages} className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </section>
  );
}
