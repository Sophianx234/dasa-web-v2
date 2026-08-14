import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/Providers";
import NavigationWrapper from "@/components/features/ui/NavigationWrapper";
import Footer from "@/components/features/ui/Footer";
import GlobalLoader from "@/components/features/ui/GlobalLoader";
import { LayoutVisibility } from "@/components/features/ui/LayoutVisibility";

export const metadata: Metadata = {
  metadataBase: new URL("https://dasa.com"), // Placeholder domain, change to actual production URL
  title: {
    default: "Dagbon Students Association (DaSA)",
    template: "%s | DaSA", // This automatically appends "| DaSA" to all child page titles
  },
  description: "The official platform of the Dagbon Students Association. Fostering unity, cultural heritage, and academic excellence among Dagbon students globally.",
  keywords: [
    "Dagbon",
    "DaSA",
    "Dagbon Students Association",
    "Dagbani culture",
    "Northern Ghana students",
    "Ghana universities",
  ],
  authors: [{ name: "Dagbon Students Association" }],
  creator: "Dagbon Students Association",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Dagbon Students Association (DaSA)",
    description: "Fostering unity, cultural heritage, and academic excellence among Dagbon students globally.",
    siteName: "Dagbon Students Association",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dagbon Students Association (DaSA)",
    description: "Fostering unity, cultural heritage, and academic excellence among Dagbon students globally.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-clip`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Chewy&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lobster&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Mulish:ital,wght@0,200..1000;1,200..1000&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Quicksand:wght@300..700&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col overflow-x-clip">
        <Providers>
          <GlobalLoader />
          <LayoutVisibility>
            <NavigationWrapper />
          </LayoutVisibility>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <LayoutVisibility>
            <Footer />
          </LayoutVisibility>
        </Providers>
      </body>
    </html>
  );
}
