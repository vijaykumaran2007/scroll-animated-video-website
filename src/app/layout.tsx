import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisWrapper from "./components/LenisWrapper";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://madebyvj.web.app'),
  title: {
    default: "Vijay Adithiya | Software Developer & ML Engineer",
    template: "%s | Vijay Adithiya"
  },
  description:
    "Portfolio of Vijay Adithiya, a Computer Science student and Full Stack Software Developer specializing in Flutter, React, Next.js, and Machine Learning.",
  keywords: [
    "Vijay Adithiya",
    "Software Developer",
    "Machine Learning Engineer",
    "Flutter Developer",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Firebase",
    "Computer Science Student",
    "Portfolio",
  ],
  authors: [{ name: "Vijay Adithiya", url: "https://madebyvj.web.app" }],
  creator: "Vijay Adithiya",
  publisher: "Vijay Adithiya",
  applicationName: "Vijay Adithiya Portfolio",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Vijay Adithiya | Software Developer & ML Engineer",
    description: "Portfolio of Vijay Adithiya, a Computer Science student and Full Stack Software Developer specializing in Flutter, React, Next.js, and Machine Learning.",
    url: "https://madebyvj.web.app",
    siteName: "Vijay Adithiya Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vijay Adithiya - Software Developer and ML Engineer Portfolio",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vijay Adithiya | Software Developer & ML Engineer",
    description: "Portfolio of Vijay Adithiya, a Computer Science student and Full Stack Software Developer specializing in Flutter, React, Next.js, and Machine Learning.",
    creator: "@vijayadithiya", // Update with actual handle if available
    images: ["/images/og-image.jpg"],
  },
  verification: {
    google: "sxUiVfYi3JyGs_WI6zyEoR9Ed0lYHUdRr34j4McDd4M",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B1F12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://madebyvj.web.app/#person",
        "name": "Vijay Adithiya",
        "url": "https://madebyvj.web.app",
        "jobTitle": "Software Developer & ML Engineer",
        "sameAs": [
          "https://github.com/vijaykumaran2007",
          "https://linkedin.com/in/vijay-adithiya",
          "https://twitter.com/vijayadithiya"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://madebyvj.web.app/#website",
        "url": "https://madebyvj.web.app",
        "name": "Vijay Adithiya Portfolio",
        "publisher": {
          "@id": "https://madebyvj.web.app/#person"
        }
      }
    ]
  };

  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <div className="portrait-lock-overlay">
          <div className="portrait-lock-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem" }}>
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
            <h2>Please rotate your device</h2>
            <p>This experience is designed for portrait mode.</p>
          </div>
        </div>
        <div className="app-content">
          <LenisWrapper>
            {children}
          </LenisWrapper>
        </div>
      </body>
    </html>
  );
}
