"use client"

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
        <div className="flex h-screen bg-black pt-16">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6 text-white text-center">Mathematical Concepts</h1>
                    <div className="w-full h-[600px] border border-gray-800 rounded-lg bg-black/50">
                        <ConceptFlow />
                    </div>
                </div>
            </main>
        </div>
    );
} 