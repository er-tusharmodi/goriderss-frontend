import Link from "next/link";
import type { UserSearchItem } from "../types";
import VerifiedBadge from "./VerifiedBadge";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function UserCard({ user }: { user: UserSearchItem }) {
  const name = user.name || "—";
  const uname = user.username || "";
  const loc = user.location || "—";

  return (
    <div
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-[#233042] bg-[#253341]",
        "shadow-[0_8px_24px_-8px_rgba(0,0,0,.45)] transition",
        "hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(0,0,0,.55)]",
      ].join(" ")}
    >
      {/* top accent (orange → ink → amber) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#F15A2B] via-[#30455F] to-[#FD9124]" />

      {/* header */}
      <div className="flex items-center gap-3 p-5 pb-3">
        <div className="relative">
          <div className="grid h-12 w-12 select-none place-items-center overflow-hidden rounded-full bg-white/10 text-sm font-semibold text-white/80">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={name} src={user.avatarUrl} className="h-full w-full object-cover" />
            ) : (
              initials(name)
            )}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 inline-block h-2.5 w-2.5 rounded-full ring-2 ring-[#0F1824] ${
              user.online ? "bg-[#F15A2B]" : "bg-white/30"
            }`}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold leading-tight text-white" title={name}>
              {name}
            </h3>
            <VerifiedBadge show={!!user.verified} />
          </div>
          <div className="mt-0.5 truncate text-sm text-white/60" title={uname}>
            {uname}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-white/60" title={loc}>
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="truncate">{loc}</span>
          </div>
        </div>
      </div>

      {/* chips */}
      <div className="px-5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs text-white/80 ring-1 ring-inset ring-[#314454] bg-transparent">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M7 12l-2 8h14l-2-8M7 12l5-9 5 9"/>
            </svg>
            {user.totalRides} rides
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs text-white/80 ring-1 ring-inset ring-[#314454] bg-transparent">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 17l6-6 4 4 6-6"/>
            </svg>
            {Intl.NumberFormat().format(user.totalKm)} km
          </span>
        </div>
      </div>

      {/* actions */}
      <div className="mt-auto p-5 pt-0">
        <Link
          href={`/profile/${user.id}`}
          className={[
            "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition shadow-sm",
            "border border-[#F15A2B] text-[#F15A2B]",
            "hover:bg-[rgba(241,90,43,0.12)] active:bg-[rgba(241,90,43,0.18)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F15A2B]",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1824]",
          ].join(" ")}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          View Profile
        </Link>
      </div>
    </div>
  );
}
