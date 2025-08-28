"use client";

export default function DangerZoneSection({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Delete Account</div>
          <div className="text-sm text-textmuted">This action is irreversible. Your data will be removed.</div>
        </div>
        <button type="button" onClick={onDelete} className="rounded-xl bg-red-500/90 px-4 py-2 text-white hover:bg-red-500">
          Delete
        </button>
      </div>
    </div>
  );
}
