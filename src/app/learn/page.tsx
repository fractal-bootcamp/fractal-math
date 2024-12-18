"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ConceptFlow from "@/components/ConceptFlow";
import { Sidebar } from "@/components/Sidebar";

export default function LearnPage() {
  const { status } = useSession();
  const [, setActiveModule] = useState<string | null>(null);

  if (status === "loading") {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar onModuleChange={setActiveModule} />
      <main className="flex-1">
        <div className="h-full w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white mb-4 p-10 mt-16">
            Algebraic Curves
          </h1>
          <div className="w-full h-full bg-black/50 rounded-lg relative">
            <ConceptFlow />
          </div>
        </div>
      </main>
    </div>
  );
}
