"use client";

import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Peer } from "@/types/peer";

interface PeerProfileProps {
  peer: Peer;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  showRole?: boolean;
  showConcept?: boolean;
}

export function PeerProfile({ 
  peer, 
  size = "md",
  showStatus = true,
  showRole = false,
  showConcept = false,
}: PeerProfileProps) {
  const dimensions = {
    sm: { width: 32, height: 32, container: "h-8 w-8", status: "h-2.5 w-2.5" },
    md: { width: 40, height: 40, container: "h-10 w-10", status: "h-3 w-3" },
    lg: { width: 48, height: 48, container: "h-12 w-12", status: "h-3.5 w-3.5" },
  }[size];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative">
          <div className={cn(
            dimensions.container,
            "rounded-full overflow-hidden border-2 border-background hover:translate-y-[-2px] transition-transform bg-gray-700"
          )}>
            <div className="relative h-full w-full">
              <Image
                src={`https://robohash.org/${peer.id}?set=set4&size=64x64`}
                alt={peer.name}
                width={dimensions.width}
                height={dimensions.height}
                className="object-cover"
              />
            </div>
          </div>
          {showStatus && (
            <span
              className={cn(
                dimensions.status,
                "absolute bottom-0 right-0 rounded-full border-2 border-background",
                peer.status === "online"
                  ? "bg-green-500"
                  : peer.status === "away"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              )}
            />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1">
          <div className="font-medium">{peer.name}</div>
          {showRole && (
            <div className="text-xs text-muted-foreground capitalize">
              {peer.role}
            </div>
          )}
          {showStatus && (
            <div className="text-xs text-muted-foreground">
              {peer.status === "online" 
                ? "Online"
                : peer.status === "away"
                ? `Away • ${peer.lastActive}`
                : `Offline • ${peer.lastActive}`
              }
            </div>
          )}
          {showConcept && peer.currentConcept && (
            <div className="text-xs text-muted-foreground">
              Learning: {peer.currentConcept}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
