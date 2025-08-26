'use client';
import { useRef, useState } from 'react';
import { useUI } from '../_store/ui.store';

export default function CreatePostModal() {
  const { createOpen, closeCreate } = useUI();
  const [img, setImg] = useState<string>('https://americanathleticshoe.com/cdn/shop/t/23/assets/placeholder_600x.png?v=113555733946226816651665571258');
  const fileRef = useRef<HTMLInputElement>(null);
  if (!createOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={closeCreate} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg bg-slatebg rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Create Post</h3>
            <button className="p-2 rounded-lg hover:bg-white/10" onClick={closeCreate}>✕</button>
          </div>

          <div className="grid gap-4">
            <div className="grid place-items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} className="h-40 w-40 object-cover rounded" alt="preview"/>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setImg(URL.createObjectURL(f));
                }}/>
              <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 rounded-full bg-accent text-white text-sm">Choose Image</button>
            </div>

            <label className="block text-sm">Caption
              <textarea className="mt-1 w-full bg-transparent border border-border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-accent/50" rows={2} placeholder="Write something..."></textarea>
            </label>

            <div className="flex items-center bg-transparent border border-border rounded-2xl px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
              <input className="bg-transparent w-full outline-none" placeholder="Add Location"/>
            </div>

            <div className="flex items-center bg-transparent border border-border rounded-2xl px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v2H5a2 2 0 00-2 2v2h18V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm14 8H3v10a2 2 0 002 2h14a2 2 0 002-2V10z"/></svg>
              <input type="datetime-local" className="bg-transparent w-full outline-none text-textmuted" />
            </div>
          </div>

          <button className="w-full bg-accent text-white rounded-2xl py-3 font-semibold">Create</button>
        </div>
      </div>
    </div>
  );
}
