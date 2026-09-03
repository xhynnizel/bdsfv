import { Fraunces, Quicksand } from "next/font/google";
import "./globals.css";
import GlobalProtection from "@/components/GlobalProtection";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "You've got a new message 💌",
  description: "A little surprise, made with love.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-cream text-plum font-body antialiased">
        <GlobalProtection />
        {children}
      </body>
    </html>
  );
}
