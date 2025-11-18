import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "SaaSify - Build Your SaaS Product Fast",
    template: "%s | SaaSify",
  },
  description: "A beautifully designed, production-ready SaaS template with authentication, database setup, and everything you need to launch fast.",
  keywords: ["SaaS", "template", "Next.js", "authentication", "boilerplate"],
  authors: [{ name: "SaaSify Team" }],
  creator: "SaaSify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
