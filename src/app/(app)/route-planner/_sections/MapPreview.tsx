"use client";

import { DUMMY_IMG } from "../_data/places";

export default function MapPreview() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="font-semibold">Map Preview</div>
        <div className="text-xs text-textmuted">Replace with your map later</div>
      </div>
      <img src={DUMMY_IMG} alt="map" className="w-full h-56 object-cover" />
    </div>
  );
}
