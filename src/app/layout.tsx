import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateWebSiteSchema } from "@/lib/seo";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://botad-movie.vercel.app'),
  title: {
    default: "Botad Movies - Download Movies in HD",
    template: "%s | Botad Movies",
  },
  description: "Download your favorite movies in high quality. Exclusive movie collection available for free download.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://botad-movie.vercel.app',
    siteName: 'Botad Movies',
    title: 'Botad Movies - Free HD Movie Downloads',
    description: 'The best place to download latest movies in HD quality.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Botad Movies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Botad Movies - Free HD Movie Downloads',
    description: 'Download latest movies in HD. Fast and secure.',
    creator: '@botadmovies',
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
  verification: {
    google: 'gsvx2awCtISzeyZnX7O1W7qugK9ZC8MWAwakTLW6Rxw',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,gu,hi',
                  autoDisplay: false
                }, 'google_translate_element');

                // Inject CSS to override Google Translate UI shifts immediately
                const css = \`
                  body { top: 0 !important; position: static !important; }
                  .skiptranslate, .goog-te-banner-frame, .goog-te-banner, .goog-te-menu-frame, #goog-gt-tt { 
                    display: none !important; 
                    visibility: hidden !important; 
                  }
                  .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
                \`;
                const style = document.createElement('style');
                style.appendChild(document.createTextNode(css));
                document.head.appendChild(style);
              }
            `,
          }}
        />
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered');
                  }).catch(function(err) {
                    console.log('SW failed', err);
                  });
                });
              }
            `,
          }}
        />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
