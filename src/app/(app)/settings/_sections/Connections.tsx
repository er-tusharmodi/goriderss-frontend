"use client";

type Brand = "instagram" | "youtube" | "linkedin";

export default function ConnectionsSection() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <ProviderRow brand="instagram" name="Instagram" subtitle="Share rides to IG" />
      <ProviderRow brand="youtube" name="YouTube" subtitle="Publish vlogs" />
      <ProviderRow
        brand="linkedin"
        name="LinkedIn"
        subtitle="Showcase profile"
        className="sm:col-span-2"
      />
    </div>
  );
}

function ProviderRow({
  brand,
  name,
  subtitle,
  className,
}: {
  brand: Brand;
  name: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "bg-white/5 border border-border rounded-xl p-4 flex items-center justify-between",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <BrandIcon brand={brand} />
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-textmuted">{subtitle}</div>
        </div>
      </div>
      <button className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm">Connect</button>
    </div>
  );
}

function BrandIcon({ brand }: { brand: Brand }) {
  if (brand === "instagram") {
    // rounded-square camera
    return (
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zM12 7a5 5 0 100 10 5 5 0 000-10z" />
      </svg>
    );
  }

  if (brand === "youtube") {
    // rounded rectangle outline + solid play triangle (fix)
    return (
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="2" y="5" width="20" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 9l5 3-5 3z" fill="currentColor" />
      </svg>
    );
  }

  // linkedin
  return (
    <svg
      className="h-5 w-5 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.62 4.98 3.5zM0 8.98h5V24H0zM8.98 8.98h4.78v2.05h.07C14.5 9.76 16.13 8.43 18.56 8.43 23.62 8.43 24.55 11.76 24.55 16.09V24h-5v-6.69c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.51V24h-5V8.98z" />
    </svg>
  );
}
