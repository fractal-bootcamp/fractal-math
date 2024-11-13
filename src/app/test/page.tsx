// app/test/page.tsx
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { circle } from "../../data/curves";

export default function TestPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to view this page</div>;
  }

  return <div className="p-4">{/* Your existing test page content */}</div>;
}
