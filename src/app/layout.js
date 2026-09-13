import { Sora, Caveat, Playfair_Display } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  preload: false,
});
export const viewport = {
  themeColor: "#0D2B2E",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Clarion | Here When You Need Clarity",
  description:
    "Clearing the noise so you can finally see your way forward. Clarion shows up when you're stuck, calm and steady, until the path ahead is clear.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico?v=2" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${caveat.variable} ${playfair.variable} h-full antialiased`}>
      <body className={`${sora.className} min-h-full flex flex-col bg-horizon-primary text-horizon-text-light`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}