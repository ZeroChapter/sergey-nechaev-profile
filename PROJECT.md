# Developer Profile — Project Context

## 1. Project Overview

This project is a technical assignment for a TypeScript backend developer position.

The goal is to build a small production-like digital business card / developer profile application that demonstrates practical knowledge of:

- TypeScript
- Node.js
- NestJS
- Prisma
- GraphQL
- CockroachDB
- Docker
- Git
- AI-assisted development using Cursor

The project must demonstrate engineering ability, code quality, architectural thinking, and the ability to work with an AI coding agent without relying on blind code generation.

The application should be intentionally small in scope, but implemented with production-quality engineering practices.

---

## 2. Primary Goal

Build a digital developer profile that presents the developer as a software engineer.

The application should provide structured information about:

- developer profile;
- professional experience;
- technical skills;
- projects;
- relevant external links and contact information.

The backend is the primary focus of the assignment.

The frontend should remain intentionally simple and exist primarily to demonstrate that the GraphQL API can be consumed by a real client.

---

## 3. Assignment Requirements

The original assignment requires the project to use:

- Git
- TypeScript
- Node.js
- NestJS
- Prisma
- GraphQL
- Docker
- AI-assisted development

The project must be available through:

1. a publicly accessible project/demo link;
2. a Git repository containing the source code.

The solution may be demonstrated during an interview by modifying the project live while sharing the screen.

Therefore the codebase must remain understandable and maintainable by a developer who did not write every line manually.

---

## 4. Engineering Principles

The project should follow these principles:

### 4.1 Simplicity over overengineering

Use the simplest architecture that satisfies the requirements.

Do not introduce abstractions, patterns, libraries, infrastructure, or services unless there is a concrete reason for them.

Do not build microservices for this project.

Do not introduce event-driven architecture unless a real requirement appears.

Do not create repositories, factories, interfaces, or other abstractions purely for architectural appearance.

### 4.2 Explicit over implicit

Prefer code whose behavior is easy to understand.

Avoid unnecessary magic.

Prefer explicit types and clear data flow.

### 4.3 Separation of responsibilities

Transport, business logic, persistence, and infrastructure concerns should have clear boundaries.

GraphQL resolvers should remain thin.

Business logic belongs in application/domain services.

Database access should use the established Prisma/database layer.

### 4.4 Maintainability

Code should be easy to:

- read;
- test;
- modify;
- debug;
- explain during a technical interview.

### 4.5 AI-assisted development without blind generation

Cursor may be used extensively during development.

AI-generated code must always be reviewed by the developer.

The developer is responsible for:

- architectural decisions;
- correctness;
- security;
- performance;
- database design;
- API design;
- final implementation.

Never accept generated code solely because it compiles.

---

## 5. Architecture

The application will use a **Modular Monolith** architecture.

The backend will be implemented as a single NestJS application composed of business-oriented modules.

The initial conceptual structure is:

```text
NestJS Application
│
├── Profile Module
├── Experience Module
├── Project Module
├── Skill Module
└── Prisma / Database Module
```

Modules should have clear responsibilities.

The application should not be split into microservices.

Detailed architectural rules will be documented in:

```text
docs/ARCHITECTURE.md
```

---

## 6. Technology Stack

### Backend

- TypeScript
- Node.js
- NestJS
- GraphQL
- Prisma

### Database

- CockroachDB

### Infrastructure

- Docker
- Docker Compose for local development

### Development

- Git
- ESLint
- Prettier
- Cursor

### Frontend

A minimal web client may be implemented to consume the GraphQL API and present the developer profile.

The frontend is not the primary focus of the assignment.

---

## 7. Backend Responsibilities

The backend should:

- expose a GraphQL API;
- retrieve developer profile information;
- retrieve professional experience;
- retrieve technical skills;
- retrieve projects;
- retrieve external/contact links where appropriate;
- persist data using Prisma;
- use CockroachDB as the relational database;
- validate input where input is accepted;
- return predictable GraphQL responses;
- handle errors appropriately.

The backend should not contain presentation-specific UI logic.

---

## 8. Domain Scope

The initial domain consists of the following conceptual entities:

```text
Profile
Experience
Project
Skill
```

These entities represent the developer's public professional profile.

The exact fields, relationships, constraints, and Prisma schema will be defined separately in:

```text
docs/DOMAIN.md
```

Do not invent additional domain entities unless a real requirement justifies them.

---

## 9. GraphQL

GraphQL is the primary API interface.

The API should expose only the data required by the application.

Resolvers should be thin and should delegate application logic to services.

Conceptually:

```text
GraphQL Request
      │
      ▼
   Resolver
      │
      ▼
   Service
      │
      ▼
 Prisma / Database
      │
      ▼
 CockroachDB
```

The exact GraphQL schema and API conventions will be documented in:

```text
docs/API.md
```

---

## 10. Database

CockroachDB is the project's relational database.

Prisma is the ORM/data access technology.

Database changes must be represented through Prisma migrations.

The project should provide a reproducible local database setup.

A new developer should be able to:

1. start the required infrastructure;
2. apply migrations;
3. seed development data if required;
4. start the application;
5. use the GraphQL API.

Database credentials and secrets must never be committed to Git.

---

