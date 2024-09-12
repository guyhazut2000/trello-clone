import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return <section className="h-full w-full p-4 mx-auto">{children}</section>;
}
