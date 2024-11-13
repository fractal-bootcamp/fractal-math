# Product Requirements Document (PRD) 2

## Application Overview

The application is designed to help users traverse an ontological graph of mathematical geometry knowledge extracted from Wolfram MathWorld. It features an interactive, graphical fractal representation of the ontology, with the ability to explore, learn, and implement mathematical concepts. 

Key features include:
1. **Ontology Graph Visualization**: A responsive, fractal graph interface representing the geometry ontology.
2. **Learning Modules**: Embedded iframes for viewing Wolfram MathWorld pages, LaTeX-rendered formulas, and TypeScript code snippets for functional geometry drawing.
3. **User Code Storage**: A repository for users to store and manage their implemented `.ts` geometry code snippets.
4. **Adaptive Learning Pathways**: Tailored user experiences based on their understanding of mathematical concepts.
5. **Relational Database Integration**: Index and manage users' learning pathways and code repositories.

---

## Functional Requirements

### 1. Ontological Graph Traversal
- Extract and index the geometry subsection of Wolfram MathWorld.
- Use an API, crawler, or similar mechanism to build the graph.
- Visualize the graph using a recursive fractal model:
  - Parent nodes represented by circles.
  - Child nodes represented by hemispherical fractal sub-circles.
- Ensure the graph is interactive and responsive.

### 2. Learning Modules
- Render the following components:
  - **Iframe View**: Display Wolfram MathWorld pages for the selected mathematical concept.
  - **LaTeX Renderer**: Render mathematical formulas in LaTeX.
  - **TypeScript Code Editor**: Provide an editor to manipulate and experiment with the mathematical concept using TypeScript.
  - **Peer REPL Component**: Enable real-time code collaboration and evaluation.
- Allow users to export their code snippets to their personal repository in the application.

### 3. Adaptive Learning Pathways
- Gauge user proficiency in mathematical concepts via:
  - Binary decision-making for confidence in a concept.
  - Assessing foundational and advanced understanding.
- Adjust the knowledge graph and recommendations based on the user’s skill level and learning goals.

### 4. User Code Storage
- Enable users to:
  - Save TypeScript code snippets in a repository.
  - Organize their code based on learning pathways.
  - Store code snippets relationally in a database for future retrieval and analysis.

### 5. Database and Backend
- Use a PostgreSQL database with Prisma as the ORM for CRUD operations.
- Create structured TypeScript interfaces for user data and learning pathways.
- Provide APIs for:
  - User authentication.
  - CRUD operations for the knowledge graph and user repositories.

---

## Technical Requirements

### Data Structures

#### TypeScript Interfaces
```typescript
export interface ConceptNode {
  id: string;
  name: string;
  description: string;
  latexFormula: string;
  relatedConceptIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  learningPathway: LearningPathway[];
}

export interface LearningPathway {
  conceptId: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced";
  codeSnippets: CodeSnippet[];
}

export interface CodeSnippet {
  id: string;
  content: string;
  createdAt: Date;
}
```

### Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String          @id @default(cuid())
  name           String
  email          String          @unique
  learningPathway LearningPathway[]
}

model LearningPathway {
  id          String       @id @default(cuid())
  conceptId   String
  proficiency String       @default("beginner") // Enum: "beginner", "intermediate", "advanced"
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  codeSnippets CodeSnippet[]
}

