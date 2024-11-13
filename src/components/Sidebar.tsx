"use client"

import { useState } from 'react'
import { BookOpen, Code, Users, BarChart2, Bell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LearningPathwayModule } from '@/Modules/DashboardModules/LearningPathwayModule'
import { CodeRepositoryModule } from '@/Modules/DashboardModules/CodeRepositoryModule'
import { PeerCollaborationModule } from '@/Modules/DashboardModules/PeerCollaborationModule'
import { ProgressAnalyticsModule } from '@/Modules/DashboardModules/ProgressAnalyticsModule'
import { NotificationsModule } from '@/Modules/DashboardModules/NotificationsModule'
import { SettingsModule } from '@/Modules/DashboardModules/SettingsModule'

export function Sidebar() {
  const [activeModule, setActiveModule] = useState<string | null>(null)

  const modules = [
    {
      id: 'learning-pathway',
      icon: BookOpen,
      label: 'Learning Pathways',
      component: <LearningPathwayModule />
    },
    {
      id: 'code-repository',
      icon: Code,
      label: 'Code Repository',
      component: <CodeRepositoryModule />
    },
    {
      id: 'progress-analytics',
      icon: BarChart2,
      label: 'Progress Analytics',
      component: <ProgressAnalyticsModule />
    },
    {
      id: 'peer-collaboration',
      icon: Users,
      label: 'Peer Collaboration',
      component: <PeerCollaborationModule />
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      component: <NotificationsModule />
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      component: <SettingsModule />
    }
  ]

  return (
    <div className="relative flex h-[calc(100vh-4rem)]">
      <div className="w-64 bg-black border-r border-gray-800 z-20">
        <div className="flex flex-col h-full py-2">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id

            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(isActive ? null : module.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2",
                  "text-gray-400 hover:text-white hover:bg-gray-800/50",
                  "transition-colors duration-200",
                  isActive && "text-white bg-gray-800/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">
                  {module.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex-1">
        {/* Your mathematical concepts content goes here */}
      </div>
      {activeModule && (
        <div className="fixed top-16 left-64 bottom-0 w-80 bg-black/95 border-r border-gray-800 backdrop-blur-sm z-30">
          <div className="p-4 h-full overflow-y-auto">
            {modules.map((module) => (
              activeModule === module.id && (
                <div key={module.id} className="transition-all duration-300">
                  {module.component}
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 