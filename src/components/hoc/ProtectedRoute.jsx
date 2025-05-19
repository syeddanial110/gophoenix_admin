"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  //   if (!user) {
  //     return null;
  //   }

  return <>{children}</>;
}
