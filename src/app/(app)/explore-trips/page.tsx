import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GoRiderss — Explore Trips",
  description: "Find public rides and join fellow riders",
};

export default function Page() {
  return (
    <main className="bg-slatebg text-white min-h-screen">
      <div className="px-4 sm:px-6 py-6">
        <ExploreClient />
      </div>
    </main>
  );
}

// lazy import to keep this file tiny (avoids client bundle on other pages)
async function ExploreClient() {
  const Mod = await import("./ExploreClient");
  return <Mod.default />;
}
