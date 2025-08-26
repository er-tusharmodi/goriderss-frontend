"use client";

export default function HelpSupportSection() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-white/5 border border-border rounded-xl p-4">
        <div className="font-medium">FAQs</div>
        <p className="text-sm text-textmuted mt-1">Quick answers to common questions.</p>
        <button className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15">
          Open
        </button>
      </div>
      <div className="bg-white/5 border border-border rounded-xl p-4">
        <div className="font-medium">Contact Support</div>
        <p className="text-sm text-textmuted mt-1">We usually reply within 24 hours.</p>
        <button className="mt-3 px-3 py-1.5 rounded-lg bg-accent text-white">Create Ticket</button>
      </div>
    </div>
  );
}
