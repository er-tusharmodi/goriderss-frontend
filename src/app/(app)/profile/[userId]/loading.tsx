export default function LoadingProfile() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="h-40 sm:h-56 bg-white/5 animate-pulse" />
        <div className="p-4 border-t border-border">
          <div className="h-9 w-40 bg-white/10 rounded-full animate-pulse" />
        </div>
      </section>
      <section className="bg-card border border-border rounded-2xl p-4">
        <div className="h-6 w-32 bg-white/10 rounded-md animate-pulse mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-20 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-20 bg-white/5 rounded-xl animate-pulse" />
        </div>
      </section>
    </div>
  );
}
