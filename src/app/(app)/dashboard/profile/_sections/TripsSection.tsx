'use client';
import { useState } from 'react';

export default function TripsSection() {
  const [page, setPage] = useState<1 | 2>(1);

  return (
    <>
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Trips</h3>
        <div className="hidden sm:flex items-baseline gap-1 text-sm text-textmuted" />
      </div>

      <div className="px-4 sm:px-6 pb-4 space-y-4">
        {/* Page 1 */}
        <div className={page === 1 ? 'grid sm:grid-cols-2 gap-4' : 'hidden'} data-page="1">
          {Array.from({ length: 4 }).map((_, i) => (
            <TripCard key={`p1-${i}`} title={i % 2 ? 'Desert Trail Sam' : 'Udaipur Weekend Sprint'} />
          ))}
        </div>

        {/* Page 2 */}
        <div className={page === 2 ? 'grid sm:grid-cols-2 gap-4' : 'hidden'} data-page="2">
          <TripCard title="Aravalli Morning Loop" meta="1d • 160 km" sub="Jaipur ring • 02 Aug 2025" chips={['Breakfast Halt', 'View Point']} />
          <TripCard title="Bundi Fort Ride" meta="1d • 230 km" sub="Jaipur → Bundi • 19 Jul 2025" chips={['Tea Stop', 'Fort Walk']} />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => (p === 1 ? 1 : 2 as 1))}
                  className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10">Prev</button>
          <button onClick={() => setPage(1)}
                  className={`px-4 py-1.5 rounded-xl ${page===1?'bg-accent text-white':'bg-white/5 hover:bg-white/10'}`}>1</button>
          <button onClick={() => setPage(2)}
                  className={`px-4 py-1.5 rounded-xl ${page===2?'bg-accent text-white':'bg-white/5 hover:bg-white/10'}`}>2</button>
          <button onClick={() => setPage(p => (p === 2 ? 2 : 2))}
                  className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10">Next</button>
        </div>
      </div>
    </>
  );
}

function TripCard({
  title,
  meta = '2d • 420 km',
  sub = 'Jaipur → Udaipur • 12 Aug 2025 - 14 Aug 2025',
  chips = ['Fuel x3', 'Lunch @ Rajsamand', 'Fateh Sagar'],
}: { title: string; meta?: string; sub?: string; chips?: string[] }) {
  return (
    <div className="border border-border rounded-2xl p-4 flex items-start gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" className="h-20 w-28 rounded-lg object-cover" alt="trip" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-semibold">{title}</h4>
          <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">{meta}</span>
        </div>
        <div className="text-sm text-textmuted mt-1">{sub}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map(c => <span key={c} className="chip">{c}</span>)}
        </div>
      </div>
    </div>
  );
}
