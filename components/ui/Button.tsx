"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 font-medium transition-colors",
        variant === "primary" && "bg-foreground text-background",
        variant === "ghost" && "border border-foreground text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
