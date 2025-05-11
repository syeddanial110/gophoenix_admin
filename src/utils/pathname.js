"use client";
import { usePathname } from "next/navigation";
import React from "react";

const pathname = () => {
  const pathname = usePathname();
  return pathname;
};

export default pathname;
