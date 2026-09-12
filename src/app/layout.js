import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clarion — Here When You Need Clarity",
  description:
    "Cutting through the noise so you can finally see clearly. Clarion appears when you're stuck, calm and steady, until the path ahead is obvious.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-horizon-primary text-horizon-text-light">
        {children}
      </body>
    </html>
  );
}