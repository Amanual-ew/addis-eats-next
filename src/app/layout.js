import "./globals.css";
import { Poppins  } from "next/font/google";
import { CartProvider } from "../components/CartProvider";
import SWRProvider from "../components/SWRProvider";
import Header from "../components/Header";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    template: "%s - Addis Eats",
    default: "Addis Eats - food delivery in Addis Ababa",
  },

  description:
    "Order Doro Wat, Tibs, Kitfo and Shiro from kitchens across Addis Ababa. Fast delivery, paid with TeleBirr.",

  applicationName: "Addis Eats",

  openGraph: {
    type: "website",
    locale: "en_ET",
    siteName: "Addis Eats",
    title: "Addis Eats - food delivery in Addis Ababa",
    description:
      "Fresh Ethiopian food, delivered with love across Addis Ababa.",
    // images are auto-injected from app/opengraph-image.png
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="flex min-h-screen flex-col bg-[#fffaf7] text-gray-800 antialiased">
        <SWRProvider>
          <CartProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <footer className="mt-16 border-t border-orange-100 bg-white">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row">
                <p className="font-bold text-gray-900">
                  🍴 Addis<span className="text-[#ff6f61]">Eats</span>
                </p>
                <p>Fresh Ethiopian food, delivered with love.</p>
                <p>© 2026 Addis Eats</p>
              </div>
            </footer>
          </CartProvider>
        </SWRProvider>
      </body>
    </html>
  );
}