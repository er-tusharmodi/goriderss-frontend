'use client';

import React from 'react';

/* eslint-disable @next/next/no-img-element */

type Trip = {
  _id?: string;
  fromDate: string;
  toDate: string;
  source: string;
  destination: string;
  kilometer?: number;
  details?: string;
  coverImageUrl?: string;
  bike?: { _id?: string; bikeName?: string };
};

const PLACEHOLDER = '/assets/dummyUser.png';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function niceDateUTC(iso?: string) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = MONTHS[d.getUTCMonth()];
    const yyyy = d.getUTCFullYear();
    return `${dd} ${mm} ${yyyy}`;
  } catch { return (iso || '').slice(0, 10); }
}
function daysBetweenUTC(a: string, b: string) {
  const A = Date.UTC(
    new Date(a).getUTCFullYear(),
    new Date(a).getUTCMonth(),
    new Date(a).getUTCDate()
  );
  const B = Date.UTC(
    new Date(b).getUTCFullYear(),
    new Date(b).getUTCMonth(),
    new Date(b).getUTCDate()
  );
  return Math.max(1, Math.round((B - A) / 86400000) + 1);
}

function buildDummy(): Trip[] {
  return [
    {
      fromDate: '2025-08-02T00:00:00.000Z',
      toDate: '2025-08-03T00:00:00.000Z',
      source: 'Jaipur',
      destination: 'Udaipur',
      kilometer: 420,
      details: 'Fuel x3 • Lunch @ Rajsamand • Fateh Sagar',
      coverImageUrl: PLACEHOLDER,
      bike: { bikeName: 'XPulse' },
    },
    {
      fromDate: '2025-07-22T00:00:00.000Z',
      toDate: '2025-07-22T00:00:00.000Z',
      source: 'Jaisalmer',
      destination: 'Sam Dunes',
      kilometer: 280,
      details: 'Dunes • Night camp',
      coverImageUrl: PLACEHOLDER,
      bike: { bikeName: 'XPulse' },
    },
    {
      fromDate: '2025-08-14T00:00:00.000Z',
      toDate: '2025-08-19T00:00:00.000Z',
      source: 'Jaipur',
      destination: 'Bundi',
      kilometer: 230,
      details: 'Tea Stop • Fort Walk',
      coverImageUrl: PLACEHOLDER,
      bike: { bikeName: 'CB350' },
    },
    {
      fromDate: '2025-08-02T00:00:00.000Z',
      toDate: '2025-08-02T00:00:00.000Z',
      source: 'Jaipur Ring',
      destination: 'Aravalli Loop',
      kilometer: 160,
      details: 'Breakfast Halt • View Point',
      coverImageUrl: PLACEHOLDER,
      bike: { bikeName: 'XPulse' },
    },
  ];
}

function chipsFromDetails(details?: string) {
  if (!details) return [] as string[];
  return details.split(/[•,|]/g).map(s => s.trim()).filter(Boolean).slice(0, 6);
}

export default function TripsSection({
  trips,
  pageSize = 4,
}: {
  trips: Trip[] | undefined;
  pageSize?: number;
}) {
  const list = Array.isArray(trips) && trips.length ? trips : buildDummy();

  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize);

  function go(n: number) {
    if (n < 1 || n > totalPages) return;
    setPage(n);
  }

  return (
    <section className="bg-card border border-border rounded-2xl">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Trips</h3>
      </div>

      <div className="px-4 sm:px-6 pb-4 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((t, i) => {
            const id = t._id || `${t.source}-${t.destination}-${t.fromDate}-${i}`;
            const d = daysBetweenUTC(t.fromDate, t.toDate);
            const km = Number(t.kilometer || 0);
            const chips = chipsFromDetails(t.details);
            const img = t.coverImageUrl || PLACEHOLDER;
            const dateLine = `${niceDateUTC(t.fromDate)} – ${niceDateUTC(t.toDate)}`;
            const title = `${t.source} → ${t.destination}`;

            return (
              <article
                key={id}
                className="border border-border rounded-2xl p-4 flex items-start gap-4"
              >
                <img
                  src={img}
                  alt=""
                  className="h-20 w-28 rounded-lg object-cover bg-white/10 flex-shrink-0"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).src = PLACEHOLDER)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold truncate max-w-full">{title}</h4>
                    <span className="text-xs bg-white/10 rounded-full px-2 py-0.5 whitespace-nowrap">
                      {d}d • {km} km
                    </span>
                  </div>
                  <div className="text-sm text-textmuted mt-1 truncate">
                    {dateLine}
                  </div>
                  {!!chips.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {chips.map((c, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white/10 rounded-full px-2 py-0.5 max-w-[160px] truncate"
                          title={c}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* bike line */}
                  {!!t?.bike?.bikeName && (
                    <div className="text-xs text-textmuted mt-1">
                      Bike: <span className="text-white/80">{t.bike.bikeName}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => go(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const n = i + 1;
              const active = n === page;
              return (
                <button
                  key={n}
                  onClick={() => go(n)}
                  className={`px-3 py-1.5 rounded-xl ${
                    active ? 'bg-accent text-white' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => go(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
