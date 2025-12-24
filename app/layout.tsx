import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Footer } from "@/components/layout/Footer";
import { AIThemeSwitcher } from "@/components/utility/AIThemeSwitcher";
import { Toaster } from "@/components/ui/sonner";
import { MessengerBridge } from "@/components/social/MessengerBridge";
import { WhatsAppWidget } from "@/components/social/WhatsAppWidget";
import { Preloader } from "@/components/ui/Preloader";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    template: "%s | MOBILE HUB",
    default: "MOBILE HUB | IDENTIFY THE DIFFERENCE"
  },
  description: "Official authorized genuine devices in Sri Lanka. Apple, Samsung, Xiaomi & Luxury Tech. Premium logistics, TRCSL approved assets, elite after-sales support.",
  keywords: ["Mobile Hub Sri Lanka", "Authorized Apple Reseller Sri Lanka", "Genuine Samsung Phones", "Xiaomi Sri Lanka", "Seeduwa Mobile Shop", "iPhone 15 Pro Sri Lanka", "Premium Tech Boutique"],
  authors: [{ name: "Mobile Hub Technical Staff" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "https://mobilehub.lk",
    siteName: "MOBILE HUB",
    title: "MOBILE HUB | IDENTIFY THE DIFFERENCE",
    description: "Official authorized genuine devices in Sri Lanka. Boutique tech excellence.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mobile Hub Institutional Identity" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "MOBILE HUB | IDENTIFY THE DIFFERENCE",
    description: "Official authorized genuine devices in Sri Lanka.",
    images: ["/og-image.jpg"]
  }
}

import { Providers } from "@/components/providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-black text-white selection:bg-primary selection:text-black overflow-x-hidden`}>
        <Providers>
          <Navbar />

          <main className="min-h-screen">
            {children}
          </main>

          <Preloader />
          <ChatInterface />
          <Footer />
          <AIThemeSwitcher />
          <Toaster />
          <MessengerBridge />
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  );
}
