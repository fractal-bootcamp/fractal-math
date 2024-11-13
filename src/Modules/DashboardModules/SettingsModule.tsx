"use client"

import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'

export function SettingsModule() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6 p-4 bg-background text-foreground">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">Notifications</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch id="email-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Push Notifications</Label>
          <Switch id="push-notifications" defaultChecked />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">Appearance</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-toggle">Dark Mode</Label>
          <Switch 
            id="theme-toggle"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">Privacy</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="public-profile">Public Profile</Label>
          <Switch id="public-profile" defaultChecked />
        </div>
      </div>
      
      <Button className="w-full">
        Save Settings
      </Button>
    </div>
  )
}