# Application File Structure

```
fractal-math/
├── src/
│   ├── app/                 # Next.js app directory containing route handlers and pages
│   ├── components/          # Reusable React components
│   ├── config/             # Application configuration files
│   ├── context/            # React context providers
│   ├── data/               # Data models and static data
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries and third-party integrations
│   ├── modules/            # Feature-specific modules including Learning Panel and Knowledge Graph
│   ├── pages/              # Next.js pages (if using pages directory)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions and helpers
├── prisma/                 # Prisma database schema and migrations
├── public/                 # Static assets
├── ref/                    # Documentation and reference materials
└── node_modules/           # Project dependencies

## Key Components

### Learning Panel Module
Location: `src/modules/LearningPanel/`
Purpose: Handles the interactive learning experience and peer learning functionality.

### Knowledge Graph
Location: `src/modules/knowledgeGraph/`
Components:
- ConceptFlow: Manages the flow and relationships between mathematical concepts
- ConceptExplorer: Interface for exploring mathematical concepts and their connections

### Mandelbrot Set Visualization
Location: `src/components/MandelbrotSet.tsx`
Purpose: Provides interactive visualization of the Mandelbrot Set for mathematical exploration

## Configuration Files
- next.config.js: Next.js configuration
- tailwind.config.ts: Tailwind CSS styling configuration
- tsconfig.json: TypeScript configuration
- package.json: Project dependencies and scripts
```
