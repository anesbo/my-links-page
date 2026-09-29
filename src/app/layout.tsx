import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/lib/config-context";
import { getPublishedConfig } from "@/lib/redis";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getPublishedConfig();
  const name = config.identity?.displayName || "Anes Bouziad";
  const bio =
    config.identity?.subtitle ||
    "Official links and bio page. Explore my portfolio, projects, and connect across all platforms.";

  return {
    metadataBase: new URL("https://anesbouziadlinks.vercel.app"),
    title: {
      default: `${name} | Links, Portfolio & Official Socials`,
      template: `%s | ${name}`,
    },
    description: bio,
    applicationName: `${name} Links`,
    authors: [{ name, url: "https://anesbouziadlinks.vercel.app" }],
    creator: name,
    publisher: name,
    keywords: [
      name,
      `${name} links`,
      "link in bio",
      "developer portfolio",
      "software engineer",
    ],
    alternates: {
      canonical: "https://anesbouziadlinks.vercel.app",
    },
    openGraph: {
      title: `${name} | Links, Portfolio & Official Socials`,
      description: bio,
      url: "https://anesbouziadlinks.vercel.app",
      siteName: name,
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Links, Portfolio & Official Socials`,
      description: bio,
      creator: "@anesbo",
    },
    robots: {
      index: true,
      follow: true,
    },
    category: "technology",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialData = await getPublishedConfig();
  const name = initialData.config.identity?.displayName || "Anes Bouziad";
  const bio = initialData.config.identity?.subtitle || "Developer & Creator";

  const dynamicJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://anesbouziadlinks.vercel.app/#person",
        name: name,
        url: "https://anesbouziadlinks.vercel.app",
        jobTitle: bio,
        description: bio,
        sameAs: (initialData.config.identity?.socialLinks || [])
          .map((s) => s.url)
          .filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": "https://anesbouziadlinks.vercel.app/#website",
        url: "https://anesbouziadlinks.vercel.app",
        name: `${name} Links`,
        description: `Official bio link-in-bio page for ${name}`,
        publisher: {
          "@id": "https://anesbouziadlinks.vercel.app/#person",
        },
      },
      {
        "@type": "ProfilePage",
        "@id": "https://anesbouziadlinks.vercel.app/#webpage",
        url: "https://anesbouziadlinks.vercel.app",
        name: `${name} | Links, Portfolio & Official Socials`,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dynamicJsonLd) }}
        />
      </head>
      <body className="min-h-full min-h-screen flex flex-col font-sans m-0 p-0 bg-[#0d0d1a]">
        <ConfigProvider
          initialConfig={initialData.config}
          isConfigured={initialData.isConfigured}
          initialPublishedAt={initialData.publishedAt}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
