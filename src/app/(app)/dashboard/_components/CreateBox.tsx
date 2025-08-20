'use client';
import { useUI } from '../_store/ui.store';

export default function CreateBox() {
  const { openCreate } = useUI();
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <img src="/assets/dummyUser.png" className="h-10 w-10 rounded-full" alt="me"/>
        <input placeholder="What's on your mind, TuSharthi?" className="flex-1 bg-transparent border border-border rounded-xl px-4 py-2 outline-none"/>
        <button className="bg-accent text-white text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap" onClick={openCreate}>Create</button>
      </div>
    </div>
  );
}
