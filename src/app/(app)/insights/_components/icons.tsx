"use client";

export function IconTrips() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l4 8H8l4-8zm0 20a6 6 0 100-12 6 6 0 000 12z" />
    </svg>
  );
}

export function IconTick({ className = "h-5 w-5 text-white/80" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function IconEye() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
    </svg>
  );
}

export function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h10.1a6.5 6.5 0 01-3.1-6zM16 13c-.29 0-.62.02-.97.06A5.49 5.49 0 0019.5 19H23v-2.5C23 14.17 18.33 13 16 13z" />
    </svg>
  );
}
