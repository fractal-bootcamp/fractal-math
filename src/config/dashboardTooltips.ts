export const dashboardTooltips = {
  learningPath: {
    title: 'Learning Path',
    description: `A personalized educational journey that guides you through mathematical concepts in a structured sequence. 
    Each path is carefully designed to build understanding from fundamental principles to advanced applications, 
    following the historical development and interconnections of mathematical ideas.`
  },
  codeRepository: {
    title: 'Code Repository',
    description: `A collection of your mathematical explorations and implementations. 
    Store, organize, and share your code snippets, algorithms, and computational experiments 
    related to various mathematical concepts.`
  },
  progressAnalytics: {
    title: 'Progress Analytics',
    description: `Detailed insights into your learning journey. 
    Track your progress across different mathematical concepts, 
    identify areas of strength and opportunities for improvement, 
    and visualize your growth over time.`
  },
  peerCollaboration: {
    title: 'Peer Collaboration',
    description: `Connect with fellow mathematicians and learners. 
    Share insights, discuss problems, and collaborate on mathematical projects. 
    Learn from others' perspectives and contribute to the community's knowledge.`
  }
} as const;

export type DashboardModuleKey = keyof typeof dashboardTooltips;