model CodeSnippet {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  pathwayId String
  pathway   LearningPathway @relation(fields: [pathwayId], references: [id])
}
```

### Backend Boilerplate

#### CRUD APIs
``` typescript
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Create User
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Create Learning Pathway
app.post("/pathways", async (req, res) => {
  const { conceptId, proficiency, userId } = req.body;
  try {
    const pathway = await prisma.learningPathway.create({
      data: { conceptId, proficiency, userId },
    });
    res.json(pathway);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add Code Snippet
app.post("/snippets", async (req, res) => {
  const { content, pathwayId } = req.body;
  try {
    const snippet = await prisma.codeSnippet.create({
      data: { content, pathwayId },
    });
    res.json(snippet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

## User Interface

### Components
1. Ontology Graph Viewer: Visualize the fractal graph of geometry concepts.
2. Learning Module Tabs:
- Concept Theory: Embedded iframe for Wolfram MathWorld.
- LaTeX Formula Renderer.
- TypeScript Code Editor and REPL.
3. User Dashboard:
- Display learning pathways.
- Manage code repositories.

### Interfaces for User Account Page
```typescript
// Interface for User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePictureUrl?: string; // Optional, for avatars
  createdAt: Date;
}

// Interface for Learning Overview
export interface LearningOverview {
  totalConceptsLearned: number;
  activeLearningPathway: string; // e.g., "Euclidean Geometry"
  proficiencyLevel: "beginner" | "intermediate" | "advanced";
  lastActiveDate: Date;
}

// Interface for Code Repository
export interface CodeRepository {
  snippetId: string;
  conceptId: string; // Links snippet to the related concept
  conceptName: string; // Friendly display name
  content: string; // Code content
  createdAt: Date;
  lastModifiedAt: Date;
}

// Combined Interface for Account Information Display
export interface UserAccount {
  userProfile: UserProfile;
  learningOverview: LearningOverview;
  codeRepository: CodeRepository[];
}
```

### User Account Page Components:
# UI Components and Display Areas

## 1. User Profile Section

Displays user details with an optional profile picture.

### Fields
- Name
- Email
- Member since (formatted createdAt date) 
- Profile picture (optional)

### Component
```typescript
const UserProfile: React.FC<UserProfile> = ({ name, email, profilePictureUrl, createdAt }) => (
  <div className="user-profile">
    <img src={profilePictureUrl || "/default-avatar.png"} alt="Profile" className="profile-picture" />
    <h2>{name}</h2>
    <p>Email: {email}</p>
    <p>Member since: {new Date(createdAt).toLocaleDateString()}</p>
  </div>
);
```
## 2. Learning Overview Section

### Fields:
- Total concepts learned
- Active learning pathway
- Proficiency level
- Last active date

### Component:
```typescript
const LearningOverview: React.FC<LearningOverview> = ({ 
  totalConceptsLearned, 
  activeLearningPathway, 
  proficiencyLevel, 
  lastActiveDate 
}) => (
  <div className="learning-overview">
    <h3>Learning Summary</h3>
    <p>Total Concepts Learned: {totalConceptsLearned}</p>
    <p>Active Pathway: {activeLearningPathway}</p>
    <p>Proficiency Level: {proficiencyLevel}</p>
    <p>Last Active: {new Date(lastActiveDate).toLocaleDateString()}</p>
  </div>
);
```

## 3. Code Repository Section

Displays stored code snippets, categorized by the related concept.

### Fields
- Concept name
- Snippet content 
- Created date
- Last modified date

### Component
```typescript
const CodeSnippet: React.FC<CodeRepository> = ({ 
  conceptName, 
  content, 
  createdAt, 
  lastModifiedAt 
}) => (
  <div className="code-snippet">
    <h4>{conceptName}</h4>
    <pre>{content}</pre>
    <p>Created: {new Date(createdAt).toLocaleDateString()}</p>
    <p>Last Modified: {new Date(lastModifiedAt).toLocaleDateString()}</p>
  </div>
);

const CodeRepositoryList: React.FC<{ snippets: CodeRepository[] }> = ({ snippets }) => (
  <div className="code-repository">
    <h3>My Code Snippets</h3>
    {snippets.map(snippet => (
      <CodeSnippet key={snippet.snippetId} {...snippet} />
    ))}
  </div>
);
```
### Layout of User Account Page
#### Combined Page Component
```typescript
import React from "react";

interface UserAccountProps {
  userAccount: UserAccount;
}

const UserAccountPage: React.FC<UserAccountProps> = ({ userAccount }) => {
  const { userProfile, learningOverview, codeRepository } = userAccount;

  return (
    <div className="user-account-page">
      <section className="user-profile-section">
        <UserProfile {...userProfile} />
      </section>
      <section className="learning-overview-section">
        <LearningOverview {...learningOverview} />
      </section>
      <section className="code-repository-section">
        <CodeRepositoryList snippets={codeRepository} />
      </section>
    </div>
  );
};

export default UserAccountPage;
```

---
### EXAMPLE MOCK DATA
```typescript
const mockUserAccount: UserAccount = {
  userProfile: {
    id: "123",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    profilePictureUrl: "/profile-picture.jpg",
    createdAt: new Date("2023-01-01"),
  },
  learningOverview: {
    totalConceptsLearned: 25,
    activeLearningPathway: "Euclidean Geometry",
    proficiencyLevel: "intermediate",
    lastActiveDate: new Date(),
  },
  codeRepository: [
    {
      snippetId: "snippet-1",
      conceptId: "concept-1",
      conceptName: "Pythagorean Theorem",
      content: "export const calculateHypotenuse = (a: number, b: number): number => Math.sqrt(a ** 2 + b ** 2);",
      createdAt: new Date("2024-01-15"),
      lastModifiedAt: new Date("2024-01-20"),
    },
    {
      snippetId: "snippet-2",
      conceptId: "concept-2",
      conceptName: "Circle Area",
      content: "export const calculateCircleArea = (radius: number): number => Math.PI * radius ** 2;",
      createdAt: new Date("2024-02-10"),
      lastModifiedAt: new Date("2024-02-12"),
    },
  ],
};
```


