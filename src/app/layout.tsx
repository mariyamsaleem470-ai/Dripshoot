import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Analytics from "@/components/Analytics";
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
  title: "Dripshoots",
  description: "AI-Powered Fashion Photography — No Studio Needed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: '#7c3aed',
          colorBackground: '#13131a',
          colorInputBackground: '#1a1a2e',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: '#9ca3af',
          borderRadius: '0.75rem',
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col"><Analytics />{children}</body>
      </html>
    </ClerkProvider>
  );
}
