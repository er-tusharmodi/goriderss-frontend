import { Suspense } from "react";
import VerifyEmailForm from "./VerifyEmailForm.client";

export const metadata = {
  title: "Verify Email • GoRiderss",
  description: "Enter the OTP sent to your email.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const initialEmail = typeof sp.email === "string" ? sp.email : "";

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-1 text-3xl font-extrabold">Verify your email</h1>
      <p className="mb-6 text-white/70">
        Enter the 6-digit code we sent to your email.
      </p>

      <Suspense fallback={<div className="text-sm text-white/70">Loading…</div>}>
        <VerifyEmailForm initialEmail={initialEmail} />
      </Suspense>
    </main>
  );
}
