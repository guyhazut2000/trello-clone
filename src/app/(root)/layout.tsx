import React, { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { PageWrapper } from "@/components/page-wrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col mx-auto">
      <Navbar />
      <div className="flex flex-1 h-full">
        <div className="w-56 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1">
          <PageWrapper>{children}</PageWrapper>
        </div>
      </div>
    </main>
  );
}
