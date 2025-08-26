import Image from "next/image";

interface Story { id: string; image: string; name: string; }

export default function StoriesStrip({ items }: { items: Story[] }) {
  function openViaEvent(src: string) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gr:openLightbox', { detail: { src } }));
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-3 flex gap-2 overflow-x-auto no-scrollbar">
      {items.map((s) => (
        <button
          key={s.id}
          className="flex flex-col items-center min-w-[70px] group cursor-pointer"
          onClick={() => openViaEvent(s.image)}
          type="button"
        >
          <div className="h-24 w-16 rounded-lg overflow-hidden border-2 border-[var(--color-accent)] group-hover:scale-105 transition">
            <Image src={s.image} alt={s.name} width={100} height={120} className="h-full w-full object-cover" unoptimized />
          </div>
          <span className="text-xs text-textmuted mt-2">{s.name}</span>
        </button>
      ))}
    </div>
  );
}
