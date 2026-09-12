import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Clarion | Here When You Need Clarity",
  description:
    "Clearing the noise so you can finally see your way forward. Clarion shows up when you're stuck, calm and steady, until the path ahead is clear.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico?v=2" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased`}>
      <body className={`${sora.className} min-h-full flex flex-col bg-horizon-primary text-horizon-text-light`}>
        {children}
      </body>
    </html>
  );
}