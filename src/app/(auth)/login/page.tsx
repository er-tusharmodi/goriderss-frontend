export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <main className="w-full max-w-sm md:max-w-md">
        <h2 className="text-3xl font-extrabold">Welcome Back</h2>
        <p className="mt-1 text-white/70">Everything starts from here</p>

        <form className="mt-8 space-y-3">
          {/* Email or Username */}
          <div className="relative">
            <input
              type="text"
              placeholder="Email or username"
              className="w-full rounded-full border border-white/20 bg-transparent py-2.5 pl-10 pr-4 placeholder-white/50 focus:outline-none focus:border-[#F15A2B]"
            />
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 12A4 4 0 1 0 8 12a4 4 0 0 0 8 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
            </svg>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-full border border-white/20 bg-transparent py-2.5 pl-10 pr-10 placeholder-white/50 focus:outline-none focus:border-[#F15A2B]"
            />
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 15c1.656 0 3-1.344 3-3s-1.344-3-3-3s-3 1.344-3 3s1.344 3 3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7c-4.478 0-8.268-2.943-9.542-7z" />
            </svg>
            <a href="#forgot" className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60 hover:text-white">Forgot?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-[#F15A2B] to-[#FF7A3D] py-3 font-semibold hover:opacity-95 active:scale-[0.99] transition"
          >
            Log in
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-3 text-center text-sm text-white/70">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-[#F15A2B] hover:underline">Sign Up</a>
        </p>
      </main>
    </div>
  );
}
