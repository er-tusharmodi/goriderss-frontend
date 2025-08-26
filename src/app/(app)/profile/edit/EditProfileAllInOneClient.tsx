'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import {
  updateUserAction,
  updateAvatarAction,
  updateCoverAction,
  requestChangeEmailAction,
  verifyChangeEmailOtpAction,
} from './actions';
import BikesSection, { Bike } from './_sections/BikesSection';
import RidingPortfolioSection, { Trip } from './_sections/RidingPortfolioSection';
import RidingPortfolioListSection from './_sections/RidingPortfolioListSection';

type User = {
  userName: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  emailDisplay?: boolean;
  mobileNumberDisplay?: boolean;
  dob?: string;
  sex?: string;
  bloodGroup?: string;
  healthHistory?: string;
  address?: string;
  bio?: string;
  instagramLink?: string;
  youtubeLink?: string;
  linkedinLink?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
};

const MAX_UPLOAD_MB = 10;
const ENABLE_DOWNSCALE = true;

// ---------- cache-bust helpers ----------
const BUST_KEY = 'gr_img_bust';
const dummyAvatar = '/assets/dummyUser.png';

function getBust() { try { return localStorage.getItem(BUST_KEY) || ''; } catch { return ''; } }
function withBust(u?: string) {
  if (!u) return '';
  const b = typeof window !== 'undefined' ? getBust() : '';
  return u + (u.includes('?') ? '&v=' : '?v=') + (b || '0');
}
function setNewBust() { try { localStorage.setItem(BUST_KEY, String(Date.now())); } catch {} }

function pickFirstUrl(obj: any, keys: string[]) {
  for (const k of keys) {
    const v = k.split('.').reduce((o, kk) => (o ? (o as any)[kk] : undefined), obj as any);
    if (typeof v === 'string' && v) return v;
  }
  return '';
}

type ToastType = 'success' | 'error' | 'info';

