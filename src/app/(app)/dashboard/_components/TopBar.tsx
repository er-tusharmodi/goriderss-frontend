'use client';
import { useUI } from '../_store/ui.store';

export default function CreateBox() {
  const { openCreate } = useUI();
  return (
    <main className="lg:ml-72">
        <div className="hidden lg:block sticky top-0 z-30 bg-slatebg/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <div className="flex items-center bg-card border border-border rounded-2xl px-4 py-2.5 w-full">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
                className="bg-transparent w-full outline-none placeholder:text-textmuted"
                placeholder="Search riders, trips, helpers…"
            />
            </div>
            <button
            id="btnCreateTop"
            className="bg-accent text-white rounded-2xl px-5 py-2.5 font-medium whitespace-nowrap"
            >
            Create Post
            </button>
        </div>
        </div>
        </main>
  );
}
