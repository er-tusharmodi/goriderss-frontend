'use client';

import React from 'react';

/** API types */
export type Trip = {
  _id?: string;
  fromDate: string;
  toDate: string;
  source: string;
  destination: string;
  kilometer?: number;
  details?: string;
  bike?: { _id?: string; bikeName?: string } | string;
};

export type UserProfile = {
  _id?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  address?: string;
  instagramLink?: string;
  youtubeLink?: string;
  linkedinLink?: string;
  ridingPortfolio?: Trip[];
};

export type HeaderStats = {
  posts?: number | string;
  followers?: number | string;
  following?: number | string;
  friends?: number | string;
};

const FALLBACK_IMG = '/assets/dummyUser.png';

function numberWithCommas(n: number) {
  try { return n.toLocaleString(); } catch { return String(n); }
}

export default function ProfileHeader({
  user,
  trips = [],
  stats = {},
}: {
  user: UserProfile;
  trips?: Trip[];
  /** Optional external stats; if missing we fallback to dummy */
  stats?: HeaderStats;
}) {
  const name = user.fullName || user.userName || 'Rider';
  const bio = user.bio || '—';
  const avatar = user.avatarUrl || FALLBACK_IMG;
  const cover = user.coverImageUrl || FALLBACK_IMG;

  // Prefer trips prop; else user.ridingPortfolio
  const tripList: Trip[] =
    Array.isArray(trips) && trips.length ? trips : Array.isArray(user.ridingPortfolio) ? user.ridingPortfolio! : [];

  const tripsCount = tripList.length;
  const totalKm = tripList.reduce((sum, t) => sum + (Number(t.kilometer || 0) || 0), 0);

  // Dummy fallbacks if API doesn’t send these
  const postsCount = stats.posts ?? '148';
  const followers = stats.followers ?? '1.2k';
  const following = stats.following ?? '341';
  const friends = stats.friends ?? '58';

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Cover + Avatar */}
      <div className="relative group">
        <img
          src={cover}
          alt="cover"
          className="h-48 sm:h-56 w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
        />

        {/* Avatar */}
        <div className="absolute -bottom-10 left-5 sm:left-6 flex items-end gap-4">
          <div className="relative">
            <img
              src={avatar}
              alt="avatar"
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-slatebg object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
            />
          </div>
        </div>
      </div>

      {/* Header meta */}
      <div className="pt-12 px-5 sm:px-6 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Left: name + bio + socials */}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight truncate">{name}</h1>

            {/* quick meta row (city/exp/label) — optional/dummy */}
            <div className="text-textmuted text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              {user.address && (
                <span className="inline-flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.1 5 8.95c0 5.54 7 12.1 7 12.1s7-6.56 7-12.1C19 5.1 15.87 2 12 2zm0 9.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z"/>
                  </svg>
                  {user.address}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4v2h16V4zM4 9h16v11H4V9z"/>
                </svg>
                Riding Experience: <span className="ml-1 text-white font-medium">3+ years</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6H3v12h4v4l6-4h8z"/>
                </svg>
                XPulse Rider
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/90">
              {bio}
            </p>

            {/* Socials */}
            <div className="mt-3 flex items-center gap-3">
              <a
                href={user.instagramLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-2xl px-3 py-1.5 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm11 1.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM12 7a5 5 0 100 10 5 5 0 000-10z"/>
                </svg>
                Instagram
              </a>
              <a
                href={user.youtubeLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-2xl px-3 py-1.5 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.7-.9-2.1-1C17.7 2.5 12 2.5 12 2.5s-5.7 0-8.5.3c-.5.1-1.3.1-2.1 1C.7 4.5.5 6.2.5 6.2S.3 8.2.3 10.2v1.6c0 2 .2 4 .2 4s.2 1.7.9 2.4c.8.9 1.8.9 2.2 1 1.6.3 8.2.3 8.2.3s5.7 0 8.5-.3c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.4.9-2.4s.2-2 .2-4V10.2c0-2-.2-4-.2-4zM9.8 14.2V7.8l6 3.2-6 3.2z"/>
                </svg>
                YouTube
              </a>
              <a
                href={user.linkedinLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-2xl px-3 py-1.5 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.98h5V24H0zM8.98 8.98h4.78v2.05h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 5.99 3.33 5.99 7.66V24h-5v-6.69c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.51V24h-5V8.98z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Right: Total Distance chip */}
          <div className="sm:self-start">
            <div className="bg-white/5 border border-border rounded-2xl px-4 py-3 min-w-[180px] flex items-baseline justify-between gap-3">
              <span className="text-xs text-textmuted">Total Distance</span>
              <div className="flex items-baseline gap-1 font-mono [font-variant-numeric:tabular-nums]">
                <span className="text-2xl sm:text-3xl font-bold leading-none tracking-tight">
                  {numberWithCommas(totalKm)}
                </span>
                <span className="text-sm text-textmuted">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row (Trips, Posts, Followers, Following, Friends) */}
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          <div className="bg-white/5 rounded-2xl px-4 py-3 text-center">
            <div className="text-xl font-bold">{numberWithCommas(tripsCount)}</div>
            <div className="text-xs text-textmuted">Trips</div>
          </div>
          <div className="bg-white/5 rounded-2xl px-4 py-3 text-center">
            <div className="text-xl font-bold">{postsCount}</div>
            <div className="text-xs text-textmuted">Posts</div>
          </div>
          <div className="bg-white/5 rounded-2xl px-4 py-3 text-center">
            <div className="text-xl font-bold">{followers}</div>
            <div className="text-xs text-textmuted">Followers</div>
          </div>
          <div className="bg-white/5 rounded-2xl px-4 py-3 text-center">
            <div className="text-xl font-bold">{following}</div>
            <div className="text-xs text-textmuted">Following</div>
          </div>
          <div className="bg-white/5 rounded-2xl px-4 py-3 text-center">
            <div className="text-xl font-bold">{friends}</div>
            <div className="text-xs text-textmuted">Friends</div>
          </div>
        </div>
      </div>
    </section>
  );
}
