"use client";

import { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Code,
  Users,
  BarChart2,
  Bell,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LearningPathwayModule } from "@/modules/dashboardModules/LearningPathwayModule";
import { CodeRepositoryModule } from "@/modules/dashboardModules/CodeRepositoryModule";
import { PeerCollaborationModule } from "@/modules/dashboardModules/PeerCollaborationModule";
import { ProgressAnalyticsModule } from "@/modules/dashboardModules/ProgressAnalyticsModule";
import { NotificationsModule } from "@/modules/dashboardModules/NotificationsModule";
import { SettingsModule } from "@/modules/dashboardModules/SettingsModule";

interface SidebarProps {
  onModuleChange?: (moduleId: string | null) => void;
}

export function Sidebar({ onModuleChange = () => {} }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setActiveModule(null);
        onModuleChange?.(null);
        setIsCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onModuleChange]);

  const handleModuleClick = (moduleId: string) => {
    const newValue = activeModule === moduleId ? null : moduleId;
    setActiveModule(newValue);
    onModuleChange?.(newValue);
  };

  const modules = [
    {
      id: "learning-pathway",
      icon: BookOpen,
      label: "Learning Pathways",
      component: <LearningPathwayModule />,
    },
    {
      id: "code-repository",
      icon: Code,
      label: "Code Repository",
      component: <CodeRepositoryModule />,
    },
    {
      id: "progress-analytics",
      icon: BarChart2,
      label: "Progress Analytics",
      component: <ProgressAnalyticsModule />,
    },
    {
      id: "peer-collaboration",
      icon: Users,
      label: "Peer Collaboration",
      component: <PeerCollaborationModule />,
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      component: <NotificationsModule />,
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      component: <SettingsModule />,
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-16 left-4 z-40 transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-12" : "w-[320px]"}`}
    >
      {isCollapsed ? (
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center
            text-gray-400 hover:text-white hover:bg-gray-800
            border border-gray-700 transition-colors shadow-xl"
        >
          <ChevronRight size={24} />
        </button>
      ) : (
        <div className="bg-gray-900 rounded-lg shadow-xl w-full">
          <button
            onClick={() => setIsCollapsed(true)}
            className="absolute -right-3 top-6 transform
              bg-gray-900 rounded-full p-2 text-gray-400 hover:text-white
              border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="p-4">
            <div className="space-y-4">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 w-full",
                      "text-gray-400 hover:text-white hover:bg-gray-800/50",
                      "transition-colors duration-200 rounded-lg",
                      isActive && "text-white bg-gray-800/50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm whitespace-nowrap">
                      {module.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeModule && (
            <div
              className="absolute top-full left-0 mt-2 w-80 bg-black/95 
              border border-gray-800 backdrop-blur-sm rounded-lg"
            >
              <div className="p-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {modules.map(
                  (module) =>
                    activeModule === module.id && (
                      <div
                        key={module.id}
                        className="transition-all duration-300"
                      >
                        {module.component}
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
