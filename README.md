# Fractal Math Learning Platform

An interactive platform for exploring mathematical concepts through fractals, visualizations, and guided learning paths.

## Features

- **Interactive Concept Map**: Visual representation of mathematical concepts and their relationships
- **Fractal Visualizations**: Dynamic Mandelbrot set explorer with interactive controls
- **Authentication**: Secure user accounts to track learning progress
- **Learning Paths**: Structured approach to understanding mathematical concepts

## Tech Stack

- **Frontend**: Next.js 15.0, React 19.0
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **Visualization**: D3.js, P5.js
- **Styling**: Tailwind CSS

## Getting Started

First, run the development server:

```bash
# Install dependencies
bun install

# Start the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js 13+ app directory
├── components/       # Reusable React components
├── lib/             # Utility functions and configurations
└── types/           # TypeScript type definitions
```

## Development

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font family.

### Prerequisites

- Node.js 18+
- Bun package manager
- PostgreSQL database

### Environment Variables

Create a `.env.local` file in the root directory with:

```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
