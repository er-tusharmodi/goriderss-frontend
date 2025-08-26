'use client';

export default function AboutPanel({
  address,
  experienceYears,
  username,
  email,
  mobile,
  bikes = [],
  summary,
}: {
  address?: string;
  experienceYears?: number;
  username?: string;
  email?: string;
  mobile?: string;
  bikes?: { name: string; meta?: string; imageUrl?: string }[];
  summary?: { completedTrips?: number; totalDistanceKm?: number; statesCovered?: number };
}) {
  // ❌ default bikes removed – only API data will render
  const bikesShown = Array.isArray(bikes) ? bikes : [];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left: Contact & Basics */}
      <div className="lg:col-span-2 space-y-4">
        <div className="border border-border rounded-2xl p-4">
          <h3 className="font-semibold mb-3">About</h3>
          <div className="space-y-2 text-sm">
            <Row icon="M12 2C8.13 2 5 5.1 5 8.95c0 5.54 7 12.1 7 12.1s7-6.56 7-12.1C19 5.1 15.87 2 12 2zm0 9.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z" label="Address" value={address || '—'} />
            <Row icon="M20 4H4v2h16V4zM4 9h16v11H4V9z" label="Experience" value={`${Number(experienceYears || 0)} years riding`} />
            <Row icon="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5zM2 20c0-3.33 6.67-5.16 10-5.16S22 16.67 22 20v2H2v-2z" label="Username" value={username || '—'} />
            <Row icon="M20 4H4v16h16V4zM6 8h12v2H6V8zm0 4h12v2H6v-2z" label="Email" value={email || '—'} />
            <Row icon="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.6.7 4 .7.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.7 21 3 12.3 3 2c0-.6.4-1 1-1h2.4c.6 0 1 .4 1 1 0 1.4.3 2.8.7 4 .1.4 0 .8-.3 1.1l-2.2 2.2z" label="Mobile" value={mobile || '—'} />
          </div>
        </div>

        <div className="border border-border rounded-2xl p-4">
          <h3 className="font-semibold mb-3">Bikes</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {bikesShown.map((b, i) => (
              <BikeCard key={i} name={b.name} meta={b.meta || ''} />
            ))}
          </div>
        </div>

        <div className="border border-border rounded-2xl p-4">
          <h3 className="font-semibold mb-3">Trips Summary</h3>
          <div className="space-y-2 text-sm">
            <KV k="Completed Trips" v={String(summary?.completedTrips ?? 0)} />
            <KV k="Total Distance Covered" v={`${summary?.totalDistanceKm ?? 0} km`} />
            <KV k="States Covered" v={String(summary?.statesCovered ?? 0)} />
          </div>
        </div>
      </div>

      {/* Right: Quick Links / Badges (unchanged) */}
      <div className="space-y-4">
        <div className="border border-border rounded-2xl p-4">
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <div className="space-y-2">
            <a href="#" className="block bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 text-sm">View All Trips</a>
            <a href="#" className="block bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 text-sm">Ride Portfolio</a>
            <a href="#" className="block bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 text-sm">Edit Profile</a>
          </div>
        </div>
        <div className="border border-border rounded-2xl p-4">
          <h3 className="font-semibold mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className="chip">Night Rider</span>
            <span className="chip">1000+ km</span>
            <span className="chip">Monsoon Master</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d={icon}/>
      </svg>
      <span>{label}: <span className="text-white">{value}</span></span>
    </div>
  );
}

function BikeCard({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="border border-border rounded-xl p-3 flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" className="h-16 w-24 rounded-lg object-cover" alt="bike" />
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-textmuted">{meta}</div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{k}</span><span className="text-white font-medium">{v}</span>
    </div>
  );
}
