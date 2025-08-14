'use client'

import React from 'react'

export default function HomePage() {
  return (
    <main>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden bg-ink-900 bg-cover bg-center inset-0 -z-10"
        style={{
          backgroundImage: "url('/assets/headerBanner.jpg')",
          backgroundColor: "#0f172a",
        }}>
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,106,22,0.15),_transparent_50%),_radial-gradient(ellipse_at_bottom_left,_rgba(255,106,22,0.10),_transparent_45%)]"></div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
                <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 items-center">
                  
                  {/* Left content */}
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-300">
                      Built for Riders • Route • Trips • SOS
                    </span>
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                      Ride. Connect. <span className="text-brand-500">Explore.</span>
                    </h1>
                    <p className="mt-5 text-lg text-ink-300">
                      GoRiderss is a biker-first platform for <span className="text-white">route sharing</span>, 
                      <span className="text-white"> trip management</span>, 
                      <span className="text-white"> rider community</span>, and 
                      <span className="text-white"> safety</span>. Plan group rides, split expenses, find verified helper shops, 
                      and stay connected—on and off the road.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <a href="#cta" className="inline-flex items-center justify-center rounded-xl bg-brand-500 hover:bg-brand-600 px-6 py-3 text-white font-medium shadow-glow transition-transform duration-200 hover:scale-[1.02] active:scale-95">
                        Create Your First Trip
                      </a>
                      <a href="#features" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-white font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-95">
                        See Features
                      </a>
                    </div>

                    <div className="mt-8 flex items-center gap-6 text-sm text-ink-400">
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500"></span> Live SOS</div>
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500"></span> Offline-ready</div>
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-500"></span> Privacy-first</div>
                    </div>
                  </div>

                  {/* Right mockup image */}
                  <div className="relative flex justify-center items-center">
                    <img
                      src="/assets/heroMockup.webp"
                      alt="GoRiderss App Mockup"
                      className="w-full max-w-[800px] max-h-[800px] h-auto object-contain"
                    />
                  </div>

                </div>
              </div>
      </section>
      {/* ====== WHY GORIDERSS ====== */}
      <section className="py-16 border-t border-white/5 bg-ink-800 flex items-center" id="why">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            
            {/* Left Title */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-white">Why GoRiderss?</h2>
              <p className="mt-3 text-ink-300">
                Because the best rides are safe, simple and social. We solve the messy parts—planning, splitting, coordinating—
                so you can focus on the road.
              </p>
            </div>

            {/* Right Cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="rounded-2xl border border-white/10 bg-ink-700 p-6">
                <h3 className="text-white font-semibold">All-in-one for Riders</h3>
                <p className="mt-2 text-ink-300 text-sm">
                  Trips, routes, expenses, helpers, and community—no more juggling 5 different apps.
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl border border-white/10 bg-ink-700 p-6">
                <h3 className="text-white font-semibold">Real-time Safety</h3>
                <p className="mt-2 text-ink-300 text-sm">
                  One-tap SOS, live location with battery-aware updates, and admin-only broadcast in group rides.
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-2xl border border-white/10 bg-ink-700 p-6">
                <h3 className="text-white font-semibold">Verified Helpers</h3>
                <p className="mt-2 text-ink-300 text-sm">
                  Find nearby fuel/mechanic/medical shops verified by riders. Earn reward points for reviews.
                </p>
              </div>

              {/* Card 4 */}
              <div className="rounded-2xl border border-white/10 bg-ink-700 p-6">
                <h3 className="text-white font-semibold">Built for Groups</h3>
                <p className="mt-2 text-ink-300 text-sm">
                  Solo or group rides, admin controls, only-admin messaging, and easy member onboarding.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ====== FEATURES ====== */}
      <section id="features" className="py-20 bg-ink-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything riders need — in one place
            </h2>
            <p className="mt-3 text-ink-300">
              From planning your route to sharing memories, GoRiderss keeps your entire ride life in sync.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Route Sharing",
                desc: "Create routes, add stops, share live progress with your crew, and export GPX/KML.",
              },
              {
                title: "Trip Management",
                desc: "Itinerary, stay, permits, packing list, and ride guidelines—organized and synced.",
              },
              {
                title: "Community & Groups",
                desc: "Public or private groups, admin controls, join requests, and event posts.",
              },
              {
                title: "Expenses Split",
                desc: "Fuel, food, stay—track & split per rider with settlements and receipts.",
              },
              {
                title: "SOS & Safety",
                desc: "One‑tap SOS, emergency contacts, and auto‑alerts when someone drops off the route.",
              },
              {
                title: "Helper Directory",
                desc: "Nearby mechanics, fuel pumps, tyre shops—verified with OTP and rider reviews.",
              },
              {
                title: "Media & Tagging",
                desc: "Upload ride photos/videos, tag routes & riders, and build your riding portfolio.",
              },
              {
                title: "Rewards",
                desc: "Earn points for safe rides, reviews and contributions—redeem with partner shops.",
              },
              {
                title: "Privacy‑first",
                desc: "Granular controls for profile, number visibility, email, and trip privacy.",
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-ink-700 p-6">
                <div className="text-brand-500 font-semibold">{item.title}</div>
                <p className="mt-2 text-sm text-ink-300">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
      {/* ====== HOW IT WORKS ====== */}
      <section id="how" className="py-20 border-t border-white/5 bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* Left side – steps */}
            <div>
              <h2 className="text-3xl font-bold text-white">How it works</h2>
              <ol className="mt-6 space-y-6">
                {[
                  {
                    number: "1",
                    title: "Create a trip",
                    desc: "Add source/destination, dates, budget and guidelines. Choose public or private.",
                  },
                  {
                    number: "2",
                    title: "Invite your crew",
                    desc: "Share join link, approve requests, set admin-only messaging for discipline.",
                  },
                  {
                    number: "3",
                    title: "Ride with confidence",
                    desc: "Live route share, helper shops, expense split and one-tap SOS keep everyone safe.",
                  },
                  {
                    number: "4",
                    title: "Relive the memories",
                    desc: "Upload media, tag riders and build your public riding portfolio.",
                  },
                ].map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-brand-500 text-white grid place-content-center font-bold transition-transform duration-200 hover:scale-[1.02] active:scale-95">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{step.title}</h3>
                      <p className="text-sm text-ink-300">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right side – image + tags */}
            <div className="rounded-3xl border border-white/10 bg-ink-700 p-6">
              <div className="aspect-[16/10] rounded-2xl border border-white/10 overflow-hidden">
                <img
                  src="/assets/howItWork.webp"
                  alt="GoRiderss App Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs text-ink-300">
                <div className="rounded-xl bg-white/5 p-3 text-center">Admin-only broadcast</div>
                <div className="rounded-xl bg-white/5 p-3 text-center">Member badges</div>
                <div className="rounded-xl bg-white/5 p-3 text-center">Offline cache</div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ====== PRICING ====== */}
      <section id="pricing" className="py-20 bg-ink-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Simple pricing, rider‑friendly</h2>
            <p className="mt-3 text-ink-300">Start free. Go Pro for advanced features and club‑level tools.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="rounded-3xl border border-white/10 bg-ink-700 p-6 flex flex-col">
              <h3 className="text-white font-semibold">Free</h3>
              <p className="mt-1 text-3xl font-bold text-white">
                ₹0<span className="text-sm font-normal text-ink-300">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink-300">
                <li>• Solo trips & basic groups</li>
                <li>• Route share & GPX export</li>
                <li>• Expense tracking (basic)</li>
              </ul>
              <a
                href="#cta"
                className="mt-6 inline-flex justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white px-4 py-2 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              >
                Start Free
              </a>
            </div>

            {/* Pro Rider Plan */}
            <div className="rounded-3xl border-2 border-brand-500 bg-ink-700 p-6 flex flex-col shadow-glow">
              <div className="inline-block self-start rounded-full bg-brand-500 text-white text-xs px-2 py-1 transition-transform duration-200 hover:scale-[1.02] active:scale-95">
                Popular
              </div>
              <h3 className="mt-2 text-white font-semibold">Pro Rider</h3>
              <p className="mt-1 text-3xl font-bold text-white">
                ₹299<span className="text-sm font-normal text-ink-300">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink-300">
                <li>• Unlimited group rides</li>
                <li>• Advanced expense split</li>
                <li>• Live SOS + helper network</li>
                <li>• Media tagging & portfolio</li>
              </ul>
              <a
                href="#cta"
                className="mt-6 inline-flex justify-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              >
                Go Pro
              </a>
            </div>

            {/* Club Plan */}
            <div className="rounded-3xl border border-white/10 bg-ink-700 p-6 flex flex-col">
              <h3 className="text-white font-semibold">Club</h3>
              <p className="mt-1 text-3xl font-bold text-white">Custom</p>
              <ul className="mt-4 space-y-2 text-sm text-ink-300">
                <li>• Admin dashboard</li>
                <li>• Only‑admin messaging</li>
                <li>• Roles & approvals</li>
              </ul>
              <a
                href="#cta"
                className="mt-6 inline-flex justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white px-4 py-2 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              >
                Talk to us
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ====== FAQ ====== */}
      <section id="faq" className="py-20 bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white">FAQ</h2>
            <p className="mt-3 text-ink-300">Short answers to common questions.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-ink-700 p-6">
              <h3 className="text-white font-semibold">Is GoRiderss free?</h3>
              <p className="mt-2 text-sm text-ink-300">
                Yes—start free. Pro unlocks advanced features like unlimited groups and enhanced SOS.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-700 p-6">
              <h3 className="text-white font-semibold">Does it work offline?</h3>
              <p className="mt-2 text-sm text-ink-300">
                Key data is cached for poor-network zones. Live features resume once online.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-700 p-6">
              <h3 className="text-white font-semibold">Can I import/export routes?</h3>
              <p className="mt-2 text-sm text-ink-300">Yes, GPX/KML support for imports & exports.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-700 p-6">
              <h3 className="text-white font-semibold">Is my number/email public?</h3>
              <p className="mt-2 text-sm text-ink-300">
                No. You control what to show. Privacy is on by default.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ====== GET THE APP ====== */}
      <section id="download" className="py-20 border-t border-white/5 bg-ink-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: copy + CTAs */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Get the app. Ride smarter.</h2>
              <p className="mt-3 text-ink-300 max-w-2xl">
                Plan trips, share routes and stay safe—right from your phone. Desktop dashboard coming soon.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#app"
                  className="inline-flex items-center rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 font-medium shadow-glow transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                >
                  Visit Web App
                </a>
                <a
                  href="#login"
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white px-5 py-3 font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                >
                  Login
                </a>
              </div>

              {/* Store Badges */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="group relative inline-flex items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 shadow-lg transition duration-300 ease-out hover:scale-105"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-10 transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
                <a
                  href="#"
                  className="group relative inline-flex items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 shadow-lg transition duration-300 ease-out hover:scale-105"
                >
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="h-10 transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              </div>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-300">
                {["Live SOS", "Group rides", "Offline-ready", "Privacy-first"].map((text, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10"
                  >
                    <span className="h-2 w-2 bg-brand-500 rounded-full" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: phone mockup */}
            <div className="relative w-full max-w-sm mx-auto">
              <div className="rounded-[2.2rem] border border-white/10 bg-ink-700 p-3 shadow-2xl">
                <div className="rounded-[1.8rem] overflow-hidden border border-white/10 bg-ink-800">
                  {/* status bar */}
                  <div className="h-10 bg-ink-700/60 border-b border-white/10 grid place-content-center text-xs text-ink-300">
                    GoRiderss • App Preview
                  </div>
                  {/* screen content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/5 grid place-content-center text-white font-bold">G</div>
                        <div>
                          <p className="text-white font-semibold">Weekend Ride</p>
                          <p className="text-ink-400 text-xs">Delhi → Rishikesh</p>
                        </div>
                      </div>
                      <span className="text-xs text-brand-500 bg-brand-500/10 px-2 py-1 rounded-lg">Live</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-xl bg-white/5 p-3">
                        <p className="text-xl font-bold text-white">423</p>
                        <p className="text-[11px] text-ink-400">kms</p>
                      </div>
                      <div className="rounded-xl bg-white/5 p-3">
                        <p className="text-xl font-bold text-white">₹1.8k</p>
                        <p className="text-[11px] text-ink-400">per rider</p>
                      </div>
                      <div className="rounded-xl bg-white/5 p-3">
                        <p className="text-xl font-bold text-white">24</p>
                        <p className="text-[11px] text-ink-400">stops</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-ink-700 p-3 text-xs text-ink-300">
                      Route share • Fuel split • Stay alerts • SOS
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {["Route", "Expenses", "Community", "SOS"].map((tag, i) => (
                        <span key={i} className="px-2 py-1 text-[11px] rounded-full bg-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR badge */}
              <div className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur px-3 py-2 transition-transform duration-200 hover:scale-[1.02] active:scale-95">
                <div className="h-10 w-10 bg-white/5 rounded-md grid place-content-center text-[10px] text-ink-300">
                  QR
                </div>
                <div className="text-xs text-ink-300">
                  <span className="text-white">Scan</span> to get the app
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ====== FINAL CTA ====== */}
      <section id="cta" className="py-20 border-t border-white/5 bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to plan your next ride?
          </h2>
          <p className="mt-3 text-ink-200">
            Create a trip in minutes. Invite your crew. Ride smarter.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="#"
              className="inline-flex items-center rounded-xl bg-white text-ink-900 px-6 py-3 font-medium shadow-glow transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white px-6 py-3 font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>
      {/* ====== CONTACT ====== */}
      <section id="contact" className="py-20 bg-ink-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            
            {/* Left: Info Section */}
            <div>
              <h2 className="text-3xl font-bold text-white">Contact Us</h2>
              <p className="mt-3 text-ink-300">
                Have a question, partnership idea or feedback? Send us a message.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-ink-700 p-6 ring-1 ring-white/10 shadow-xl">
                <dl className="space-y-3 text-ink-300 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-brand-500 transition-transform duration-200 hover:scale-[1.02] active:scale-95" />
                    <span>Email:</span>
                    <span className="text-white">support@goriderss.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-brand-500 transition-transform duration-200 hover:scale-[1.02] active:scale-95" />
                    <span>Phone:</span>
                    <span className="text-white">+91 9876543210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-brand-500 transition-transform duration-200 hover:scale-[1.02] active:scale-95" />
                    <span>Address:</span>
                    <span className="text-white">Pune, Maharashtra, India</span>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right: Form Section */}
            <form className="rounded-2xl border border-white/10 bg-ink-700 p-6 space-y-4 ring-1 ring-white/10 shadow-xl">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  required
                  className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
              <textarea
                placeholder="Message"
                rows={4}
                required
                className="w-full rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              ></textarea>
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 shadow-glow transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
