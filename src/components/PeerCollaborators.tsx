"use client";

import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PeerProfile } from "@/components/PeerProfile";
import { MOCK_PEERS } from "@/types/peer";

interface Peer {
  id: string;
  name: string;
  status: "online" | "offline" | "away";
}

const MOCK_PEERS: Peer[] = [
  { id: "1", name: "Alice Chen", status: "online" },
  { id: "2", name: "Bob Smith", status: "online" },
  { id: "3", name: "Carol Davis", status: "away" },
  { id: "4", name: "David Wilson", status: "offline" },
];

export function PeerCollaborators() {
  return (
    <div className="flex -space-x-2 overflow-hidden p-2">
      {MOCK_PEERS.map((peer) => (
        <PeerProfile 
          key={peer.id} 
          peer={peer}
          size="sm"
          showStatus={true}
          showRole={false}
          showConcept={true}
        />
      ))}
    </div>
  );
}
