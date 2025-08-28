// app/search/users/page.tsx
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
type ViewParam = "grid" | "list";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: ViewParam }>;
}) {
  const sp = await searchParams;
  const initialQ = typeof sp?.q === "string" ? sp.q : "";
  const initialView: ViewParam = sp?.view === "list" || sp?.view === "grid" ? sp.view : "grid";

  // 👇 force remount when q/view changes
  return (
    <SearchClient
      key={`${initialView}|${initialQ}`}
      initialQ={initialQ}
      initialView={initialView}
    />
  );
}
