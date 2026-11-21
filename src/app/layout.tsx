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
  title: "JobTracker: track every job application",
  description:
    "A web app for people applying for jobs. Track applications by stage, schedule interviews, set follow-up reminders and see your reply, interview and offer rates.",
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
