import type { Metadata } from "next";
import PlannerClient from "./PlannerClient";

export const metadata: Metadata = {
  title: "GoRiderss — Route Planner (AI)",
  description:
    "Type your route, get smart checkpoint suggestions with highlights & distances.",
};

export default function Page() {
  return (
    <main className="bg-slatebg text-white min-h-screen">
      <div className="px-4 sm:px-6 py-6">
        <PlannerClient />
      </div>
    </main>
  );
}
