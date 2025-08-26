import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient.client";

export const metadata: Metadata = {
  title: "Login • GoRiderss",
  description: "Sign in to your GoRiderss account.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const nextPath =
    typeof sp.next === "string" && sp.next.trim() ? sp.next : "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm md:max-w-md">
        <h2 className="text-3xl font-extrabold">Welcome Back</h2>
        <p className="mt-1 text-white/70">Everything starts from here</p>

        <div className="mt-8">
          <Suspense fallback={<div className="text-sm text-white/70">Loading…</div>}>
            <LoginClient nextPath={nextPath} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
