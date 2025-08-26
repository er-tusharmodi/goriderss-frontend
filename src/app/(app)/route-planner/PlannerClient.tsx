"use client";

import { useMemo, useRef, useState } from "react";
import type { Checkpoint, PlannerInputs, Suggestion } from "./types";
import { PLACES, DUMMY_IMG } from "./_data/places";
import HeaderBar from "./_sections/HeaderBar";
import DefineRoute from "./_sections/DefineRoute";
import MapPreview from "./_sections/MapPreview";
import Suggestions from "./_sections/Suggestions";
import PlanList from "./_sections/PlanList";
import EditModal from "./_sections/EditModal";
import StatCards from "./_sections/StatCards";

const toRad = (x: number) => (x * Math.PI) / 180;
function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.asin(Math.sqrt(s)));
}
function etaMinutes(km: number, pace: PlannerInputs["pace"]) {
  const speed = pace === "fast" ? 65 : pace === "relaxed" ? 45 : 55; // km/h
  return Math.round((km / speed) * 60);
}

/** de-dupe helper for suggestions */
function isSameSuggestion(a: Suggestion, b: Suggestion) {
  return (
    a.title === b.title &&
    a.km === b.km &&
    a.timeToReach === b.timeToReach &&
    (a.details || "") === (b.details || "")
  );
}

