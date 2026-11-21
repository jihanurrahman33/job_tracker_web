import type { Metadata } from "next";
import { Albert_Sans, Young_Serif } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { ServerProvider } from "@/context/ServerContext";
import { AuthProvider } from "@/context/AuthContext";

const sans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobTracker: keep every application where you can see it",
  description:
    "Track job applications, interview times and follow-ups in one list, and see where your search is stalling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${sans.variable} ${display.variable}`}>
      <body className="h-full font-sans antialiased selection:bg-marker selection:text-ink">
        <ToastProvider>
          <ServerProvider>
            <AuthProvider>{children}</AuthProvider>
          </ServerProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
