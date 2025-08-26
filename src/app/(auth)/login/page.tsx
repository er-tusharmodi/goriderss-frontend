'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type LoginApiOk = {
  statusCode?: number;
  message?: string;
  success?: boolean;
  data?: {
    user?: { _id: string; fullName?: string; email?: string; username?: string; avatarFileId?: string; address?: string };
    accessToken?: string;
    refreshToken?: string;
  };
};

const LOGIN_ENDPOINT = '/api/auth/login'; // <-- always hit Next API (no CORS)

export default function LoginPage() {
  const router = useRouter();
  const qs = useSearchParams();

  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [okMsg, setOkMsg]         = useState<string | null>(null);

  const inputBase =
    'w-full rounded-full border border-white/20 bg-transparent py-2.5 pl-10 pr-4 placeholder-white/50 focus:outline-none focus:border-[#F15A2B]';

  const isEmail     = (v: string) => /\S+@\S+\.\S+/.test(v);
  const isUsername  = (v: string) => /^[a-zA-Z0-9._-]{3,}$/.test(v);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setOkMsg(null);

    if (!identifier) return setError('Please enter your email or username.');
    if (!password)   return setError('Password is required.');

    // Backend payload shape
    const body: Record<string, string> = { password };
    if (isEmail(identifier)) body.email = identifier.trim();
    else if (isUsername(identifier)) body.userName = identifier.trim();
    else return setError('Enter a valid email or username.');

    try {
      setLoading(true);

      // Hit Next API (server-side proxy -> backend)
      const res = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });

      const data = (await res.json().catch(() => ({}))) as LoginApiOk;

      if (!res.ok || data?.success === false) {
        const msg =
          data?.message ||
          (res.status === 401 ? 'Invalid credentials.' :
           res.status === 422 ? 'Please check your inputs.' :
           res.status === 500 ? 'Server error. Please try again.' :
           `Login failed (HTTP ${res.status}).`);
        throw new Error(msg);
      }

      const accessToken  = data?.data?.accessToken;
      const refreshToken = data?.data?.refreshToken;
      const user         = data?.data?.user;

      if (!accessToken || !refreshToken) throw new Error('Missing tokens from server.');

      // Store tokens in httpOnly cookies for the app (no alert; green banner)
      const sess = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ accessToken, refreshToken, user }),
      });

      if (!sess.ok) throw new Error('Could not initialize session.');

      const name = user?.fullName || user?.username || 'Rider';
      setOkMsg(`Logged in — Welcome, ${name}!`);

      const next = qs.get('next') || '/dashboard';
      setTimeout(() => router.replace(next), 600);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <main className="w-full max-w-sm md:max-w-md">
        <h2 className="text-3xl font-extrabold">Welcome Back</h2>
        <p className="mt-1 text-white/70">Everything starts from here</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-3" aria-busy={loading}>
          {/* Email / Username */}
          <div className="relative">
            <input
              type="text"
              placeholder="Email or Username"
              className={`${inputBase} ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              disabled={loading}
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 11c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" />
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
              autoComplete="current-password"
              disabled={loading}
              required
            />
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none"
                d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
            </svg>
            <a
              href="/forgot"
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${loading ? 'pointer-events-none opacity-50' : 'text-white/60 hover:text-white'}`}
              aria-disabled={loading}
            >
              Forgot?
            </a>
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-[#F15A2B] to-[#FF7A3D] py-3 font-semibold hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            )}
            <span>{loading ? 'Logging in…' : 'Log in'}</span>
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-white/70">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-[#F15A2B] hover:underline">Sign Up</a>
        </p>
      </main>
    </div>
  );
}
