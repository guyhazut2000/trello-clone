import React from "react";

interface PagesWrapperProps {
  children: React.ReactNode;
}

export function PagesWrapper({ children }: PagesWrapperProps) {
  return <section className="h-full w-full p-4 mx-auto">{children}</section>;
}