export default function EditProfileAllInOneClient({
  user,
  bikes: bikesInit,
  trips: tripsInit,
}: {
  user: User;
  bikes: Bike[];
  trips: Trip[];
}) {
  // ----- Avatar/Cover state -----
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || dummyAvatar);
  const [coverImageUrl, setcoverImageUrl] = useState(user.coverImageUrl || '');

  useEffect(() => {
    setAvatarUrl(withBust(user.avatarUrl || dummyAvatar));
    setcoverImageUrl(withBust(user.coverImageUrl || ''));
  }, [user.avatarUrl, user.coverImageUrl]);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isPendingAvatar, startAvatar] = useTransition();
  const [isPendingCover, startCover] = useTransition();

  // ----- Basic form state -----
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    userName: user.userName || '',
    bio: user.bio || '',
    email: user.email || '',
    mobileNumber: user.mobileNumber || '',
    emailDisplay: !!user.emailDisplay,
    mobileNumberDisplay: !!user.mobileNumberDisplay,
    dob: user.dob || '',
    sex: user.sex || '',
    bloodGroup: user.bloodGroup || '',
    healthHistory: user.healthHistory || '',
    address: user.address || '',
    instagramLink: user.instagramLink || '',
    youtubeLink: user.youtubeLink || '',
    linkedinLink: user.linkedinLink || '',
  });

  // parent holds bikes/trips for sections + list
  const [bikes, setBikes] = useState<Bike[]>(Array.isArray(bikesInit) ? bikesInit : []);
  const [trips, setTrips] = useState<Trip[]>(Array.isArray(tripsInit) ? tripsInit : []);

  // ========= List → Form edit bridge =========
  const [editTripReq, setEditTripReq] = useState<Trip | null>(null);
  function handleEditFromList(t: Trip) {
    setEditTripReq(t);
    const el = document.getElementById('riding-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ===================== TOAST (bottom-center) ===================== */
  const [toast, setToast] = useState<{ open: boolean; type: ToastType; msg: string }>({
    open: false, type: 'info', msg: '',
  });
  function showToast(type: ToastType, msg: string) {
    setToast({ open: true, type, msg });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast((t) => ({ ...t, open: false })), 3500);
  }

  /* ===================== Avatar / Cover ===================== */
  function pickAvatar() { avatarInputRef.current?.click(); }
  function pickCover() { coverInputRef.current?.click(); }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const mb = file.size / (1024 * 1024);
    if (mb > MAX_UPLOAD_MB) {
      showToast('error', `Avatar too large. Max ${MAX_UPLOAD_MB} MB allowed.`);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      return;
    }

    setAvatarUrl(URL.createObjectURL(file)); // optimistic

    startAvatar(async () => {
      try {
        const fd = new FormData();
        const payloadFile = ENABLE_DOWNSCALE ? await downscaleToJpeg(file, 512) : file;
        fd.append('avatar', payloadFile);
        const res: any = await updateAvatarAction(fd);
        const nu = pickFirstUrl(res, ['data.avatarUrl', 'avatarUrl', 'data.url', 'url', 'data.avatar']) || '';
        setNewBust();
        setAvatarUrl(withBust(nu || user.avatarUrl || dummyAvatar));
        showToast('success', 'Avatar updated successfully');
      } catch (err: any) {
        showToast('error', err?.message || 'Avatar upload failed');
        setAvatarUrl(withBust(user.avatarUrl || dummyAvatar));
      } finally {
        if (avatarInputRef.current) avatarInputRef.current.value = '';
      }
    });
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const mb = file.size / (1024 * 1024);
    if (mb > MAX_UPLOAD_MB) {
      showToast('error', `Cover too large. Max ${MAX_UPLOAD_MB} MB allowed.`);
      if (coverInputRef.current) coverInputRef.current.value = '';
      return;
    }

    setcoverImageUrl(URL.createObjectURL(file)); // optimistic

    startCover(async () => {
      try {
        const fd = new FormData();
        const payloadFile = ENABLE_DOWNSCALE ? await downscaleToJpeg(file, 1920) : file;
        fd.append('cover', payloadFile);
        const res: any = await updateCoverAction(fd);
        const nu = pickFirstUrl(res, ['data.coverImageUrl', 'coverImageUrl', 'data.url', 'url', 'data.cover']) || '';
        setNewBust();
        setcoverImageUrl(withBust(nu || user.coverImageUrl || ''));
        showToast('success', 'Cover updated successfully');
      } catch (err: any) {
        showToast('error', err?.message || 'Cover upload failed');
        setcoverImageUrl(withBust(user.coverImageUrl || ''));
      } finally {
        if (coverInputRef.current) coverInputRef.current.value = '';
      }
    });
  }

  /* ===================== Profile Save ===================== */
  function onChange<K extends keyof typeof form>(key: K, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const bioCount = useMemo(() => Math.min(180, form.bio?.length || 0), [form.bio]);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    try {
      setSaving(true);
      const payload = {
        fullName: form.fullName?.trim(),
        emailDisplay: !!form.emailDisplay,
        mobileNumberDisplay: !!form.mobileNumberDisplay,
        dob: form.dob || '',
        sex: form.sex || '',
        bloodGroup: form.bloodGroup || '',
        instagramLink: form.instagramLink?.trim() || '',
        youtubeLink: form.youtubeLink?.trim() || '',
        linkedinLink: form.linkedinLink?.trim() || '',
        healthHistory: form.healthHistory?.trim() || '',
        address: form.address?.trim() || '',
        bio: (form.bio || '').slice(0, 180),
      };
      await updateUserAction(payload);
      showToast('success', 'Saved successfully');
    } catch (err: any) {
      showToast('error', err?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  /* ===================== Email change + OTP ===================== */
  const [emailPending, startEmail] = useTransition();
  const [otpPending, startOtp] = useTransition();
  const [otpSentTo, setOtpSentTo] = useState('');
  const [otp, setOtp] = useState('');

  function requestEmailOtp() {
    const email = (form.email || '').trim();
    if (!email) { showToast('error', 'Please enter email first'); return; }
    startEmail(async () => {
      try {
        await requestChangeEmailAction(email);
        setOtpSentTo(email);
        showToast('success', 'OTP sent to email');
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to send OTP');
      }
    });
  }

  function verifyEmailOtp() {
    const targetEmail = (otpSentTo || form.email || '').trim();
    if (!targetEmail) { showToast('error', 'Send OTP first'); return; }
    if (!otp) { showToast('error', 'Enter OTP'); return; }
    startOtp(async () => {
      try {
        await verifyChangeEmailOtpAction(targetEmail, otp);
        showToast('success', 'Email updated');
      } catch (err: any) {
        showToast('error', err?.message || 'OTP verify failed');
      }
    });
  }

  /* ===================== UI ===================== */
  return (
    <>
      <div className="max-w-10xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        {/* Cover + Avatar editors */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="relative">
            <img
              src={coverImageUrl || dummyAvatar}
              alt="cover"
              className="h-48 sm:h-56 w-full object-cover"
              onError={(e) => ((e.currentTarget as HTMLImageElement).src = dummyAvatar)}
            />
            <button
              type="button"
              onClick={pickCover}
              className="absolute top-3 right-3 inline-flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white text-sm rounded-full px-3 py-1.5"
              aria-busy={isPendingCover}
            >
              {isPendingCover ? <Spinner className="h-4 w-4" /> : <IconEdit className="h-4 w-4" />}
              <span>{isPendingCover ? 'Uploading…' : 'Change cover'}</span>
            </button>
            <input ref={coverInputRef} onChange={onCoverChange} type="file" accept="image/*" className="hidden" />
          </div>
          <div className="px-5 sm:px-6 pb-5">
            <div className="relative -mt-10 flex items-end gap-4">
              <div className="relative">
                <img
                  src={avatarUrl || dummyAvatar}
                  alt="avatar"
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-slatebg object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).src = dummyAvatar)}
                />
                <button
                  type="button"
                  onClick={pickAvatar}
                  className="absolute bottom-1 right-1 bg-black/70 hover:bg-black/90 p-1.5 rounded-full"
                  aria-busy={isPendingAvatar}
                  title="Change profile photo"
                >
                  {isPendingAvatar ? <Spinner className="h-4 w-4 text-white" /> : <IconEdit className="h-4 w-4 text-white" />}
                </button>
                <input ref={avatarInputRef} onChange={onAvatarChange} type="file" accept="image/*" className="hidden" />
              </div>
              <div className="pb-1 min-w-0">
                <div className="text-xl font-semibold truncate">{form.userName || '-'}</div>
                {!!form.fullName && <div className="text-xs text-textmuted truncate">{form.fullName}</div>}
              </div>
            </div>
          </div>
        </section>

        {/* ======= FORM GRID ======= */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Row 1: Basic Info (50) + Social Links (50) */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Basic Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="label block">
                  <span className="text-textmuted">Full name</span>
                  <input className="field mt-1" value={form.fullName} onChange={(e) => onChange('fullName', e.target.value)} placeholder="Your name" />
                </label>
                <label className="label block">
                  <span className="text-textmuted">Username</span>
                  <input className="field mt-1" value={form.userName} onChange={(e) => onChange('userName', e.target.value)} placeholder="@username" disabled />
                  <div className="text-xs text-textmuted mt-1">Username change is disabled.</div>
                </label>
                <label className="label block sm:col-span-2">
                  <span className="text-textmuted">Bio</span>
                  <textarea className="field mt-1" rows={3} value={form.bio} onChange={(e) => onChange('bio', e.target.value)} placeholder="Tell something about you…" />
                  <div className="text-xs text-textmuted mt-1">{bioCount}/180</div>
                </label>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-accent" checked={form.emailDisplay} onChange={(e) => onChange('emailDisplay', e.target.checked)} />
                  <span>Show Email</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-accent" checked={form.mobileNumberDisplay} onChange={(e) => onChange('mobileNumberDisplay', e.target.checked)} />
                  <span>Show Mobile</span>
                </label>
                <div className="text-xs text-textmuted flex items-center">Expenses visibility (not in API)</div>
              </div>
            </section>

            {/* Social Links */}
            <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
              <h2 className="font-semibold text-lg">Social Links</h2>
              <label className="label block">
                <span className="text-textmuted">Instagram</span>
                <input className="field mt-1" value={form.instagramLink} onChange={(e) => onChange('instagramLink', e.target.value)} placeholder="https://instagram.com/username" />
              </label>
              <label className="label block">
                <span className="text-textmuted">YouTube</span>
                <input className="field mt-1" value={form.youtubeLink} onChange={(e) => onChange('youtubeLink', e.target.value)} placeholder="https://youtube.com/@channel" />
              </label>
              <label className="label block">
                <span className="text-textmuted">LinkedIn</span>
                <input className="field mt-1" value={form.linkedinLink} onChange={(e) => onChange('linkedinLink', e.target.value)} placeholder="https://www.linkedin.com/in/username/" />
              </label>
              <label className="inline-flex items-center gap-2 mt-2">
                <input type="checkbox" className="accent-accent" checked readOnly />
                <span className="text-sm text-textmuted">Show links on profile</span>
              </label>
            </section>
          </div>

          {/* Row 2: Contact (full width) */}
          <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Contact</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="label block">
                <span className="text-textmuted">Email</span>
                <input className="field mt-1" value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="you@example.com" />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={requestEmailOtp} className="rounded-xl px-3 py-1.5 bg-white/5 border border-border" aria-busy={emailPending}>
                    {emailPending ? 'Sending…' : 'Send OTP'}
                  </button>
                  <input className="field flex-1" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  <button
                    type="button"
                    onClick={verifyEmailOtp}
                    className="rounded-xl px-3 py-1.5 bg-accent text-white"
                    aria-busy={otpPending}
                  >
                    {otpPending ? 'Verifying…' : 'Verify'}
                  </button>
                </div>
              </label>
              <label className="label block">
                <span className="text-textmuted">Mobile</span>
                <input className="field mt-1" value={form.mobileNumber} onChange={(e) => onChange('mobileNumber', e.target.value)} placeholder="+91 XXXXX XXXXX" />
              </label>
            </div>

            {/* DOB + SEX + Blood Group in one row */}
            <div className="grid sm:grid-cols-3 gap-4">
              <label className="label block">
                <span>DOB</span>
                <input type="date" className="field mt-1" value={form.dob?.slice(0, 10) || ''} onChange={(e) => onChange('dob', e.target.value)} />
              </label>
              <label className="label block">
                <span>SEX</span>
                <select className="field mt-1" value={form.sex} onChange={(e) => onChange('sex', e.target.value)}>
                  <option className="bg-slatebg" value="">Select</option>
                  <option className="bg-slatebg" value="m">Male</option>
                  <option className="bg-slatebg" value="f">Female</option>
                  <option className="bg-slatebg" value="o">Other</option>
                  <option className="bg-slatebg" value="na">Prefer not to say</option>
                </select>
              </label>
              <label className="label block">
                <span>Blood Group</span>
                <select className="field mt-1" value={form.bloodGroup} onChange={(e) => onChange('bloodGroup', e.target.value)}>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                    <option className="bg-slatebg" key={bg} value={bg.toLowerCase()}>{bg}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="label block">
              <span>Health History</span>
              <textarea className="field mt-1" rows={3} value={form.healthHistory} onChange={(e) => onChange('healthHistory', e.target.value)} />
            </label>
            <label className="label block">
              <span>Full Address</span>
              <textarea className="field mt-1" rows={2} value={form.address} onChange={(e) => onChange('address', e.target.value)} />
            </label>
          </section>

          {/* Row 3: Bikes + Riding Portfolio (form) */}
          <div className="grid gap-6 md:grid-cols-2">
            <BikesSection bikesInit={bikes} onBikesChange={setBikes} />
            <RidingPortfolioSection
              id="riding-form"
              bikes={bikes}
              tripsInit={trips}
              onTripsChange={setTrips}
              editRequest={editTripReq}
              onEditHandled={() => setEditTripReq(null)}
            />
          </div>

          {/* Trip LIST — FULL WIDTH */}
          <RidingPortfolioListSection
            trips={trips}
            bikes={bikes}
            fetchOnMount
            onEditRequest={handleEditFromList}
            onChanged={setTrips}
            className="md:col-span-2"
          />
        </form>
      </div>

      {/* Sticky Save (bottom-right, above toast) */}
      <div className="fixed right-6 bottom-24 z-[120]">
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-2xl px-5 py-2.5 bg-accent text-white font-semibold shadow-lg disabled:opacity-60"
          title="Save profile changes"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
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

/* ===================== helpers ===================== */

function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
  );
}

function IconEdit({ className = 'h-5 w-5', color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={color}>
      <path d="M3 17.25V21h3.75l11-11-3.75-3.75-11 11zM21.41 6.34a1.25 1.25 0 0 0 0-1.77l-2.98-2.98a1.25 1.25 0 0 0-1.77 0l-1.83 1.83L19.58 8.17l1.83-1.83z"/>
    </svg>
  );
}

/** Downscale utility */
async function downscaleToJpeg(file: File, maxW = 1920, quality = 0.85): Promise<File> {
  const img = document.createElement('img');
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;
  await new Promise<void>((res) => { img.onload = () => res(); });
  URL.revokeObjectURL(objectUrl);

  const scale = Math.min(1, (img.naturalWidth ? maxW / img.naturalWidth : 1));
  if (scale >= 1) return file;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', quality)
  );

  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
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
