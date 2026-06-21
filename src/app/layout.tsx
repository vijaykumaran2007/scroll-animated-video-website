import type { Metadata } from "next";
import { Audiowide, Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";

const audiowide = Audiowide({
  weight: "400",
  variable: "--font-audiowide",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vijay Adithiya E | Portfolio",
  description: "Computer Science Student, Flutter & AI Enthusiast Portfolio website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${audiowide.variable} ${plusJakartaSans.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

