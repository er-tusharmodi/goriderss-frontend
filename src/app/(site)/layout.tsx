// src/app/layout.tsx
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans", // maps to Tailwind token
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoRiderss",
  description: "Plan Trips • Connect Riders • Safety First",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`bg-ink-900 text-ink-200 antialiased font-sans`} suppressHydrationWarning> 
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
