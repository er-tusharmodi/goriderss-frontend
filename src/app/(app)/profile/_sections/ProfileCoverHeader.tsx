// src/app/(app)/dashboard/profile/_sections/ProfileCoverHeader.tsx
'use client';

import React, { type ReactNode } from 'react';

export type ProfileUser = {
  userName: string;
  fullName?: string;
  avatarUrl: string;
};

export type ProfileCounts = {
  totalDistance?: number;   // km
  experience?: number;      // years
};

export default function ProfileCoverHeader({
  user,
  coverUrl,
  socials = {},
  counts,
  meta,
  canEdit = false,     // owner flag (parent decides)
  actions,             // Follow/Block buttons (others)
}: {
  user: ProfileUser;
  coverUrl?: string;
  socials?: { instagram?: string; youtube?: string; linkedin?: string };
  counts?: ProfileCounts;
  meta?: {
    location?: string;
    riderLabel?: string;
    bio?: string;
  };
  canEdit?: boolean;
  actions?: ReactNode;
}) {
  const cover = coverUrl || '/assets/headerBanner.jpg';
  const avatar = user.avatarUrl;

  const location   = meta?.location || '—';
  const expYears   = typeof counts?.experience === 'number' && counts?.experience >= 0 ? `${counts!.experience}+ years` : '—';
  const riderLabel = meta?.riderLabel || 'Rider';
  const bio        = (meta?.bio || '').trim() || '—';

  const totalKm = formatNumberStable(counts?.totalDistance ?? 0);

  return (
    <div>
      {/* Cover */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="cover" className="h-48 sm:h-56 w-full object-cover" />
        <div className="absolute -bottom-10 left-5 sm:left-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt="avatar" className="h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-slatebg object-cover" />
        </div>
      </div>

      <div className="pt-12 px-5 sm:px-6 pb-5">
        {/* Top: left (name/meta/bio) + right (distance chip) */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* LEFT */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold leading-tight truncate">{user.userName}</h1>
            </div>

            {user.fullName ? (
              <div className="text-textmuted text-sm mt-1 truncate">{user.fullName}</div>
            ) : null}

            <div className="text-textmuted text-sm mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.1 5 8.95c0 5.54 7 12.1 7 12.1s7-6.56 7-12.1C19 5.1 15.87 2 12 2zm0 9.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z"/>
                </svg>
                {location}
              </span>
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4v2h16V4zM4 9h16v11H4V9z"/>
                </svg>
                Riding Experience: <span className="ml-1 text-white font-medium">{expYears}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6H3v12h4v4l6-4h8z"/>
                </svg>
                {riderLabel}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/90">{bio}</p>
          </div>

          {/* RIGHT: Distance chip */}
          <div className="sm:self-start">
            <div className="bg-white/5 border border-border rounded-2xl px-4 py-3 min-w-[180px] flex items-baseline justify-between gap-3">
              <span className="text-xs text-textmuted">Total Distance</span>
              <div className="flex items-baseline gap-1 font-mono [font-variant-numeric:tabular-nums]">
                <span className="text-2xl sm:text-3xl font-bold leading-none tracking-tight">{totalKm}</span>
                <span className="text-sm text-textmuted">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: Socials (left) + Actions (absolute right) */}
        <div className="mt-4 flex items-center gap-3">
          {/* Socials */}
          <div className="flex items-center gap-3">
            {!!socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-2xl px-3 py-1.5 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm11 1.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM12 7a5 5 0 100 10 5 5 0 000-10z"/>
                </svg>
                Instagram
              </a>
            )}
            {!!socials.youtube && (
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-2xl px-3 py-1.5 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.7-.9-2.1-1C17.7 2.5 12 2.5 12 2.5s-5.7 0-8.5.3c-.5.1-1.3.1-2.1 1C.7 4.5.5 6.2.5 6.2S.3 8.2.3 10.2v1.6c0 2 .2 4 .2 4s.2 1.7.9 2.4c.8.9 1.8.9 2.2 1 1.6.3 8.2.3 8.2.3s5.7 0 8.5-.3c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.4.9-2.4s.2-2 .2-4v-1.6c0-2-.2-4-.2-4zM9.8 14.2V7.8l6 3.2-6 3.2z"/>
                </svg>
                YouTube
              </a>
            )}
            {!!socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-2xl px-3 py-1.5 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.98h5V24H0zM8.98 8.98h4.78v2.05h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 5.99 3.33 5.99 7.66V24h-5v-6.69c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.51V24h-5V8.98z"/>
                </svg>
                LinkedIn
              </a>
            )}
          </div>

          {/* ACTIONS: push to extreme right */}
          <div className="ml-auto flex items-center gap-2">
            {actions}
            {canEdit && (
              <a
                href="/profile/edit"
                className="rounded-full bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2 text-sm font-medium"
              >
                Edit Profile
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* stable number formatting to avoid hydration mismatches */
function formatNumberStable(n: number) {
  try {
    return Math.max(0, Number(n || 0)).toLocaleString('en-IN');
  } catch {
    const s = `${Math.max(0, Number(n || 0))}`;
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
