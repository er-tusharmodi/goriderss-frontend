"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const OTP_TYPE = "EMAIL";

export default function VerifyEmailForm({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const COOLDOWN = 60;
  const [cooldown, setCooldown] = useState(0);

  const inputBase =
    "w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]";

  const normalizeOtp = (v: string) => v.replace(/\D+/g, "").slice(0, 6);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setOkMsg(null);

    const e_ = email.trim();
    const o_ = normalizeOtp(otp);

    if (!e_) return setError("Please enter your email.");
    if (o_.length !== 6) return setError("Please enter the 6-digit OTP.");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ type: OTP_TYPE, target: e_, otp: o_ }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        const msg =
          data?.message ||
          (res.status === 400 || res.status === 401
            ? "Invalid or expired OTP."
            : res.status === 422
            ? "Please check your inputs."
            : `Verification failed (HTTP ${res.status}).`);
        throw new Error(msg);
      }
      setOkMsg(data?.message || "Email verified successfully! You can log in now.");
      setTimeout(() => router.replace("/login?verified=1"), 900);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (loading || cooldown > 0) return;

    setError(null);
    setOkMsg(null);

    const e_ = email.trim();
    if (!e_) return setError("Please enter your email.");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ type: OTP_TYPE, target: e_ }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        const msg =
          data?.message ||
          (res.status === 429 ? "Too many requests. Try again later." : `Failed to resend OTP (HTTP ${res.status}).`);
        throw new Error(msg);
      }
      setOkMsg(data?.message || "OTP sent to your email.");
      setCooldown(COOLDOWN);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not resend OTP.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <form className="space-y-5" onSubmit={onVerify} aria-busy={loading}>
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            placeholder="Email Address"
            className={`${inputBase} ${loading ? "pointer-events-none opacity-60" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || Boolean(initialEmail)}
            required
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 6h16v12H4z" />
            <path d="m4 6 8 7 8-7" />
          </svg>
        </div>

        {/* OTP */}
        <div className="relative">
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            className={`${inputBase} ${loading ? "pointer-events-none opacity-60" : ""}`}
            value={otp}
            onChange={(e) => setOtp(normalizeOtp(e.target.value))}
            disabled={loading}
            required
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>

        {error && (
          <div className="rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</div>
        )}
        {okMsg && (
          <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
            {okMsg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex flex-1 items-center justify-center gap-2 rounded-full bg-[#F15A2B] py-3.5 font-semibold shadow-lg transition hover:bg-[#e04f23] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            )}
            <span>{loading ? "Verifying…" : "Verify"}</span>
          </button>

          <button
            type="button"
            onClick={onResend}
            disabled={loading || cooldown > 0}
            className="rounded-full border border-white/20 px-5 py-3.5 font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
            title={cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-white/70">
        Entered the wrong email?{" "}
        <a href="/register" className="text-[#F15A2B] hover:underline">
          Go back
        </a>
      </p>
    </div>
  );
}
