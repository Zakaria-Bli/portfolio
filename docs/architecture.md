# Architecture

This document provides a comprehensive overview of the project's architecture, including folder structure, design patterns, architectural layers, and conventions.

---

## 1. Project Structure

```
portfolio-next/
├── docs/                    # Documentation files
│   └── README.md            # Documentation index
│
├── public/                  # Static assets
│
├── app/                     # Next.js App Router (UI layer)
├── components/              # Shared React components
├── features/                # Feature-based modules
├── lib/                     # Library configurations
└── shared/                  # Shared utilities and types
    ├── constants/           # Application constants
    ├── types/               # Shared TypeScript types
    └── utils/               # Utility functions
├── .env.example             # Environment variables template
├── Dockerfile               # Multi-stage Docker configuration
├── docker-compose.yml       # Docker Compose setup
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project overview
```

---

## 2. Architectural Layers

The project follows a **Feature-Sliced Design** approach with strict architectural boundaries enforced by ESLint.

### Layer Hierarchy

```
┌─────────────────────────────────────┐
│           App Layer                 │  ← Routes, Pages, Layouts
│            (app/)                   │
├─────────────────────────────────────┤
│         Feature Layer               │  ← Business logic modules
│          (features/)                │
├─────────────────────────────────────┤
│         Shared Layer                │  ← Common utilities, types
│  (components/, shared/, lib/)       │
└─────────────────────────────────────┘
```

### 2.1 App Layer (`app/`)

The **App Layer** contains Next.js App Router pages, layouts, and route groups.

**Structure:**

```
app/
├── (auth)/              # Auth route group (signin, signup)
│   ├── layout.tsx       # Auth-specific layout
│   ├── signin/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
│
├── (root)/              # Public route group (home, etc.)
│   ├── layout.tsx       # Public layout
│   └── (home)/
│       └── page.tsx
│
├── dashboard/           # Dashboard route group
│   ├── layout.tsx       # Dashboard layout
│   └── (home)/
│       └── page.tsx
│
├── layout.tsx           # Root layout (fonts, metadata)
├── globals.css          # Global styles
└── favicon.ico          # Favicon
```

**Responsibilities:**

- Define routes and navigation structure
- Implement page-level components
- Configure layouts for different sections
- Handle route-specific logic
- Manage metadata and SEO

**Import Rules:**

- ✅ Can import from `shared` layer
- ✅ Can import from `features` layer
- ✅ Can import CSS files
- ❌ Cannot import from other `app` modules (except CSS)

**Route Groups:**

- `(auth)` - Authentication pages with minimal layout
- `(root)` - Public-facing pages with main layout
- `dashboard` - Protected dashboard pages with dashboard layout

### 2.2 Feature Layer (`features/`)

The **Feature Layer** contains business logic organized by feature/domain.

**Structure:**

```
features/
├── [feature-name]/
│   ├── components/      # Feature-specific components
│   ├── hooks/           # Feature-specific hooks
│   ├── utils/           # Feature-specific utilities
│   ├── types/           # Feature-specific types
│   ├── api/             # Feature-specific API calls
│   └── index.ts         # Public API exports
```

**Responsibilities:**

- Encapsulate feature-specific business logic
- Provide reusable feature components
- Manage feature-specific state
- Handle feature-specific API interactions

**Import Rules:**

- ✅ Can import from `shared` layer
- ✅ Can import from the **same** feature
- ❌ Cannot import from other features
- ❌ Cannot import from `app` layer

**Example Feature Structure:**

```
features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── index.ts
│
└── products/
    ├── components/
    │   ├── ProductCard.tsx
    │   └── ProductList.tsx
    ├── actions/
    │   └── products.actions.ts
    └── index.ts
```

### 2.3 Shared Layer

The **Shared Layer** contains common utilities, types, and components used across the application.

**Structure:**

```
/
├── components/          # Shared UI components
│   └── ui/
│       └── button.tsx
│
├── shared/              # Shared utilities and types
│   ├── constants/       # Application constants
│   ├── types/           # Shared TypeScript types
│   └── utils/           # Utility functions
│
└── lib/                 # Library configurations
    └── utils.ts         # Common utility functions
```

**Responsibilities:**

- Provide reusable UI components
- Define shared types and interfaces
- Implement common utility functions
- Store application-wide constants
- Configure third-party libraries

**Import Rules:**

- ✅ Can import from other `shared` modules
- ❌ Cannot import from `features` layer
- ❌ Cannot import from `app` layer

**Examples:**

- `components/` - Button, Input, Card, Modal, etc.
- `shared/types/` - User, Product, Order types
- `shared/utils/` - formatDate, formatCurrency, etc.
- `shared/constants/` - API endpoints, config values
- `lib/utils.ts` - Class name utilities (e.g., `cn()`)

---

## 3. Design Patterns & Conventions

### 3.1 Naming Conventions

**Files & Folders:**

- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.types.ts` (e.g., `user.types.ts`)
- Hooks: `use*.ts` (e.g., `useAuth.ts`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

**Code:**

- Variables: `camelCase` or `PascalCase`
- Functions: `camelCase` or `PascalCase`
- Types/Interfaces: `PascalCase`
- Components: `PascalCase`

### 3.2 Import Organization

Imports are automatically organized by ESLint with the following groups:

1. **Built-in modules** (Node.js core)
2. **External packages** (npm packages)
3. **Internal modules** (project code)
4. **Parent imports** (`../`)
5. **Sibling imports** (`./`)
6. **Index imports** (`./index`)
7. **Object imports**
8. **Type imports**

**Example:**

```typescript
import { useState } from "react"

import { Button } from "@/components/Button"
import { useAuth } from "@/features/auth"
import { formatDate } from "@/shared/utils/formatDate"

import type { User } from "@/shared/types/user.types"
```

### 3.3 Path Aliases

The project uses the `@` alias for absolute imports:

```typescript
// ❌ Relative imports (not allowed)
import { Button } from "../../components/Button"

// ✅ Absolute imports with @ alias
import { Button } from "@/components/Button"
```

**Configuration:**

- Defined in `tsconfig.json`: `"@/*": ["./*"]`
- Enforced by ESLint rule: `no-restricted-imports`

### 3.4 Component Patterns

**Server Components (Default):**

```typescript
// app/(root)/(home)/page.tsx
export default function HomePage() {
  return <div>Home Page</div>
}
```

**Client Components:**

```typescript
// components/Counter.tsx
"use client"

import { useState } from "react"

const Counter = () => {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

export default Counter
```

**Layout Pattern:**

```typescript
// app/dashboard/layout.tsx
import React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Dashboard navigation, sidebar, etc. */}
      {children}
    </div>
  )
}
```

---

## 4. Architectural Boundaries

The project enforces architectural boundaries using `eslint-plugin-boundaries`.

### Boundary Rules

```
┌─────────────────────────────────────┐
│  App Layer                          │
│  ✅ Import: shared, features        │
│  ❌ Import: other app modules       │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Feature Layer                      │
│  ✅ Import: shared, same feature    │
│  ❌ Import: other features, app     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Shared Layer                       │
│  ✅ Import: other shared modules    │
│  ❌ Import: features, app           │
└─────────────────────────────────────┘
```

### Benefits

- **Maintainability:** Clear separation of concerns
- **Scalability:** Easy to add new features
- **Testability:** Isolated modules are easier to test
- **Reusability:** Shared code is centralized
- **Predictability:** Consistent import patterns
