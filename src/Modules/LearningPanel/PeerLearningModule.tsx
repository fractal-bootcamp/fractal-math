"use client";

import { PeerProfile } from "@/components/PeerProfile";
import { MOCK_PEERS } from "@/types/peer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PeerLearningModule() {
  const onlinePeers = MOCK_PEERS.filter(peer => peer.status === "online" || peer.status === "away");
  const offlinePeers = MOCK_PEERS.filter(peer => peer.status === "offline");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Learning Together</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Online Peers */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Online Now</h4>
          <div className="space-y-2">
            {onlinePeers.map((peer) => (
              <div key={peer.id} className="flex items-center gap-3 group">
                <PeerProfile 
                  peer={peer}
                  size="md"
                  showStatus={true}
                  showRole={true}
                  showConcept={true}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{peer.name}</div>
                  {peer.currentConcept && (
                    <div className="text-xs text-muted-foreground truncate">
                      Learning: {peer.currentConcept}
                    </div>
                  )}
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Peers */}
        {offlinePeers.length > 0 && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-medium text-muted-foreground">Offline</h4>
            <div className="space-y-2">
              {offlinePeers.map((peer) => (
                <div key={peer.id} className="flex items-center gap-3 opacity-60">
                  <PeerProfile 
                    peer={peer}
                    size="sm"
                    showStatus={true}
                    showRole={true}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{peer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Last seen {peer.lastActive}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
