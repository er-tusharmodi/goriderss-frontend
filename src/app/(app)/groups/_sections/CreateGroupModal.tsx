"use client";

import * as React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (p: { name: string; desc: string; privacy: "public" | "private" }) => void;
};

export default function CreateGroupModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [privacy, setPrivacy] = React.useState<"public" | "private">("private");

  React.useEffect(() => {
    if (!open) return;
    setName("");
    setDesc("");
    setPrivacy("private");
  }, [open]);

  if (!open) return null;

  return (
    <div id="createWrap" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-w-xl mx-auto mt-16 bg-card border border-border rounded-2xl p-5 sm:p-6">
        <div className="flex items-center">
          <div className="text-lg font-semibold">Create Group</div>
          <button onClick={onClose} className="ml-auto p-2 rounded-2xl hover:bg-white/10">✕</button>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-textmuted text-sm">Group Name</span>
            <input className="field mt-1" placeholder="Weekend Riders" value={name} onChange={(e)=>setName(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-textmuted text-sm">Privacy</span>
            <select className="field mt-1" value={privacy} onChange={(e)=>setPrivacy(e.target.value as any)}>
              <option className="bg-slatebg" value="public">Public</option>
              <option className="bg-slatebg" value="private">Private</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-textmuted text-sm">Description</span>
            <textarea className="field mt-1" rows={3} placeholder="What is this group about?" value={desc} onChange={(e)=>setDesc(e.target.value)} />
          </label>

          {/* File inputs are decorative here */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-textmuted text-sm">Cover Image</span>
              <input type="file" accept="image/*" className="mt-1 block w-full text-sm" />
            </label>
            <label className="block">
              <span className="text-textmuted text-sm">Avatar</span>
              <input type="file" accept="image/*" className="mt-1 block w-full text-sm" />
            </label>
          </div>

          <div className="sm:col-span-2">
            <span className="text-textmuted text-sm">Add Members (demo)</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <button className="chip">Anushka</button>
              <button className="chip">Karan</button>
              <button className="chip">Raj</button>
              <button className="chip">Vikram</button>
              <button className="chip">Isha</button>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 sm:col-span-2 mt-2">
            <input type="checkbox" className="toggle-orange" defaultChecked />
            <span className="text-sm text-textmuted">Generate invite link</span>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-2xl px-4 py-2 bg-white/5 border border-border hover:bg-white/10">
            Cancel
          </button>
          <button
            onClick={() => onCreate({ name: name.trim(), desc: desc.trim(), privacy })}
            className="rounded-2xl px-5 py-2 bg-accent text-white font-semibold"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
