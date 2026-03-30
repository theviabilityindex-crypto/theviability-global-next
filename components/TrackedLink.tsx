"use client";

import Link from "next/link";
import React from "react";

type TrackedLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  eventName: string;
  eventLabel: string;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function TrackedLink({
  href,
  children,
  className,
  eventName,
  eventLabel,
}: TrackedLinkProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        event_category: "engagement",
        event_label: eventLabel,
        link_url: href,
      });
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}