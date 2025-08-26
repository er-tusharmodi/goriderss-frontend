'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const OTP_TYPE = 'EMAIL'; // if your backend expects lowercase, change to 'email'

export default function VerifyEmailPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialEmail = sp.get('email') || '';

  const [email, setEmail]       = useState(initialEmail);
  const [otp, setOtp]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [okMsg, setOkMsg]       = useState<string | null>(null);

  const COOLDOWN = 60;
  const [cooldown, setCooldown] = useState(0);

  const inputBase =
    'w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]';

  function normalizeOtp(v: string) {
    return v.replace(/\D+/g, '').slice(0, 6);
  }

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

    if (!e_)                 return setError('Please enter your email.');
    if (o_.length !== 6)     return setError('Please enter the 6-digit OTP.');

    try {
      setLoading(true);
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ type: OTP_TYPE, target: e_, otp: o_ }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        const msg =
          data?.message ||
          (res.status === 400 || res.status === 401 ? 'Invalid or expired OTP.' :
           res.status === 422 ? 'Please check your inputs.' :
           `Verification failed (HTTP ${res.status}).`);
        throw new Error(msg);
      }

      setOkMsg(data?.message || 'Email verified successfully! You can log in now.');
      setTimeout(() => router.replace('/login?verified=1'), 900);
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (loading || cooldown > 0) return;

    setError(null);
    setOkMsg(null);

    const e_ = email.trim();
    if (!e_) return setError('Please enter your email.');

    try {
      setLoading(true);
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ type: OTP_TYPE, target: e_ }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        const msg =
          data?.message ||
          (res.status === 429 ? 'Too many requests. Try again later.' :
           `Failed to resend OTP (HTTP ${res.status}).`);
        throw new Error(msg);
      }

      setOkMsg(data?.message || 'OTP sent to your email.');
      setCooldown(COOLDOWN);
    } catch (err: any) {
      setError(err?.message || 'Could not resend OTP.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <main className="w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-1">Verify your email</h1>
        <p className="text-white/70 mb-6">Enter the 6-digit code we sent to your email.</p>

        <form className="space-y-5" onSubmit={onVerify} aria-busy={loading}>
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              className={`${inputBase} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!initialEmail}
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              className={`${inputBase} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              value={otp}
              onChange={(e) => setOtp(normalizeOtp(e.target.value))}
              disabled={loading}
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>

          {/* Messages */}
          {error && (
            <div className="text-sm rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-300">
              {error}
            </div>
          )}
          {okMsg && (
            <div className="text-sm rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-emerald-300">
              {okMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-[#F15A2B] hover:bg-[#e04f23] py-3.5 font-semibold shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              )}
              <span>{loading ? 'Verifying…' : 'Verify'}</span>
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={loading || cooldown > 0}
              className="px-5 rounded-full border border-white/20 py-3.5 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
              title={cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-white/70">
          Entered the wrong email?{' '}
          <a href="/register" className="text-[#F15A2B] hover:underline">Go back</a>
        </p>
      </main>
    </div>
  );
}
