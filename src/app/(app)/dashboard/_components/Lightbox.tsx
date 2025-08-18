'use client';
import { useEffect, useState } from 'react';

export default function Lightbox() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as { src?: string };
      if (detail?.src) setSrc(detail.src);
    }
    window.addEventListener('gr:openLightbox', handler as EventListener);
    return () => window.removeEventListener('gr:openLightbox', handler as EventListener);
  }, []);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4"
      onClick={() => setSrc(null)}
    >
      <img src={src} alt="story" className="max-h-[90vh] max-w-[90vw] rounded-xl" />
      <button
        className="absolute top-4 right-4 bg-black/60 px-3 py-2 rounded-lg"
        onClick={(e) => { e.stopPropagation(); setSrc(null); }}
      >
        ✕
      </button>
    </div>
  );
}
