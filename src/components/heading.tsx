import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export const Heading = ({ children, className, ...props }: HeadingProps) => {
  return (
    <h1
      className={cn(
        "flex items-center text-xl sm:text-2xl text-pretty font-heading font-semibold tracking-tight text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};
