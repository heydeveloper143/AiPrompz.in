// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ---- Update this with your site details ----
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
const siteName = "AI Gemini Prompt Gallery";
const siteDescription =
  "Discover trending AI prompts for Gemini AI. Free prompt gallery with categories, tutorials, and tips.";
const siteImage = `${siteUrl}/default-og-image.jpg`; // Add your OG image in public/

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@your_twitter", // update with your handle
    title: siteName,
    description: siteDescription,
    images: [siteImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google AdSense Auto Ads */}
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxx"
          crossOrigin="anonymous"
        />

        {/* ✅ Google Analytics */}
        <Script
          id="ga-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-6 mt-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm space-y-2">
            <div>&copy; {new Date().getFullYear()} AI Gemini Prompt Gallery. All rights reserved.</div>
            <div>
              <a href="/privacy-policy" className="underline hover:text-gray-300">
                Privacy Policy
              </a>
            </div>
            
          </div>
        </footer>
      </body>
    </html>
  );
}
