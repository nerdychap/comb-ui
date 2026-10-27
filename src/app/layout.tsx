import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CombUI - AI Component Generator",
  description: "Generate React components from text prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col bg-background font-sans text-foreground">
        <Script id="combui-theme" strategy="beforeInteractive">
          {`(function(){try{if(localStorage.getItem("combui-theme")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
