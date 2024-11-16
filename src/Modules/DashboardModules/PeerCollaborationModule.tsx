//PeerCollaborationModule Purpose: Enables users to collaborate with peers on code or concepts. 
//Subcomponents: 
//CollaborationPanel: Displays active collaboration sessions and participants. 
//ChatWidget: Provides a text-based chat interface. 
//SharedEditor: A collaborative code editor with real-time updates.

import React from 'react'
import { Users, MessageSquare, Video } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { dashboardTooltips } from '@/config/dashboardTooltips'

interface Peer {
  id: number
  name: string
  avatar: string
  status: 'online' | 'offline'
}

const peers: Peer[] = [
  { id: 1, name: "Alice Johnson", avatar: "/avatars/alice.jpg", status: "online" },
  { id: 2, name: "Bob Smith", avatar: "/avatars/bob.jpg", status: "offline" },
  { id: 3, name: "Charlie Brown", avatar: "/avatars/charlie.jpg", status: "online" },
  { id: 4, name: "Diana Ross", avatar: "/avatars/diana.jpg", status: "online" },
  { id: 5, name: "Ethan Hunt", avatar: "/avatars/ethan.jpg", status: "offline" },
]

export function PeerCollaborationModule() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Peer Collaboration</CardTitle>
          <InfoTooltip 
            content={
              <div className="space-y-1">
                <p className="font-medium">{dashboardTooltips.peerCollaboration.title}</p>
                <p>{dashboardTooltips.peerCollaboration.description}</p>
              </div>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Study Groups</h3>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>
          
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {peers.map((peer) => (
                <div key={peer.id} className="flex items-center justify-between bg-card p-3 rounded-lg shadow">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={peer.avatar} alt={peer.name} />
                      <AvatarFallback>{peer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{peer.name}</p>
                      <p className={`text-xs ${peer.status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
                        {peer.status}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <Button className="w-full">Find Study Partners</Button>
        </div>
      </CardContent>
    </Card>
  )
}