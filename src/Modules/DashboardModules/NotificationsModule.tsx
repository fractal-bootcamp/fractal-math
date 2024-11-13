//NotificationsModule Purpose: Displays updates, reminders, and system notifications. 
//Subcomponents: 
//NotificationList: A chronological list of notifications. 
//NotificationItem: A single notification item with options to mark as read or delete. 
//NotificationSettingsShortcut: A quick link to notification settings.

import React from 'react'
import { Bell, MessageCircle, Award } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

interface Notification {
  id: number
  icon: React.ReactNode
  content: string
  time: string
}

const notifications: Notification[] = [
  { id: 1, icon: <Bell className="h-4 w-4" />, content: "New course 'Advanced Geometry' is now available", time: "2 hours ago" },
  { id: 2, icon: <MessageCircle className="h-4 w-4" />, content: "John Doe commented on your solution", time: "5 hours ago" },
  { id: 3, icon: <Award className="h-4 w-4" />, content: "You've earned a new badge: 'Geometry Master'", time: "1 day ago" },
  { id: 4, icon: <Bell className="h-4 w-4" />, content: "Reminder: Complete your daily challenge", time: "1 day ago" },
  { id: 5, icon: <MessageCircle className="h-4 w-4" />, content: "New message in 'Calculus Study Group'", time: "2 days ago" },
]

export function NotificationsModule() {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 p-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start space-x-4 bg-card p-3 rounded-lg shadow">
            <div className="bg-primary text-primary-foreground p-2 rounded-full">
              {notification.icon}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm">{notification.content}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          </div>
        ))}
        <Button className="w-full">Mark All as Read</Button>
      </div>
    </ScrollArea>
  )
}