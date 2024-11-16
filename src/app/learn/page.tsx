"use client";

import { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/Sidebar";

// Lazy load ConceptFlow
const ConceptFlow = dynamic(() => import("@/modules/knowledgeGraph/ConceptFlow"), {
  loading: () => <LoadingSkeleton />,
  ssr: false
});

function LoadingSkeleton() {
  return (
    <div className="w-full h-full animate-pulse">
      <div className="w-full h-full bg-gray-800/50 rounded-lg flex items-center justify-center">
        <div className="space-y-4 w-3/4">
          <div className="h-4 bg-gray-700/50 rounded w-3/4 mx-auto"></div>
          <div className="h-32 bg-gray-700/50 rounded-full w-32 mx-auto"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  const { status } = useSession();
  const [, setActiveModule] = useState<string | null>(null);

  if (status === "loading") {
    return <LoadingSkeleton />;
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
            <Suspense fallback={<LoadingSkeleton />}>
              <ConceptFlow />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
