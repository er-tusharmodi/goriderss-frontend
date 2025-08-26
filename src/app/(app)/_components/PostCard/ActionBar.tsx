'use client';

import { useState } from 'react';

export default function ActionBar({ liked = false }: { liked?: boolean }) {
  const [isLiked, setIsLiked] = useState(!!liked);

  return (
    <div className="flex items-center gap-3 text-xl">
      <button
        className="like"
        title="Like"
        onClick={() => setIsLiked((v) => !v)}
        aria-pressed={isLiked}
      >
        {isLiked ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 fill-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.5 2.09C12.09 5 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.5 2.09C12.09 5 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        )}
      </button>

      <button title="Comment" aria-label="Comment">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 6h-18v10h4v4l6-4h8z"/>
        </svg>
      </button>

      <button title="Share" aria-label="Share">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 12l16-8-8 16-1-7z"/>
        </svg>
      </button>
    </div>
  );
}
