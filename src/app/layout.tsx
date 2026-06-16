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
          colorPrimary: "#7c3aed",
          colorBackground: "#0f0f1a",
          colorInputBackground: "#1a1a2e",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#a1a1aa",
          colorShimmer: "#1a1a2e",
          borderRadius: "12px",
        },
        elements: {
          otpCodeFieldInput: "!bg-white/10 !border !border-white/20 !text-white !rounded-xl !text-center !text-2xl !font-bold",
          formFieldInput: "!bg-white/10 !border !border-white/20 !text-white placeholder:!text-zinc-500 !rounded-xl",
          formButtonPrimary: "!bg-violet-600 hover:!bg-violet-700 !text-white !font-semibold !rounded-xl",
          footerActionLink: "!text-violet-400 hover:!text-violet-300 !font-medium",
          card: "!bg-[#13131a] !border !border-white/10",
          formResendCodeLink: "!text-violet-400 hover:!text-violet-300",
          backLink: "!text-violet-400 hover:!text-violet-300",
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
