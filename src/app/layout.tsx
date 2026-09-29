import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/lib/config-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinkTree Studio - Your Link-in-Bio Builder",
  description:
    "Create a stunning link-in-bio page with a powerful visual builder. Customize every detail and share your links beautifully.",
  keywords: ["link in bio", "linktree", "bio link", "social media", "portfolio"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