export default function PlannerClient() {
  const [inputs, setInputs] = useState<PlannerInputs>({
    from: "Jaipur",
    to: "Udaipur",
    start: "",
    pace: "normal",
    maxLeg: 180,
    prefer: "fastest",
    avoidHighways: false,
    fuelEvery150: true,
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [plan, setPlan] = useState<Checkpoint[]>([]);
  const editIndex = useRef<number | null>(null);
  const [editing, setEditing] = useState<Checkpoint | null>(null);

  const stats = useMemo(() => {
    const km = plan.reduce((a, c) => a + (Number(c.km) || 0), 0);
    const minutes = plan.reduce((a, c) => a + (Number(c.timeToReach) || 0), 0);
    return { km, minutes, stops: plan.length };
  }, [plan]);

  function generateAI() {
    const src = inputs.from.trim();
    const dst = inputs.to.trim();
    const legMax = Math.max(60, Math.min(600, Number(inputs.maxLeg) || 180));
    const pc = inputs.pace;

    if (!PLACES[src] || !PLACES[dst]) {
      setSuggestions([
        {
          title: "Midpoint Fuel & Food",
          description: "Balanced break with reliable pumps and dhabas.",
          km: 150,
          timeToReach: etaMinutes(150, pc),
          details: "Fuel • Lunch • Rest",
          highlights: ["Clean restrooms", "Tea point"],
          photo: DUMMY_IMG,
        },
        {
          title: "Scenic Viewpoint",
          description: "Short detour to a nice sunset ridge.",
          km: 110,
          timeToReach: etaMinutes(110, pc),
          details: "Photos • Hydration",
          highlights: ["Sunset spot", "Open fields"],
          photo: DUMMY_IMG,
        },
      ]);
      return;
    }

    if (src === "Jaipur" && dst === "Udaipur") {
      const path = ["Jaipur", "Kishangarh", "Ajmer", "Beawar", "Rajsamand", "Udaipur"];
      const legs: Suggestion[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        const a = PLACES[path[i]], b = PLACES[path[i + 1]];
        const km = haversine(a, b);
        const city = path[i + 1];
        const hl = PLACES[city].highlights || [];
        legs.push({
          title: city,
          description: `Good stop between ${path[i]} → ${path[i + 1]}`,
          km,
          timeToReach: etaMinutes(km, pc),
          details: i === 1 ? "Food Street • Fuel" : i === 3 ? "Fuel • Lake View" : "Break • Hydration",
          highlights: hl.slice(0, 3),
          photo: DUMMY_IMG,
        });
      }
      const filtered = legs.filter((l) => l.km <= legMax);
      setSuggestions(filtered.length ? filtered : legs);
      return;
    }

    const a = PLACES[src], b = PLACES[dst];
    const total = haversine(a, b);
    const midKm = Math.round(total / 2);
    setSuggestions([
      {
        title: "Suggested Midpoint",
        description: `Halfway break between ${src} and ${dst}.`,
        km: midKm,
        timeToReach: etaMinutes(midKm, inputs.pace),
        details: "Fuel • Snacks • Stretch",
        highlights: ["Cafe", "Local point"],
        photo: DUMMY_IMG,
      },
    ]);
  }

  /** Accept (index) → plan me add + suggestions se delete */
  function acceptSuggestion(idx: number) {
    const s = suggestions[idx];
    if (!s) return;

    const chk: Checkpoint = {
      title: s.title,
      description: s.description || "",
      dateTime: inputs.start || "",
      km: s.km,
      timeToReach: s.timeToReach,
      details: s.details || "",
      highlights: s.highlights || [],
      photo: s.photo || DUMMY_IMG,
    };
    setPlan((p) => [...p, chk]);
    setSuggestions((prev) => prev.filter((_, i) => i !== idx));
  }

  /** Accept All → once append, then clear */
  function acceptAll() {
    if (!suggestions.length) return;
    const mapped: Checkpoint[] = suggestions.map((s) => ({
      title: s.title,
      description: s.description || "",
      dateTime: inputs.start || "",
      km: s.km,
      timeToReach: s.timeToReach,
      details: s.details || "",
      highlights: s.highlights || [],
      photo: s.photo || DUMMY_IMG,
    }));
    setPlan((p) => [...p, ...mapped]);
    setSuggestions([]);
  }

  /**
   * Remove from plan → suggestion list me wapas add (deterministic)
   * NOTE: yahan "removed" ko directly current `plan` se nikaal rahe hain,
   * updater ke andar side-effect nahi kar rahe—StrictMode safe.
   */
  function removeCheckpoint(i: number) {
    const removed = plan[i];
    setPlan((prev) => prev.filter((_, idx) => idx !== i));

    if (removed) {
      const back: Suggestion = {
        title: removed.title,
        description: removed.description,
        km: removed.km,
        timeToReach: removed.timeToReach,
        details: removed.details,
        highlights: removed.highlights,
        photo: removed.photo,
      };
      setSuggestions((sugs) => {
        // de-dupe guard
        if (sugs.some((x) => isSameSuggestion(x, back))) return sugs;
        return [back, ...sugs]; // top pe dikhane ke liye front insert
      });
    }
  }

  function startEdit(i: number) {
    editIndex.current = i;
    setEditing(plan[i]);
  }

  function saveEdit(updated: Checkpoint) {
    if (editIndex.current == null) return;
    setPlan((p) => p.map((c, i) => (i === editIndex.current ? updated : c)));
    setEditing(null);
    editIndex.current = null;
  }

  function addManual() {
    setPlan((p) => [
      ...p,
      {
        title: "Custom Stop",
        description: "Write details…",
        dateTime: "",
        km: 0,
        timeToReach: 0,
        details: "",
        highlights: [],
        photo: DUMMY_IMG,
      },
    ]);
  }

  function copyJSON() {
    const txt = JSON.stringify({ ...inputs, plan }, null, 2);
    navigator.clipboard.writeText(txt);
  }

  function clearAll() {
    setSuggestions([]);
    setPlan([]);
  }

  function reorder(from: number, to: number) {
    setPlan((p) => {
      const arr = p.slice();
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
  }

  return (
    <div className="space-y-6">
      <HeaderBar onCopy={copyJSON} onClear={clearAll} />
      <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-4">
        <DefineRoute
          value={inputs}
          onChange={(patch) => setInputs((v) => ({ ...v, ...patch }))}
          onGenerate={generateAI}
          onAddManual={addManual}
        >
          <StatCards km={stats.km} minutes={stats.minutes} stops={stats.stops} />
        </DefineRoute>

        <section className="space-y-4">
          <MapPreview />
          <Suggestions
            items={suggestions}
            onAccept={(idx) => acceptSuggestion(idx)}
            onSkip={(idx) => setSuggestions((s) => s.filter((_, i) => i !== idx))}
            onAcceptAll={acceptAll}
          />
          <PlanList items={plan} onRemove={removeCheckpoint} onEdit={startEdit} onReorder={reorder} />
        </section>
      </div>

      <EditModal open={!!editing} value={editing || undefined} onClose={() => setEditing(null)} onSave={saveEdit} />
    </div>
  );
}
