//ProgressAnalyticsModule Purpose: Provides insights and analytics on the user’s learning progress. 
//Subcomponents:
//CompletionStats: Displays statistics like total concepts learned and pathways completed.
//LearningTrendsChart: A graphical representation of learning trends over time. 
//RecommendationPanel: Suggests next steps based on user progress.

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { dashboardTooltips } from '@/config/dashboardTooltips'

export function ProgressAnalyticsModule() {
  const data = [
    { name: 'Week 1', concepts: 5 },
    { name: 'Week 2', concepts: 8 },
    { name: 'Week 3', concepts: 12 },
    { name: 'Week 4', concepts: 15 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Learning Progress</h2>
            <InfoTooltip 
              content={
                <div className="space-y-1">
                  <p className="font-medium">{dashboardTooltips.progressAnalytics.title}</p>
                  <p>{dashboardTooltips.progressAnalytics.description}</p>
                </div>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Concepts Learned per Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="concepts" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overall Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc">
                <li>Total concepts learned: 40</li>
                <li>Pathways completed: 2</li>
                <li>Active streak: 7 days</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}