'use client';

import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import PravisLoader from "./SkeletonLoader";

export default function RouteLoaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 750); // 750ms for effect
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <PravisLoader />}
      {children}
    </>
  );
}
