"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface ConceptCardProps {
  conceptId: string;
  onSelect: (conceptId: string) => void;
}

export default function ConceptCards({
  conceptId,
  onSelect,
}: ConceptCardProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await onSelect(conceptId);
    } catch (error) {
      console.error("Error handling card click:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-lg transition-shadow",
        loading && "opacity-50 pointer-events-none"
      )}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle>{conceptId}</CardTitle>
      </CardHeader>
    </Card>
  );
}
