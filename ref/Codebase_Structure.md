Codebase_Structure.md

```mermaid
graph TD
    A[Project Root] --> B[src]
    A --> C[prisma]
    A --> D[public]
    A --> E[.env.local]
    A --> F[package.json]
    A --> G[next.config.ts]
    A --> H[tsconfig.json]

    B --> I[app]
    B --> J[components]
    B --> K[lib]
    B --> L[types]
    B --> M[middleware.ts]

    I --> N[api]
    I --> O[about]
    I --> P[layout.tsx]
    I --> Q[page.tsx]
    I --> R[providers.tsx]

    N --> S[auth]
    S --> T[[...nextauth]]
    T --> U[route.ts]

    O --> V[page.tsx]

    J --> W[Navigation.tsx]
    J --> X[MandelbrotSet.tsx]
    J --> Y[ConceptFlow.tsx]
    J --> Z[AuthButton.tsx]

    K --> AA[auth.ts]
    K --> AB[wolfram.ts]

    L --> AC[curves.ts]

    C --> AD[schema.prisma]
    C --> AE[seed.ts]
    C --> AF[docker-compose.yml]
```

# Codebase Structure

## Project Structure
The codebase follows a standard Next.js project structure with additional organization for maintainability and scalability.

## Key Directories
- `/src`: Main source code
  - `/app`: Next.js app router pages and API routes
  - `/components`: Reusable React components
  - `/lib`: Utility functions and configurations
  - `/types`: TypeScript type definitions
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Architecture Overview
The application follows a layered architecture pattern as shown in the diagrams below. Key aspects include:

- Clear separation between frontend, data layer, and backend
- Component-based UI architecture
- Type-safe data flow
- API-driven data fetching
- Secure authentication flow

```mermaid
graph TD
subgraph Application_Architecture["Application Architecture"]
    Root[("Application Root")]
    subgraph Frontend_Layer["Frontend Layer"]
        Pages[("Pages")]
        Components[("Components")]
        Hooks[("Custom Hooks")]
        Utils[("Utilities")]
    end
    subgraph Data_Layer
        State[("State Management")]
        APIs[("API Integration")]
        Auth[("Authentication")]
    end
    subgraph Backend_Layer
        Routes[("API Routes")]
        Middleware[("Middleware")]
        DB[("Database")]
    end
    %% Frontend Connections
    Root --> Frontend_Layer
    Root --> Data_Layer
    Root --> Backend_Layer
    %% Frontend Details
    Pages --> |Uses| Components
    Pages --> |Uses| Hooks
    Components --> |Uses| Hooks
    Components --> |Uses| Utils
    %% Data Layer Connections
    State --> |Updates| Components
    APIs --> |Feeds| State
    Auth --> |Secures| APIs
    %% Backend Connections
    Routes --> |Validates| Middleware
    Routes --> |Queries| DB
    Auth --> |Protects| Routes
    %% Cross-layer Interactions
    Components --> |Calls| APIs
    APIs --> |Requests| Routes
end

%% Styling
classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
classDef layer fill:#e4f0f8,stroke:#333,stroke-width:2px;
classDef root fill:#f8d7da,stroke:#721c24,stroke-width:3px;
classDef component fill:#d4edda,stroke:#155724,stroke-width:2px;
classDef data fill:#fff3cd,stroke:#856404,stroke-width:2px;
classDef backend fill:#cce5ff,stroke:#004085,stroke-width:2px;

class Root root;
class Pages,Components,Hooks,Utils component;
class State,APIs,Auth data;
class Routes,Middleware,DB backend;
class Frontend_Layer,Data_Layer,Backend_Layer layer;
```