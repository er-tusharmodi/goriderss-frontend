"use client";

export default function DangerZoneSection({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="bg-white/5 border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Delete Account</div>
          <div className="text-sm text-textmuted">
            This action is irreversible. Your data will be removed.
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
