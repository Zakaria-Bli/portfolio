# Zak's Portfolio

## About This Project

Hi, I'm Zak. Welcome to my portfolio repository.

This repository is more than just a showcase of my past work; it is a demonstration of **how I work**. I built this application to reflect my approach to modern web development: prioritizing scalability, maintainability, and a top-tier developer experience.

Here, you won't just find code—you'll find a structured, thoughtful architecture designed to handle complexity without becoming a tangled mess. I believe that how you build is just as important as what you build.

## My Development Philosophy

When building applications, I adhere to a few core principles:

- **Feature-Sliced**: I organize code by business domain (features) rather than technical layers. This ensures that the codebase remains navigable and scalable as it grows.
- **Boundaries**: I use tools like `eslint-plugin-boundaries` to enforce architectural layers physically. This prevents "spaghetti code" and ensures that features remain decoupled and testable.
- **Type Safety**: TypeScript is non-negotiable. I rely on strict typing to catch errors early and provide self-documenting code.
- **Modern Standards**: I stay up-to-date with the ecosystem (Next.js 16, React 19, Tailwind v4) to leverage the best tools for performance and user experience.
- **Automated Quality**: Linting, formatting, and testing should be automated. If a rule is important, it should be in the config, not just in a document.

## Tech Stack

I chose this specific stack to demonstrate a production-ready environment:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) - For its robust server-side capabilities and routing.
- **Library**: [React 19](https://react.dev/) - Utilizing Server Components and Actions for efficient data handling.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - For strict type safety.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - For rapid, maintainable styling.
- **Architecture Enforcement**: [ESLint](https://eslint.org/) + `eslint-plugin-boundaries`.
- **Package Manager**: [pnpm](https://pnpm.io/) - For speed and efficiency.

## Architecture & Workflow

This project adopts a **Feature-Sliced** inspired architecture. I organize code by "what it does" (features) rather than "what it is" (components, hooks).

### Folder Structure

The `src` directory is the heart of the application:

```
src/
├── app/          # Next.js App Router (Entry points, Layouts, Pages)
├── features/     # Feature-based modules (Domain logic, specific components)
│   ├── auth/
│   ├── blog/
│   └── projects/
└── shared/       # Shared utilities, hooks, and generic UI components
    ├── components/
    ├── lib/
    └── utils/
```

### Architectural Boundaries

To maintain a clean dependency graph, we enforce the following rules:

1.  **App Layer (`src/app`)**: Can import from `features` and `shared`. This layer orchestrates the application but contains minimal business logic.
2.  **Feature Layer (`src/features`)**:
    - Can import from `shared`.
    - **Cannot** import from `app`.
    - **Cannot** import from other `features` directly (unless via a public API or shared interface, though strict isolation is preferred).
3.  **Shared Layer (`src/shared`)**:
    - Can only import from other `shared` modules.
    - **Cannot** import from `app` or `features`.

These rules are automated using `eslint-plugin-boundaries`, ensuring that architectural violations are caught at development time.

## Docker Support

This project includes a fully configured Docker setup for both development and production environments, utilizing multi-stage builds for optimization.

### Development

To run the application in a containerized development environment:

1.  Ensure Docker and Docker Compose are installed.
2.  Modify `docker-compose.yml` to target the `dev` stage and uncomment volume mounts for hot reloading.
3.  Run:
    ```bash
    docker compose up --build
    ```

### Production

The default `docker-compose.yml` configuration is optimized for production:

- **Multi-stage Build**: Uses `base`, `deps`, `builder`, and `runner` stages to minimize image size.
- **Standalone Output**: Leverages Next.js standalone mode.
- **Security**: Runs as a non-root user (`nextjs`).

To start the production server:

```bash
docker compose up --build
```

## Branching & Commit Guidelines

I follow [Conventional Commits](https://www.conventionalcommits.org) and use a simple branching strategy to keep work isolated and reviewable.

### Commit Message Template

Use the Conventional Commits format. Include an optional body and footer(s) when needed (for breaking changes, references, or metadata):

```text
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Common types:

- `feat`: New feature or module
- `fix`: Bug fix
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test-related changes
- `docs`: Documentation changes
- `style`: Code style changes
- `chore`: Build process or auxiliary tools

### Examples:

- `feat(store): add product listing page`
- `fix(auth): resolve login redirect issue`
- `docs(readme): update contributing guidelines`
- `chore(docs): setup documentation structure and add getting-started guide`

> Tip: add an optional footer for referencing issues or noting breaking changes, e.g. `BREAKING CHANGE: ...` or `Closes #123`.

### 🔀 Branching Strategy

- Base branches:
  - `main` → stable, production-ready
  - `staging` → integration/testing branch
- Create feature branches from `staging`:

  ```bash
  git checkout staging
  git pull
  git checkout -b feat/your-feature-name
  ```

  After finishing work on the feature branch, push and open a pull request into `staging` for integration testing. Once validated, merge `staging` into `main` to create a fully production-ready release; merges to `main` represent release points, not individual feature deployments.

## Connect

I'm always open to discussing code, architecture, or potential collaborations.

- **GitHub**: [Zakaria-Bli](https://github.com/Zakaria-Bli)
- **LinkedIn**: [Zakaria Bli](https://www.linkedin.com/in/zakaria-bli)

## Getting Help

- **Architecture Decisions**: See `eslint.config.mjs` for the codified architectural rules.
- **Next.js Docs**: [Next.js Documentation](https://nextjs.org/docs)
- **Tailwind CSS**: [Tailwind CSS Documentation](https://tailwindcss.com/docs)
