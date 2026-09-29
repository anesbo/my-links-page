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
    <html lang="en" className={`${inter.variable} min-h-full h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bricolage+Grotesque:opsz,wght@12..96,400;600;700&family=Caveat:wght@500;700&family=Cinzel:wght@600;700&family=Outfit:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;700&family=Poppins:wght@400;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full min-h-screen flex flex-col font-sans m-0 p-0 bg-[#0d0d1a]">
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
