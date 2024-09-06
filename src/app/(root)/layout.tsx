import React, { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col max-w-6xl 2xl:max-w-screen-2xl mx-auto">
      <Navbar />
      <div className="flex flex-1 gap-x-7 h-full">
        <div className="w-56 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
