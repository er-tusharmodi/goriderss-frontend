'use client';

export default function ProfileStats({
  trips = 0,
  posts = 0,
  followers = 0,
  following = 0,
  friends = 0,
  totalDistanceKm = 0,
}: {
  trips?: number; posts?: number; followers?: number; following?: number; friends?: number; totalDistanceKm?: number;
}) {
  const kmFmt = new Intl.NumberFormat().format(totalDistanceKm || 0);

  return (
    <div className="pt-3 px-5 sm:px-6 pb-5">
      {/* 5 stats (Trips/Posts/Followers/Following/Friends) */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        <Stat label="Trips" value={trips} />
        <Stat label="Posts" value={posts} />
        <Stat label="Followers" value={followers} />
        <Stat label="Following" value={following} />
        <Stat label="Friends" value={friends} />
      </div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/5 rounded-2xl px-4 py-3 text-center">
      <div className="text-xl font-bold">{new Intl.NumberFormat().format(value || 0)}</div>
      <div className="text-xs text-textmuted">{label}</div>
    </div>
  );
}
