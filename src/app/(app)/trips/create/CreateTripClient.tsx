// app/(app)/trips/create/CreateTripClient.tsx
'use client';

import React, { useMemo, useRef, useState } from 'react';

type Checkpoint = {
  title: string;
  description: string;       // multi-line
  km: number | null;
  timeToReach?: string;      // YYYY-MM-DDTHH:MM (datetime-local)
  timeToLeave?: string;      // YYYY-MM-DDTHH:MM (datetime-local)
};

const PLACEHOLDER =
  'https://americanathleticshoe.com/cdn/shop/t/23/assets/placeholder_600x.png?v=113555733946226816651665571258';

type ToastType = 'success' | 'error' | 'info';

// helper: local "now" for <input type="datetime-local" />
function nowLocalForInput(dt?: Date) {
  const d = dt ? new Date(dt) : new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
}

export default function CreateTripClient() {
  const formId = 'create-trip-form';

  const [tripName, setTripName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');  // datetime-local
  const [endDate, setEndDate] = useState('');      // datetime-local
  const [budget, setBudget] = useState<number | ''>('');
  const [isPublic, setIsPublic] = useState(false);
  const [onlyAdminMsg, setOnlyAdminMsg] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [preview, setPreview] = useState(PLACEHOLDER);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ open: boolean; type: ToastType; msg: string }>({
    open: false, type: 'info', msg: '',
  });
  function showToast(type: ToastType, msg: string) {
    setToast({ open: true, type, msg });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast((t) => ({ ...t, open: false })), 3500);
  }

  const fileRef = useRef<HTMLInputElement>(null);

  // checkpoints
  const [cps, setCps] = useState<Checkpoint[]>([]);
  const [cpTitle, setCpTitle] = useState('');
  const [cpKM, setCpKM] = useState<number | ''>('');
  const [cpTR, setCpTR] = useState('');      // Time to Reach (datetime-local)
  const [cpTTL, setCpTTL] = useState('');    // Time to Leave (datetime-local)
  const [cpDesc, setCpDesc] = useState('');  // Description (textarea)

  // min values for date/datetime inputs (no past)
  const nowMin = nowLocalForInput();
  const endMin = startDate || nowMin;
  const reachMin = startDate || nowMin;
  const leaveMin = startDate || nowMin;

  function addCheckpoint() {
    if (!cpTitle.trim()) return;

    // basic guard: datetime not in past / before start
    if (cpTR && cpTR < reachMin) {
      showToast('error', 'Time to Reach cannot be before Start Date.');
      return;
    }
    if (cpTTL && cpTTL < leaveMin) {
      showToast('error', 'Time to Leave cannot be before Start Date.');
      return;
    }

    setCps(prev => [
      ...prev,
      {
        title: cpTitle.trim(),
        description: cpDesc.trim(),
        km: cpKM === '' ? null : Number(cpKM),
        timeToReach: cpTR,
        timeToLeave: cpTTL,
      },
    ]);
    setCpTitle(''); setCpKM(''); setCpTR(''); setCpTTL(''); setCpDesc('');
  }
  function removeCheckpoint(i:number){ setCps(prev=>prev.filter((_,x)=>x!==i)); }
  function onChooseFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if(!f) return;
    setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    // client-side guard for dates
    const now = nowLocalForInput();
    if (startDate && startDate < now) {
      showToast('error', 'Start Date cannot be in the past.');
      return;
    }
    if (endDate && (endDate < (startDate || now))) {
      showToast('error', 'End Date must be after Start Date.');
      return;
    }
    // validate all CPs too
    for (const cp of cps) {
      if (cp.timeToReach && cp.timeToReach < (startDate || now)) {
        showToast('error', `Checkpoint "${cp.title}" — Time to Reach must be after Start Date.`);
        return;
      }
      if (cp.timeToLeave && cp.timeToLeave < (startDate || now)) {
        showToast('error', `Checkpoint "${cp.title}" — Time to Leave must be after Start Date.`);
        return;
      }
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.set('tripName', tripName.trim());
      fd.set('source', source.trim());
      fd.set('destination', destination.trim());
      fd.set('startDate', startDate);
      fd.set('endDate', endDate);
      fd.set('remarks', remarks.trim());
      fd.set('guidelines', guidelines.trim());
      fd.set('budget', String(Number(budget || 0)));
      fd.set('isPublic', String(!!isPublic));
      fd.set('onlyAdminMsg', String(!!onlyAdminMsg));
      const file = fileRef.current?.files?.[0];
      if (file) fd.set('profileImage', file);

      // send checkpoints with timeToReach/timeToLeave (both datetime-local strings)
      fd.set('checkpoints', JSON.stringify(cps));

      const res = await fetch('/api/trips', { method: 'POST', body: fd });
      let data: any = null; try { data = await res.json(); } catch {}

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `Failed (HTTP ${res.status})`;
        showToast('error', msg);
        return;
      }

      const msg = data?.message || 'Trip created successfully!';
      showToast('success', msg);
      handleReset();
    } catch (err: any) {
      showToast('error', err?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setTripName(''); setSource(''); setDestination('');
    setStartDate(''); setEndDate(''); setBudget('');
    setIsPublic(false); setOnlyAdminMsg(false);
    setRemarks(''); setGuidelines(''); setCps([]); setPreview(PLACEHOLDER);
    if(fileRef.current) fileRef.current.value='';
  }

  const hasCP = useMemo(()=>cps.length>0, [cps]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Create Trip</h1>
        </div>

        <form id={formId} onSubmit={onSubmit} className="space-y-6">
          {/* Trip Basics */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm">
                Trip Name
                <input className="field mt-1" placeholder="Goa Ride" value={tripName} onChange={(e)=>setTripName(e.target.value)} />
              </label>

              <label className="block text-sm">
                Profile Image
                <div className="mt-1 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" className="h-12 w-12 rounded object-cover border border-border" />
                  <input ref={fileRef} type="file" accept="image/*" className="field !py-1" onChange={onChooseFile}/>
                </div>
              </label>

              <label className="block text-sm">
                Source
                <input className="field mt-1" placeholder="Jaipur" value={source} onChange={(e)=>setSource(e.target.value)} />
              </label>

              <label className="block text-sm">
                Destination
                <input className="field mt-1" placeholder="Udaipur" value={destination} onChange={(e)=>setDestination(e.target.value)} />
              </label>

              <label className="block text-sm">
                Start Date
                <input
                  type="datetime-local"
                  className="field mt-1 text-textmuted"
                  min={nowMin}
                  value={startDate}
                  onChange={(e)=>setStartDate(e.target.value)}
                />
              </label>

              <label className="block text-sm">
                End Date
                <input
                  type="datetime-local"
                  className="field mt-1 text-textmuted"
                  min={endMin}
                  value={endDate}
                  onChange={(e)=>setEndDate(e.target.value)}
                />
              </label>
            </div>

            {/* Budget + both toggles in ONE line */}
            <div className="grid grid-cols-1 gap-4">
              <label className="block text-sm">
                Budget (₹)
                <input
                  type="number"
                  min={0}
                  className="field mt-1"
                  placeholder="5000"
                  value={budget}
                  onChange={(e)=>setBudget(e.target.value===''?'':Number(e.target.value))}
                />
              </label>

              <div className="flex items-center gap-8">
                {/* Public Trip */}
                <label className="inline-flex items-center gap-3 text-sm select-none">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <span
                    className="w-11 h-6 rounded-full bg-white/10 relative transition-colors
                               peer-checked:bg-[#F25C2A]
                               after:content-[''] after:absolute after:top-0.5 after:left-0.5
                               after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform
                               peer-checked:after:translate-x-5"
                  />
                  <span>Public Trip</span>
                </label>

                {/* Only Admin Can Message */}
                <label className="inline-flex items-center gap-3 text-sm select-none">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={onlyAdminMsg}
                    onChange={(e) => setOnlyAdminMsg(e.target.checked)}
                  />
                  <span
                    className="w-11 h-6 rounded-full bg-white/10 relative transition-colors
                               peer-checked:bg-[#F25C2A]
                               after:content-[''] after:absolute after:top-0.5 after:left-0.5
                               after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform
                               peer-checked:after:translate-x-5"
                  />
                  <span>Only Admin Can Message</span>
                </label>
              </div>
            </div>

            <label className="block text-sm">
              Remarks
              <textarea rows={6} className="field mt-1" placeholder="Anything important..." value={remarks} onChange={(e)=>setRemarks(e.target.value)} />
            </label>

            <label className="block text-sm">
              Guidelines
              <textarea rows={6} className="field mt-1" placeholder="Helmet, documents, ..." value={guidelines} onChange={(e)=>setGuidelines(e.target.value)} />
            </label>
          </div>

          {/* Checkpoints */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Checkpoints</h3>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="cp min-w-[900px]">
                <thead>
                  <tr>
                    <th className="text-left">Title</th>
                    <th className="text-left">KM</th>
                    <th className="text-left">Time to Reach</th>
                    <th className="text-left">Time to Leave</th>
                    <th className="text-left">Description</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hasCP ? cps.map((cp, i)=>(
                    <tr key={i}>
                      <td>{cp.title || '-'}</td>
                      <td>{cp.km ?? '-'}</td>
                      <td className="whitespace-nowrap">
                        {cp.timeToReach ? new Date(cp.timeToReach).toLocaleString() : '-'}
                      </td>
                      <td className="whitespace-nowrap">
                        {cp.timeToLeave ? new Date(cp.timeToLeave).toLocaleString() : '-'}
                      </td>
                      <td className="max-w-[520px] truncate">{cp.description || '-'}</td>
                      <td className="text-right">
                        <button type="button" onClick={()=>removeCheckpoint(i)} className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-sm">Remove</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="text-sm text-textmuted text-center py-3">No checkpoints added yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* row 1 (upper): Title | KM | Time to Reach (datetime) | Time to Leave (datetime) */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <label className="block text-sm md:col-span-2">
                Title
                <input className="field mt-1" placeholder="Checkpoint title" value={cpTitle} onChange={(e)=>setCpTitle(e.target.value)} />
              </label>
              <label className="block text-sm md:col-span-1">
                KM
                <input type="number" className="field mt-1" placeholder="KM" value={cpKM} onChange={(e)=>setCpKM(e.target.value===''?'':Number(e.target.value))} />
              </label>
              <label className="block text-sm md:col-span-1">
                Time to Reach
                <input
                  type="datetime-local"
                  className="field mt-1 text-textmuted"
                  min={reachMin}
                  value={cpTR}
                  onChange={(e)=>setCpTR(e.target.value)}
                />
              </label>
              <label className="block text-sm md:col-span-1">
                Time to Leave
                <input
                  type="datetime-local"
                  className="field mt-1 text-textmuted"
                  min={leaveMin}
                  value={cpTTL}
                  onChange={(e)=>setCpTTL(e.target.value)}
                />
              </label>
            </div>

            {/* row 2 (lower): ONLY Description (taller) + Add */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <label className="block text-sm md:col-span-5">
                Description
                <textarea
                  rows={4}
                  className="field mt-1"
                  placeholder="Add a note about this checkpoint..."
                  value={cpDesc}
                  onChange={(e)=>setCpDesc(e.target.value)}
                />
              </label>

              <div className="md:col-span-1 flex items-end justify-center">
                <button type="button" onClick={addCheckpoint} className="w-full px-4 py-3 mb-2 rounded-xl bg-accent text-white">+ Add</button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky floating actions (bottom-right, inline, above toast) */}
      <div className="fixed right-6 bottom-24 z-[120] flex items-center gap-3">
        <button
          type="submit"
          form={formId}
          disabled={submitting}
          className="bg-accent text-white rounded-2xl px-5 py-2.5 font-semibold shadow-lg disabled:opacity-60"
          title="Create Trip"
        >
          {submitting ? 'Creating…' : 'Create Trip'}
        </button>
        {/* <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-2xl border border-border bg-card/70 backdrop-blur shadow-lg"
          title="Reset Form"
        >
          Reset
        </button> */}
      </div>

      {/* Toast (bottom-center) */}
      <Toast
        open={toast.open}
        type={toast.type}
        msg={toast.msg}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </>
  );
}

/* ---------------- Toast Component (bottom-center sticky) ---------------- */
function Toast({
  open,
  type,
  msg,
  onClose,
}: {
  open: boolean;
  type: 'success' | 'error' | 'info';
  msg: string;
  onClose: () => void;
}) {
  const tone =
    type === 'success'
      ? 'text-green-400 border-green-500/30'
      : type === 'error'
      ? 'text-red-400 border-red-500/30'
      : 'text-white border-white/20';

  const dot =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-white';

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-[100] transition-all duration-200 ${
        open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      aria-live="polite"
      role="status"
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-slatebg/95 border ${tone} shadow-soft`}>
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <span className="text-sm">{msg}</span>
        <button
          onClick={onClose}
          className="ml-2 text-textmuted hover:text-white text-sm"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
