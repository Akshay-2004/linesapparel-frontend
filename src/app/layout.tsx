import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "LinesApparel - Premium Fashion & Clothing Store",
  description: "Discover premium fashion at LinesApparel. Shop curated collections of clothing and accessories for modern lifestyles. Free shipping on orders over $50. 30-day return policy.",
  keywords: ["fashion", "clothing", "apparel", "online store", "premium fashion", "men's clothing", "women's clothing", "accessories"],
  authors: [{ name: "LinesApparel Team" }],
  creator: "Try N Test Foundation",
  publisher: "LinesApparel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://linesapparel.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "LinesApparel - Premium Fashion & Clothing Store",
    description: "Discover premium fashion at LinesApparel. Shop curated collections of clothing and accessories for modern lifestyles.",
    url: "https://linesapparel.ca",
    siteName: "LinesApparel",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LinesApparel - Premium Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinesApparel - Premium Fashion & Clothing Store",
    description: "Discover premium fashion at LinesApparel. Shop curated collections of clothing and accessories for modern lifestyles.",
    images: ["/og-image.jpg"],
    creator: "@linesapparel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <NextTopLoader
            showSpinner={false}
            color="#000"
          />

          {children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