## 11. Configuration

Configuration must be provided through environment variables.

A safe example configuration must be committed:

```text
.env.example
```

Actual secrets must remain outside the repository.

The application should fail clearly when required configuration is missing or invalid.

---

## 12. Code Quality

The project must use:

- ESLint for static analysis and code-quality rules;
- Prettier for formatting;
- TypeScript strictness where practical;
- automated tests for important application behavior.

Formatting and linting must be reproducible locally and in CI if CI is introduced.

The project should avoid:

```text
any
unused code
dead code
duplicated business logic
unnecessary abstractions
unjustified dependencies
```

Exact coding conventions will be documented separately.

---

## 13. Testing

Tests are part of the implementation, not an optional final step.

At minimum, important business/application logic should have automated tests.

Testing should cover meaningful behavior rather than artificially maximizing code coverage.

Tests should be easy to run with a single project command.

The exact testing strategy will be documented in the development/testing rules.

---

## 14. Docker

The project must be runnable in a reproducible environment.

Docker should be used to simplify local development and deployment.

The project should distinguish between:

- local development configuration;
- production configuration.

Do not put secrets into Dockerfiles or committed Docker Compose files.

---

## 15. Git

Git is a required part of the project.

The Git history should represent logical development steps.

Commits should:

- have meaningful messages;
- contain logically related changes;
- avoid unrelated modifications;
- avoid committing generated files that should not be versioned;
- avoid secrets.

The final repository should demonstrate a clean development history rather than a single large "finish project" commit.

---

## 16. AI Development Rules

Cursor is the primary AI-assisted development tool.

AI should be treated as a development assistant, not as the owner of the project.

Before making a significant change, the agent should:

1. inspect the existing implementation;
2. identify the affected module/files;
3. understand existing architectural decisions;
4. propose or internally determine the smallest appropriate change;
5. implement the change;
6. run relevant tests;
7. run lint/type checks where applicable;
8. review the resulting diff.

The agent must not:

- rewrite unrelated files;
- introduce dependencies without justification;
- change architecture without an explicit reason;
- duplicate existing functionality;
- bypass existing abstractions;
- remove tests merely to make them pass;
- weaken type safety to silence errors;
- introduce `any` as a shortcut;
- silently change API contracts.

When an existing architectural decision conflicts with a proposed implementation, preserve the existing decision unless the task explicitly requires changing it.

---

## 17. Source of Truth

The project documentation will be split by responsibility.

```text
PROJECT.md
    ↓
General project context

docs/ARCHITECTURE.md
    ↓
Architectural rules and module boundaries

docs/DOMAIN.md
    ↓
Domain model and business concepts

docs/API.md
    ↓
GraphQL API contract

docs/DECISIONS.md
    ↓
Important architectural/technical decisions

docs/STATUS.md
    ↓
Current implementation state

.cursor/rules/
    ↓
Operational rules for Cursor agents
```

If information conflicts between documents, the more specific document takes precedence for its area of responsibility.

Architectural decisions should not be silently changed by an AI agent.

---

## 18. Non-Goals

The following are explicitly outside the initial scope unless a later requirement justifies them:

- microservices;
- Kubernetes;
- complex authentication;
- authorization systems;
- admin panel;
- payments;
- notifications;
- real-time subscriptions;
- complex file management;
- unnecessary cloud infrastructure;
- elaborate frontend animations;
- unnecessary design-system infrastructure;
- premature performance optimization.

The goal is to demonstrate engineering quality, not infrastructure complexity.

---

## 19. Definition of Done

A feature is considered complete when:

- the implementation satisfies the requirement;
- the implementation follows the project architecture;
- relevant types are correct;
- relevant tests exist;
- tests pass;
- ESLint passes;
- formatting is correct;
- the application builds successfully;
- no secrets are committed;
- documentation is updated when the change affects documented behavior;
- the final Git diff contains only relevant changes.

---

## 20. Agent Behavior

Cursor agents must treat this file as the high-level project context.

Before implementing a non-trivial task, the agent should read the relevant project documentation and existing code.

The agent should prefer modifying existing code over creating duplicate implementations.

The agent should ask for clarification when a requirement is genuinely ambiguous and the choice could materially affect architecture, API, database schema, or project scope.

The agent should not make large architectural decisions silently.

When a task is small and unambiguous, the agent should implement it directly rather than over-discussing it.

---

## 21. Current Project State

The project is currently in the planning stage.

No production implementation should be assumed to exist yet.

The next step is to define the detailed architecture and domain model before implementing the application.

Current state:

```text
Phase: Planning

Completed:
- Project requirements identified
- Core technology stack identified
- Modular Monolith selected as architectural style
- Cursor selected as AI-assisted development environment

Next:
- Define detailed architecture
- Define domain model
- Define GraphQL API
- Define coding standards
- Define project structure
- Create implementation plan
```

---

## 22. Important Rule for Future Agents

Do not start implementing the entire project simply because this document exists.

The project will be implemented incrementally according to the dedicated implementation plan.

Each task should be small enough to:

- understand;
- implement;
- test;
- review;
- commit independently.

The implementation plan is the source of truth for project progress.

When the implementation plan is introduced, agents should update `docs/STATUS.md` after completing meaningful milestones.
