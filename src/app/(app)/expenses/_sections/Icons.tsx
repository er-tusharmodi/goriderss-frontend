export function CatIcon({ cat, className = "w-[18px] h-[18px] text-white" }: { cat: string; className?: string }) {
  const base = { className, viewBox: "0 0 24 24", fill: "currentColor" } as any;

  switch (cat) {
    case "Fuel":
      return <svg {...base}><path d="M16 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8V5h2v6a2 2 0 0 0 2 2h1v6h2v-7a3 3 0 0 0-.88-2.12l-2.12-2.12A3 3 0 0 0 16 7V3zM8 7h4v2H8V7z"/></svg>;
    case "Food":
      return <svg {...base}><path d="M11 9H9V3H7v6H5V3H3v8a4 4 0 0 0 4 4v6h2v-6a4 4 0 0 0 4-4V3h-2v6zm8-6h-2v8c0 1.1.9 2 2 2v6h2v-6c1.1 0 2-.9 2-2V3h-4z"/></svg>;
    case "Stay":
      return <svg {...base}><path d="M4 10V7a4 4 0 0 1 8 0v3h8v8h-2v-3H6v3H4v-8h0zm6 0V7a2 2 0 0 0-4 0v3h4z"/></svg>;
    case "Toll":
      return <svg {...base}><path d="M3 5h18v2H3V5zm2 4h14l-2 10H7L5 9zm4 2v6h2v-6H9zm4 0v6h2v-6h-2z"/></svg>;
    case "Repair":
      return <svg {...base}><path d="M21 3l-6 2 3 3-7 7-3-3-2 2 5 5 9-9 3 3 2-6-4-4z"/></svg>;
    case "Gear":
      return <svg {...base}><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm9.4 4a7.4 7.4 0 0 0-.2-1.8l2.1-1.6-2-3.4-2.5 1a7.6 7.6 0 0 0-3.1-1.8l-.4-2.6H10l-.4 2.6a7.6 7.6 0 0 0-3.1 1.8l-2.5-1-2 3.4 2.1 1.6c.1-.6.2-1.2.2-1.8z"/></svg>;
    case "Insurance":
      return <svg {...base}><path d="M12 2l8 4v6c0 5-3.6 9.7-8 10-4.4-.3-8-5-8-10V6l8-4z"/></svg>;
    case "Service":
      return <svg {...base}><path d="M7 3h10v2H7V3zm-2 4h14v2H5V7zm-2 4h18v2H3v-2zm2 4h14v2H5v-2z"/></svg>;
    default:
      return <svg {...base}><circle cx="12" cy="12" r="9" /></svg>;
  }
}
