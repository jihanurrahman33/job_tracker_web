import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { ServerProvider } from "@/context/ServerContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Job Application Tracker | Modern Career Pipeline",
  description:
    "Track job applications, schedule interviews, manage follow-up reminders, and analyze conversion metrics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased selection:bg-indigo-500 selection:text-white">
        <ToastProvider>
          <ServerProvider>
            <AuthProvider>{children}</AuthProvider>
          </ServerProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
