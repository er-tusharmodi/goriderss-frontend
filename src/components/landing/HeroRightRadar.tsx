// components/HeroRightRadar.tsx
export default function HeroRightRadar() {
  const pins = [
    { x: 54,  y: 42,  label: "Meet"   },
    { x: 120, y: 86,  label: "Fuel"   },
    { x: 200, y: 60,  label: "Scenic" },
    { x: 260, y: 110, label: "Finish" },
  ];
  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl p-5 shadow-2xl">
      <div className="pointer-events-none absolute -right-12 -top-8 h-72 w-72 rounded-full
                      bg-[radial-gradient(closest-side,rgba(239,85,44,0.22),transparent_70%)]" />
      <svg viewBox="0 0 300 180" className="block w-full h-[300px]">
        {/* grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="300" height="180" fill="url(#grid)" />
        {/* circles */}
        {[40, 70, 100].map((r) => (
          <circle key={r} cx="150" cy="90" r={r} stroke="rgba(255,255,255,0.12)" fill="none" />
        ))}
        {/* sweeping arc */}
        <g transform="translate(150,90)">
          <path d="M0 0 L100 0 A100 100 0 0 1 0 100 Z" fill="rgba(239,85,44,0.12)" className="animate-sweep origin-center" />
        </g>
        {/* route */}
        <path d="M20,150 C80,120 120,100 160,85 195,72 230,60 280,50"
              stroke="rgba(239,85,44,0.9)" strokeWidth="4" fill="none" />
        <path d="M20,150 C80,120 120,100 160,85 195,72 230,60 280,50"
              stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeDasharray="6 8" className="animate-dash" />
        {/* pins */}
        {pins.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="10" fill="none" stroke="rgba(239,85,44,0.35)" />
            <circle cx={p.x} cy={p.y} r="5"  fill="rgba(239,85,44,1)" />
            <circle cx={p.x} cy={p.y} r="5"  className="animate-ping" fill="rgba(239,85,44,0.45)" />
            <text x={p.x + 12} y={p.y + 4} fontSize="11" fill="rgba(255,255,255,0.9)">{p.label}</text>
          </g>
        ))}
      </svg>

      {/* chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {["Live share","Waypoints","Offline","Helpers","SOS"].map(t => (
          <span key={t} className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-white/85 backdrop-blur">{t}</span>
        ))}
      </div>
    </div>
  );
}
