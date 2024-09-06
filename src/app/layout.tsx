import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { siteConfig } from "@/config/site";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // icons: [
  //   {
  //     rel: "icon",
  //     url: "/logo.svg",
  //     href: "/logo.svg",
  //   },
  // ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <div className="h-full">{children}</div>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
