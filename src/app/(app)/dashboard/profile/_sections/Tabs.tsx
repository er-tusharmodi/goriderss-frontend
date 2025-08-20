'use client';
import { useState } from 'react';

export default function Tabs({
  tabs, defaultTab,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0].id);

  return (
    <>
      <div className="px-4 sm:px-6 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-2xl font-medium ${
                active === t.id ? 'bg-white/10' : 'hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-6">
        {tabs.map(t => (
          <div key={t.id} className={`mt-5 ${active === t.id ? '' : 'hidden'}`}>
            {t.content}
          </div>
        ))}
      </div>
    </>
  );
}
