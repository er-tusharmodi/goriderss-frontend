"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-10 bg-ink-900 text-ink-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + Text */}
          <div className="flex items-center gap-3">
            <Image
              src="/assets/footerLogo.webp"
              alt="GoRiderss icon"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl"
            />
            <p className="text-sm">
              © {currentYear ?? "----"} GoRiderss. Ride • Connect • Explore.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="link-underline bg-gradient-to-r from-brand-500 to-brand-400 text-ink-300 hover:text-white">
              Privacy
            </a>
            <a href="#" className="link-underline bg-gradient-to-r from-brand-500 to-brand-400 text-ink-300 hover:text-white">
              Terms
            </a>
            <a href="#contact" className="link-underline bg-gradient-to-r from-brand-500 to-brand-400 text-ink-300 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
