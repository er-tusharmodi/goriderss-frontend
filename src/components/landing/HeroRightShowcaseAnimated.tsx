"use client";

import type { ElementType } from "react";
import {
  Siren, Compass, UsersRound, Wrench,
  Shield, MapPinned, Fuel, PhoneCall, CloudSun, FileDown
} from "lucide-react";
import styles from "./HeroShowcase.module.css";

type Card = {
  title: string; subtitle: string; icon: ElementType;
  x: number; y: number; w?: number; delay?: string; vibe?: "slow"|"alt";
};
type Chip = {
  text: string; icon?: ElementType; x: number; y: number; delay?: string; vibe?: "slow"|"alt";
};

function Badge({ Icon }: { Icon: ElementType }) {
  return <span className={styles.badge}><Icon size={18} /></span>;
}

function CardGlass({ c, forceInline = false }: { c: Card; forceInline?: boolean }) {
  const vClass = c.vibe === "alt" ? styles.vibeAlt : styles.vibeSlow;

  return (
    <div
      className={`${styles.card} ${styles.fadeUp} ${vClass}`}
      style={{
        left: c.x,
        top: c.y,
        width: c.w ?? 380,
        animationDelay: c.delay ?? "0s",
        // ✅ 1st card ke liye inline fallback (debug)
        ...(forceInline ? { animation: "vibeA 4s ease-in-out infinite" } : {}),
      }}
    >
      <Badge Icon={c.icon} />
      <div className="min-w-0">
        <p className="text-white font-semibold leading-tight">{c.title}</p>
        <p className="text-white/85 text-sm">{c.subtitle}</p>

        {c.title === "Smart Routes" && (
          <div className={`mt-3 h-1.5 bg-white/12 rounded-full ${styles.progress}`}>
            <div className={`h-1.5 w-[65%] rounded-full ${styles.softPulse}`} style={{ backgroundColor:"#ef552c" }}/>
          </div>
        )}
      </div>
    </div>
  );
}

function ChipPill({ c }: { c: Chip }) {
  const vClass = c.vibe === "alt" ? styles.vibeAlt : styles.vibeSlow;
  return (
    <span
      className={`${styles.chip} ${styles.fadeUp} ${vClass}`}
      style={{ left: c.x, top: c.y, animationDelay: c.delay ?? "0s" }}
    >
      {c.icon ? <c.icon size={14}/> : null}
      {c.text}
    </span>
  );
}

export default function HeroRightShowcaseVibe() {
  const cards: Card[] = [
    { title:"Live SOS",         subtitle:"One‑tap safety beacon",    icon:Siren,      x:360, y:58,  w:330, vibe:"slow", delay:".06s" },
    { title:"Verified Helpers", subtitle:"Trusted nearby shops",     icon:Wrench,     x: 90, y:96,  w:320, vibe:"alt",  delay:".10s" },
    { title:"Smart Routes",     subtitle:"Plan, save & share rides", icon:Compass,    x:140, y:190, w:540, vibe:"slow", delay:".16s" },
    { title:"Group Rides",      subtitle:"Invite friends, split costs", icon:UsersRound, x:230, y:428, w:440, vibe:"alt", delay:".22s" },
  ];

  const chips: Chip[] = [
    { text:"Privacy‑first", icon:Shield,    x:520, y:118, delay:".12s", vibe:"alt"  },
    { text:"Waypoints",     icon:MapPinned, x:220, y:248, delay:".18s", vibe:"slow" },
    { text:"Fuel stops",    icon:Fuel,      x:188, y:306, delay:".22s", vibe:"alt"  },
    { text:"SOS contacts",  icon:PhoneCall, x:402, y:266, delay:".26s", vibe:"slow" },
    { text:"Weather layer", icon:CloudSun,  x:462, y:346, delay:".30s", vibe:"alt"  },
    { text:"Trip export",   icon:FileDown,  x:478, y:304, delay:".28s", vibe:"slow" },
  ];

  return (
    <div className="relative h-[560px] w-full" style={{ animation: "heroVibeA 3s ease-in-out infinite" }}
>
      {/* soft brand glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-10 h-80 w-80 rounded-full"
        style={{ background:"radial-gradient(closest-side, rgba(239,85,44,.22), transparent 70%)" }}
      />
      {/* dashed route */}
      <svg className="absolute inset-0 -z-[1] pointer-events-none" viewBox="0 0 700 560">
        <path
          d="M140 520 C 240 450, 330 390, 390 300 S 580 200, 600 80"
          stroke="rgba(255,255,255,0.30)" strokeWidth="3" strokeDasharray="10 14"
          className={styles.dash} strokeLinecap="round" fill="none"
        />
      </svg>

      {/* 🔸 first card with inline fallback ON (should 100% move) */}
      <CardGlass c={cards[0]} forceInline />

      {/* rest normal */}
      {cards.slice(1).map((c) => <CardGlass key={c.title} c={c} />)}
      {chips.map((c) => <ChipPill key={`${c.text}-${c.x}`} c={c} />)}
    </div>
  );
}
