"use client";

import { ButtonHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Loader } from "./loader";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  idleText: string;
  submittingText: string;
  pending: boolean;
}
export function SubmitButton({
  idleText,
  submittingText,
  pending,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "disabled:bg-gray-400 disabled:cursor-default w-full",
        props.className
      )}
      disabled={pending}
    >
      {pending ? (
        <div className="flex justify-center items-center gap-2">
          <span>{submittingText}</span>
          <Loader />
        </div>
      ) : (
        idleText
      )}
    </Button>
  );
}
