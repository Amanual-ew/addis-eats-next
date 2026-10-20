import "./globals.css";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { CartProvider } from "../components/CartProvider";
import SWRProvider from "../components/SWRProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

// Colors the phone's address bar to match the page
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#12100e" },
  ],
};

// Runs before the page paints, so dark-mode visitors never see a white flash.
// Uses the saved choice, or the device setting on the first visit.
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var dark = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the script above may add the "dark" class
    // before React loads, which is expected.
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-[#fffaf7] text-gray-800 antialiased dark:bg-[#12100e]">
        {/* next/script (not a plain <script>): React 19 warns about those. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />

        {/* Keyboard users can jump straight past the header */}
        <a
          href="#content"
          className="sr-only z-[60] rounded-lg bg-[#ff6f61] px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <SWRProvider>
          <CartProvider>
            <Header />
            <div id="content" className="flex-1">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </SWRProvider>
      </body>
    </html>
  );
}