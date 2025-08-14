'use client';

import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const href = '/';
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur border-b"
      style={{
        backgroundColor: 'rgba(36, 46, 61, 0.7)', // --ink-800/70 approx
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={href}>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/primaryLogo.png"
                alt="GoRiderss"
                style={{ height: "auto" }}
                width={200}
                height={80}
                priority
              />
              <span className="sr-only">GoRiderss</span>
            </div>
          </Link>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center rounded-xl px-4 py-2 text-sm transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }}
            >
              Login
            </Link>

            <Link
              href="/register"
              className="hidden lg:inline-flex items-center rounded-xl px-4 py-2 text-sm"
              style={{
                backgroundColor: 'rgba(239, 85, 44, 0.1)', // brand-500/10
                color: 'white',
              }}
            >
              Register
            </Link>

            <Link
              href="#app"
              className="inline-flex items-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm shadow-glow transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            >
              Visit App
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
