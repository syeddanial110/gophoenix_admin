"use client";

import { pathLocations } from "@/utils/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    // This will run only on the client side
    router.push(`${pathLocations.dashboard}`)
  }, []);
  return (
    <div className="flex flex-col items-center h3 pt-10 gap-3">
     
    </div>
  );
}
