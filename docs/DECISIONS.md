# Architecture and Technical Decisions

This document records decisions that are accepted for the developer profile project.

These decisions are binding for implementation unless a later entry in this file explicitly supersedes them.

Source of high-level context: `PROJECT.md`.

If this file conflicts with `PROJECT.md`, this file takes precedence for the decisions it records.

---

## 1. Modular Monolith

### Decision

The application is a Modular Monolith: one deployable NestJS application composed of business-oriented modules.

### Context

The assignment requires a small production-like backend that demonstrates architecture, not infrastructure complexity. Microservices, event-driven design, and extra deployable units are outside the intended scope.

### Rationale

A modular monolith keeps module boundaries visible (Profile, Experience, Project, Skill, Prisma) while remaining simple to run, test, explain in an interview, and change incrementally with Cursor.

### Consequences

- All backend capabilities live in a single NestJS process.
- Modules must have clear responsibilities; they must not be split into separate services.
- Shared infrastructure such as Prisma belongs in a dedicated database module, not copied into every business module.

---

## 2. Single NestJS Backend, Frontend Later

### Decision

The repository implements one NestJS backend. The frontend is not part of the first implementation phase.

Implementation order is:

1. backend;
2. database;
3. GraphQL API;
4. tests;
5. frontend, after the backend GraphQL API is stable.

### Context

`PROJECT.md` makes the backend the primary assignment focus. A client should exist eventually to prove that the API can be consumed, but the GraphQL contract must be stable first. A monorepo or parallel UI work would add structure before the API exists.

### Rationale

Stabilizing the API before the UI avoids duplicate contract changes and keeps Git history aligned with the assignment: backend engineering first, a thin client later.

### Consequences

- Do not scaffold a frontend, design system, or extra app package until the GraphQL API is accepted as stable.
- GraphQL Playground / Apollo Sandbox is an acceptable temporary way to exercise the API.
- Frontend stack decisions are deferred.

---

## 3. Singleton Profile

### Decision

The system stores exactly one developer Profile. The product is a personal digital business card, not a directory of developers.

### Context

The assignment presents one engineer. Multi-profile or multi-tenant models would require identity, ownership, and listing APIs that the project explicitly does not need.

### Rationale

A singleton Profile matches the product, simplifies the GraphQL surface to a single `profile` query, and removes the need for profile identifiers in the public API.

### Consequences

- Seed data must upsert or replace the single Profile rather than insert competing records.
- Public API does not list or select among profiles.
- Multi-tenancy is out of scope.

---

## 4. Query-Only GraphQL API and Prisma Seed

### Decision

The GraphQL API is query-only. There are no mutations.

Persistent data is created and updated through Prisma seed, not through the API.

### Context

Backend requirements emphasize retrieving profile, experience, skills, projects, and contact information. Authentication, authorization, and an admin panel are non-goals. Input validation is still required where input exists (configuration, seed, internal code), but the public API does not accept writes.

### Rationale

Mutations without auth would make the public profile writable by anyone. Adding auth or an admin UI expands scope past the assignment. Seeded data is reproducible, reviewable in Git, and enough for a demo and interview.

### Consequences

- `docs/API.md` (when written) must not define mutation fields.
- Resolvers implement queries only.
- Changing public content means changing seed data and re-running seed, not calling GraphQL.
- Tests should cover read behavior and seed-backed fixtures, not write APIs.

---

## 5. GraphQL Code First with Apollo

### Decision

GraphQL is implemented with NestJS code-first approach and Apollo.

### Context

The stack requires NestJS and GraphQL. Schema-first and code-first are both viable. The codebase should stay easy to change live during an interview and easy for an AI agent to extend without drifting from a separate `.graphql` file.

### Rationale

Code-first keeps types, decorators, and schema in TypeScript, which matches the rest of the NestJS application and reduces duplication between schema and resolver classes. Apollo is the default, well-documented NestJS GraphQL driver.

### Consequences

- Schema is generated from TypeScript object types and resolvers.
- Do not introduce a parallel hand-written schema as the source of truth.
- Apollo Server / `@nestjs/apollo` is the accepted GraphQL integration.

---

## 6. Public Query Shape

### Decision

The primary public GraphQL query is `profile`.

It returns the singleton Profile with nested `experiences`, `projects`, and `skills`.

The API does not expose:

- queries by ID;
- pagination;
- search;
- filtering.

### Context

The client is a digital business card. The dataset is small and owned by one profile. Collection queries, cursors, and resource-by-id lookups would imitate a larger product without serving this one.

### Rationale

One nested `profile` query gives the frontend a single round-trip and a contract that is easy to explain, test, and keep stable.

### Consequences

