export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <main className="w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-1">Create Account</h1>
        <p className="text-white/70 mb-6">Sign up to get started!</p>

        <form className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]"
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
              className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]"
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
              className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]"
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
              className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-10 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]"
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
              className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-10 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input type="date" className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg text-white placeholder-white/60 focus:outline-none focus:border-[#F15A2B] [color-scheme:dark]" />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div className="relative">
              <select className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-8 text-lg text-white placeholder-white/60 focus:outline-none focus:border-[#F15A2B]">
                <option className="bg-[#242E3D]" value="">Gender</option>
                <option className="bg-[#242E3D]" value="m">Male</option>
                <option className="bg-[#242E3D]" value="f">Female</option>
                <option className="bg-[#242E3D]" value="o">Other</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16M8 8h8M8 16h8" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-white/50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Instagram */}
          <div className="relative">
            <input
              type="text"
              placeholder="Instagram"
              className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="17" cy="7" r="1" />
            </svg>
          </div>

          {/* YouTube */}
          <div className="relative">
            <input
              type="text"
              placeholder="YouTube"
              className="w-full rounded-full border border-white/20 bg-transparent py-3 pl-11 pr-4 text-lg placeholder-white/60 focus:outline-none focus:border-[#F15A2B]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2a3.1 3.1 0 0 0-2.2-2.2C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.3.5A3.1 3.1 0 0 0 .5 6.2 32.5 32.5 0 0 0 0 12a32.5 32.5 0 0 0 .5 5.8 3.1 3.1 0 0 0 2.2 2.2c1.9.5 9.3.5 9.3.5s7.4 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2A32.5 32.5 0 0 0 24 12a32.5 32.5 0 0 0-.5-5.8ZM9.75 15.02v-6l6 3-6 3Z" />
            </svg>
          </div>

          <button type="submit" className="w-full rounded-full bg-[#F15A2B] hover:bg-[#e04f23] py-3.5 font-semibold shadow-lg transition">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white/70">
          Already have an account? <a href="/login" className="text-[#F15A2B] hover:underline">Login</a>
        </p>
      </main>
    </div>
  );
}
