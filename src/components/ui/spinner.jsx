"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className, size = "md" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-4",
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-gray-300 border-t-gray-900",
        sizes[size],
        className
      )}
    />
  );
}
