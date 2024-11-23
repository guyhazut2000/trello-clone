import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { siteConfig } from "@/config/site";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/onboarding"
        >
          <Providers>{children}</Providers>
        </ClerkProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
