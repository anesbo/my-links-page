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
  metadataBase: new URL("https://anesbouziadlinks.vercel.app"),
  title: {
    default: "Anes Bouziad | Links, Portfolio & Official Socials",
    template: "%s | Anes Bouziad",
  },
  description:
    "Official links and bio page for Anes Bouziad. Explore my portfolio, GitHub projects, tutorials, latest articles, and connect across all platforms.",
  applicationName: "Anes Bouziad Links",
  authors: [{ name: "Anes Bouziad", url: "https://anesbouziadlinks.vercel.app" }],
  creator: "Anes Bouziad",
  publisher: "Anes Bouziad",
  keywords: [
    "Anes Bouziad",
    "Anes Bouziad links",
    "anesbouziadlinks",
    "anesbouziadlinks.vercel.app",
    "Anes Bouziad portfolio",
    "Anes Bouziad developer",
    "Anes Bouziad creator",
    "Anes Bouziad bio",
    "Anes Bouziad GitHub",
    "link in bio",
    "developer portfolio",
    "software engineer",
  ],
  alternates: {
    canonical: "https://anesbouziadlinks.vercel.app",
  },
  openGraph: {
    title: "Anes Bouziad | Links, Portfolio & Official Socials",
    description:
      "Official links and bio page for Anes Bouziad. Explore my portfolio, projects, and connect directly.",
    url: "https://anesbouziadlinks.vercel.app",
    siteName: "Anes Bouziad",
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anes Bouziad | Links, Portfolio & Official Socials",
    description:
      "Official bio and links page for Anes Bouziad. Explore my portfolio, projects, and connect directly.",
    creator: "@anesbo",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

// Structured JSON-LD Schema for Google & Search Engines
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://anesbouziadlinks.vercel.app/#person",
      name: "Anes Bouziad",
      url: "https://anesbouziadlinks.vercel.app",
      jobTitle: "Developer & Creator",
      description:
        "Developer and creator building modern web experiences and software.",
      sameAs: [
        "https://github.com/anesbo",
        "https://anesbouziadlinks.vercel.app",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://anesbouziadlinks.vercel.app/#website",
      url: "https://anesbouziadlinks.vercel.app",
      name: "Anes Bouziad Links",
      description: "Official bio link-in-bio page for Anes Bouziad",
      publisher: {
        "@id": "https://anesbouziadlinks.vercel.app/#person",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://anesbouziadlinks.vercel.app/#webpage",
      url: "https://anesbouziadlinks.vercel.app",
      name: "Anes Bouziad | Links, Portfolio & Official Socials",
      isPartOf: {
        "@id": "https://anesbouziadlinks.vercel.app/#website",
      },
      about: {
        "@id": "https://anesbouziadlinks.vercel.app/#person",
      },
      mainEntity: {
        "@id": "https://anesbouziadlinks.vercel.app/#person",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} min-h-full h-full antialiased`}>
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bricolage+Grotesque:opsz,wght@12..96,400;600;700&family=Caveat:wght@500;700&family=Cinzel:wght@600;700&family=Outfit:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;700&family=Poppins:wght@400;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full min-h-screen flex flex-col font-sans m-0 p-0 bg-[#0d0d1a]">
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
