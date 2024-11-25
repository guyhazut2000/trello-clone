import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <section className="container p-4 mx-auto space-y-4">{children}</section>
  );
}
