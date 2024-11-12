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