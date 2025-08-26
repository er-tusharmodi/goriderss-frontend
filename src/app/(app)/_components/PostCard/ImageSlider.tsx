'use client';

import { useState } from 'react';

export default function ImageSlider({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const total = images?.length ?? 0;

  if (!images || total === 0) {
    return (
      <div className="aspect-[5/5] grid place-items-center bg-white/5 rounded-b-2xl">
        <div className="text-textmuted text-sm">No image</div>
      </div>
    );
  }

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <div className="relative">
      <div className="overflow-hidden aspect-[5/5]">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} className="w-full object-cover shrink-0" alt={`slide-${i}`} />
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            className="prev absolute left-3 top-1/2 -translate-y-1/2 bg-accent/80 hover:bg-accent text-white rounded-full p-2 shadow-soft"
            onClick={prev}
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button
            className="next absolute right-3 top-1/2 -translate-y-1/2 bg-accent/80 hover:bg-accent text-white rounded-full p-2 shadow-soft"
            onClick={next}
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
