"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ConceptFlow from "@/components/ConceptFlow";
import { Sidebar } from "@/components/Sidebar";

export default function LearnPage() {
  const { status } = useSession();

  if (status === "loading") {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1">
        <div className="h-full w-full flex flex-col items-center pt-8">
          <h1 className="text-2xl font-bold text-white mb-4">
            Mathematical Concepts
          </h1>
          <div className="w-full max-w-[1200px] aspect-[16/9] bg-black/50 rounded-lg relative">
            <ConceptFlow />
          </div>
        </div>
      </main>
    </div>
  );
}
