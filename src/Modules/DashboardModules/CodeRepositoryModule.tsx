//CodeRepositoryModule Purpose: Allows users to view, edit, and manage their stored code snippets. 
//Subcomponents: 
//SnippetList: A list of all stored snippets with metadata. 
//SnippetEditor: A code editor with syntax highlighting and live preview. 
//SnippetActionsBar: Buttons for saving, deleting, or exporting snippets.

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { dashboardTooltips } from '@/config/dashboardTooltips'

export function CodeRepositoryModule() {
  const snippets = [
    { id: 1, title: 'Calculate Circle Area', language: 'TypeScript' },
    { id: 2, title: 'Pythagorean Theorem', language: 'Python' },
    { id: 3, title: 'Vector Operations', language: 'JavaScript' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Code Repository</CardTitle>
          <InfoTooltip 
            content={
              <div className="space-y-1">
                <p className="font-medium">{dashboardTooltips.codeRepository.title}</p>
                <p>{dashboardTooltips.codeRepository.description}</p>
              </div>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Code Snippets</h2>
            <Button>Add New Snippet</Button>
          </div>
          {snippets.map((snippet) => (
            <Card key={snippet.id}>
              <CardHeader>
                <CardTitle>{snippet.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Language: {snippet.language}</p>
                <div className="mt-2 space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}