- Nested relations are resolved as part of `profile`, not as separate public list endpoints.
- GraphQL types should expose the nested collections on Profile.
- Do not add `experience(id)`, `project(id)`, connection types, or filter arguments unless a later decision supersedes this one.

---

## 7. Prisma Without a Repository Layer

### Decision

Database access uses `PrismaService` / Prisma Client directly from application services.

There is no separate repository, unit-of-work, or mapper layer.

### Context

`PROJECT.md` requires a clear Prisma/database boundary and forbids repositories created only for architectural appearance. The domain is small and the persistence model will closely match the GraphQL read model.

### Rationale

Prisma Client already is the data-access API. An extra repository layer would duplicate queries, hide Prisma features, and add files without changing behavior.

### Consequences

- Business/application services may call Prisma Client.
- GraphQL resolvers stay thin and do not contain Prisma queries.
- Do not add generic `IProfileRepository` abstractions unless a concrete problem appears.

---

## 8. CockroachDB and UUID Identifiers

### Decision

CockroachDB is the relational database.

Entity primary keys use UUID.

### Context

The project stack names CockroachDB and Prisma. CockroachDB is PostgreSQL-compatible and works poorly with naive autoincrement assumptions. Prisma migrations must remain reproducible locally via Docker.

### Rationale

CockroachDB is an explicit assignment/stack requirement. UUIDs avoid sequential ID issues in a distributed SQL database and are straightforward to expose as GraphQL `ID` values internally even though the public API does not query by ID.

### Consequences

- Local development must provide CockroachDB through Docker Compose.
- Prisma schema uses UUID primary keys, not autoincrement integers.
- Database credentials stay in environment variables, not in Git.

---

## 9. Domain Entities and Ownership

### Decision

The core domain entities are:

- Profile
- Experience
- Project
- Skill

Ownership:

- Experience belongs to Profile;
- Project belongs to Profile;
- Skill belongs to Profile.

There is no Project–Skill or Experience–Skill association in the initial model.

### Context

`PROJECT.md` limits the initial domain to these four conceptual entities and forbids extra entities without a real requirement. The product is one public professional profile.

### Rationale

Profile as the aggregate root matches the singleton business card and the nested `profile` query. Extra join entities (for example project skills) can be added later if a real UI or API need appears.

### Consequences

- Prisma relations are Profile 1-N Experience, Profile 1-N Project, Profile 1-N Skill.
- Do not introduce User, Tag, Company, or other entities unless a later decision records them.
- Skill names are scoped to the single Profile; uniqueness, if any, is per profile, not global multi-tenant uniqueness.

---

## 10. Contact Information Lives on Profile

### Decision

Links and contact information are fields on Profile.

There is no `Link` entity and no Link module.

### Context

The assignment requires external links and contact information, but the approved domain entity list does not include Link. A separate entity would need ordering, types, and extra GraphQL types without a demonstrated product need.

### Rationale

Fixed fields (for example email, GitHub, LinkedIn, Telegram) are enough for a personal card, keep the schema small, and satisfy the requirement without inventing a fifth entity.

### Consequences

- Profile carries contact/link scalars (exact field list belongs in `docs/DOMAIN.md`).
- Adding a new public channel means adding a Profile field, not inserting rows.
- Do not implement `links { type url label }`.

---

## 11. Explicitly Out of Scope

### Decision

The following are not part of the project unless a later decision explicitly adds them:

- authentication;
- authorization;
- admin panel;
- CQRS;
- microservices;
- queues;
- cache;
- GraphQL subscriptions;
- i18n;
- multi-tenancy.

### Context

`PROJECT.md` already lists several of these as non-goals. The accepted product is a public read-only profile with seeded content.

### Rationale

These capabilities would dominate the codebase and the interview conversation without improving the demonstration of NestJS, Prisma, GraphQL, and CockroachDB.

### Consequences

- Agents and contributors must not add these as “good practice” extras.
- The public API is reachable without credentials.
- Scaling, localization, and write-side complexity are not design drivers.

---

## 12. No Object Storage in MVP

### Decision

S3 and other object-storage services are not included in the MVP.

If a profile avatar is needed, it is stored as a URL string on Profile, not as an uploaded file.

### Context

File management is a non-goal. The profile may still show an image if a URL is enough. Upload, signed URLs, and buckets would add secrets, Docker/cloud configuration, and failure modes unrelated to the assignment.

### Rationale

A URL field demonstrates that an avatar can be presented without operating a storage service. Object storage can be reconsidered only if a real upload requirement appears.

### Consequences

- Do not add AWS/MinIO SDKs, buckets, or multipart upload endpoints.
- Avatar, if present, is an optional string URL on Profile.
- Hosting of the actual image file is outside the application.
