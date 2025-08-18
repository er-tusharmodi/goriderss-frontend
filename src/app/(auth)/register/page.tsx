'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION;

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [mobile, setMobile]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [okMsg, setOkMsg]     = useState<string | null>(null);

  const inputBase =
    'w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]';

  function normalizeMobile(v: string) {
    return v.replace(/\D+/g, '').slice(0, 10);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setOkMsg(null);

    const m = normalizeMobile(mobile);

    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim())     { setError('Please enter your email address.'); return; }
    if (m.length !== 10)   { setError('Please enter a valid 10-digit mobile number.'); return; }
    if (!password)         { setError('Password is required.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/user-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim(),
          mobileNumber: m,
          hashedPassword: password,
        }),
      });

      let data: any = null;
      try { data = await res.json(); } catch {}

      if (!res.ok || !data?.success) {
        const msg =
          data?.message ||
          (res.status === 409 ? 'User already exists.' :
           res.status === 422 ? 'Please check your inputs.' :
           res.status === 500 ? 'Server error. Please try again.' :
           `Registration failed (HTTP ${res.status}).`);
        throw new Error(msg);
      }

      setOkMsg(data?.message || 'Registration successful! Please verify your email.');
      // OTP verify page पर ले जाएँ
      setTimeout(() => {
        const q = new URLSearchParams({ email: email.trim() }).toString();
        router.replace(`/verify-email?${q}`);
      }, 900);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <main className="w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-1">Create Account</h1>
        <p className="text-white/70 mb-6">Sign up to get started!</p>

        <form className="space-y-5" onSubmit={onSubmit} aria-busy={loading}>
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              className={`${inputBase} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20a6 6 0 0 1 12 0" />
            </svg>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              className={`${inputBase} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16v12H4z" />
              <path d="m4 6 8 7 8-7" />
            </svg>
          </div>

          {/* Mobile */}
          <div className="relative">
            <input
              type="tel"
              placeholder="Mobile Number"
              className={`${inputBase} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              value={mobile}
              onChange={(e) => setMobile(normalizeMobile(e.target.value))}
              disabled={loading}
              autoComplete="tel"
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="7" y="2" width="10" height="20" rx="2" />
              <path d="M11 18h2" />
            </svg>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className={`${inputBase.replace('pr-4','pr-10')} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Confirm Password"
              className={`${inputBase.replace('pr-4','pr-10')} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {/* Messages — same style as login */}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F15A2B] hover:bg-[#e04f23] py-3.5 font-semibold shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            )}
            <span>{loading ? 'Signing up…' : 'Sign Up'}</span>
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white/70">
          Already have an account? <a href="/login" className="text-[#F15A2B] hover:underline">Login</a>
        </p>
      </main>
    </div>
  );
}
