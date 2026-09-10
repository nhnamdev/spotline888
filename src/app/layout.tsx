import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientAuthGuard from "@/components/auth/ClientAuthGuard";
import { I18nProvider } from "@/components/sites/spotline888-org/pages-login-login/i18n";
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
  title: "Website Clone",
  description: "Pixel-perfect website clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="/assets/libs/font-awesome/css/font-awesome.min.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <ClientAuthGuard>{children}</ClientAuthGuard>
        </I18nProvider>
      </body>
    </html>
  );
}
