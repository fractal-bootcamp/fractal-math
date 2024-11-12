"use client"

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ConceptFlow from "@/components/ConceptFlow";

export default function LearnPage() {
    const { status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-black text-white pt-16">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Mathematical Concepts</h1>
                <div className="w-full h-[600px] border border-gray-700 rounded-lg">
                    <ConceptFlow />
                </div>
            </div>
        </div>
    );
} 