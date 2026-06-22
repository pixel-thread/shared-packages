# GEMINI.md — Project-Level AI Agent Rules

> **MANDATORY:** Every AI agent working on this codebase must read this file completely before performing any task. These rules are non-negotiable and apply to every file, every route, and every service — without exception.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Security-First Rules](#security-first-rules)
3. [SOLID Architecture Rules](#solid-architecture-rules)
4. [Naming Conventions](#naming-conventions)
5. [Architecture Overview](#architecture-overview)
6. [Item Structure](#item-structure)
7. [Shared Directory Structure](#shared-directory-structure)
8. [CLI Commands](#cli-commands)
9. [Registry Loading](#registry-loading)
10. [Command Rules](#command-rules)
11. [Validation Rules](#validation-rules)
12. [API Rules](#api-rules)
13. [Import Rules](#import-rules)
14. [Documentation & JSDoc Rules](#documentation--jsdoc-rules)
15. [AI Agent Checklist](#ai-agent-checklist)

---

## Core Principles

These three principles override everything else. When in doubt, come back to them.

| #   | Principle                         | What it means in practice                                                                    |
| --- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | **Security First**                | OWASP Top 10 Every feature starts with threat modeling. No exceptions for "internal" routes. |
| 2   | **SOLID / Single Responsibility** | One file does one thing. Period. Split before you ship.                                      |
| 3   | **Kebab-Case Everywhere**         | All file names, folder names, and route segments use `kebab-case`.                           |

---

## Security-First Rules

> AI agents must apply these rules **before writing any code**. Security is not an afterthought.

### General

- Never hardcode secrets, API keys, tokens, or credentials anywhere in source files.
- Never log sensitive data: passwords, tokens, PII, card numbers, session IDs.
- Secrets live in environment variables or a secrets manager — never in source code or agent context.

### Error Handling

- Never expose stack traces or internal error details to the consumer.
- CLI commands must exit with a non-zero code on failure.
- Validate source files exist before copying them.

---

## SOLID Architecture Rules

> **One file. One responsibility. No exceptions.**

These rules apply to every layer: routes, services, handlers, validators.

### S — Single Responsibility

- Each file must have exactly one reason to change.
- A service file should ideally handle one operation (e.g., `create-module.ts`).
- If a file is doing too many distinct things, split it immediately.

### O — Open/Closed

- Shared utilities, wrappers, and middleware must be open for extension via composition, not modification.
- Adding a new route, middleware, or feature must not require modifying existing unrelated files.

### D — Dependency Inversion

- Business logic in services must not directly import framework-specific modules.
- Shared infrastructure (Prisma, Redis, Supabase, Resend) is accessed only through the wrappers in `shared/lib/`.

---

## Naming Conventions

### File and Folder Names — `kebab-case` (STRICT — NO EXCEPTIONS)

Every file and every folder in the project must use `kebab-case`. This applies to all item source files, command files, registry files, and any other file in the project. Files with uppercase letters, underscores, or spaces will be rejected.

```
✅ with-validation.ts
✅ handle-api-errors.ts
✅ format-zod-issues.ts
✅ with-trace-id.ts
✅ http-client/http.ts

❌ withValidation.ts       (camelCase — rejected)
❌ handleApiErrors.ts      (camelCase — rejected)
❌ with_trace_id.ts        (snake_case — rejected)
❌ WithValidation.ts       (PascalCase — rejected)
```

### Exported Functions — `camelCase`

```
File:   src/commands/add.ts
Export: export async function addItem(item, options)
```

### Zod Schemas — `PascalCase`

```
File:   src/items/schemas/user-schema/user.schema.ts
Export: export const CreateUserSchema = z.object({...})
```

### Summary Table

| Item              | Convention             | Example                              |
| ----------------- | ---------------------- | ------------------------------------ |
| Folders           | `kebab-case`           | `src/items/utils/http-client/`       |
| Files             | `kebab-case` (strict)  | `with-validation.ts`                 |
| Exported functions| `camelCase`            | `addItem()`, `handleApiErrors()`     |
| Zod schemas       | `PascalCase`           | `CreateUserSchema`                   |
| Types/interfaces  | `PascalCase`           | `ApiResponse`, `MiddlewareFn`        |
| Constants         | `SCREAMING_SNAKE_CASE` | `PAGE_SIZE`                          |
| Item names        | `kebab-case`           | `user-schema`, `http-errors`         |

---

## Architecture Overview

**Stack:** TypeScript strict · Commander · tsup bundler · fs-extra · @clack/prompts · Zod

```
src/
├── cli.ts        ← CLI entry point (Commander program)
├── commands/     ← Command implementations (list, add)
├── items/        ← Distributable source files (categorised)
│   ├── errors/
│   ├── schemas/
│   ├── lib/
│   ├── services/
│   └── utils/
├── registry/     ← Registry loading & path resolution
├── types/        ← Shared TypeScript types
├── utils/        ← Internal utility helpers
└── shared/       ← Stubs for alias resolution in items
```

### Path Aliases

| Alias           | Resolves to          |
| --------------- | -------------------- |
| `@src/*`        | `./src/*`            |
| `@sharedTypes/*`| `./src/shared/types/*`|
| `@utils/*`      | `./src/utils/*`      |
| `@items/*`      | `./src/items/*`      |

---

## Item Structure

Every distributable item lives in `src/items/<category>/<item-name>/` using `kebab-case`.

```
src/items/<category>/<item-name>/
├── <item-name>.ts   ← Main source file
└── index.ts         ← Barrel re-export
```

### Item Categories

| Directory   | Contents                              |
| ----------- | ------------------------------------- |
| `errors/`   | Error classes and error utilities     |
| `schemas/`  | Zod schemas and validation patterns   |
| `lib/`      | Infrastructure wrappers (Prisma, etc.)|
| `services/` | Service-layer providers (storage, etc.)|
| `utils/`    | General-purpose utilities and clients |

---

## Shared Directory Structure

`src/shared/` contains stub files that exist only for alias resolution so item source files compile in-editor. They are **not** published — actual consumers get the files via `shared-packages add`.

| Subdirectory | Contents                                      |
| ------------ | --------------------------------------------- |
| `constants/` | Shared constants used by items (e.g. `PAGE_SIZE`) |
| `types/`     | Shared type definitions used by items         |

---

## CLI Commands

Commands are registered in `src/cli.ts` via Commander and delegated to `src/commands/`.

```
src/commands/
├── index.ts    ← Barrel re-exporting all command functions
├── list.ts     ← shared-packages list
└── add.ts      ← shared-packages add [item-name]
```

### Add Command

```
shared-packages add <item-name>   — copy a single item
shared-packages add               — interactive toggle via @clack/prompts
```

**Flags:**
- `-o, --overwrite` — replace existing files
- `--skip-install` — skip dependency installation

### Registry Item Format

Every registry item in `registry.json` declares its source files and target paths:

```json
{
  "name": "item-name",
  "description": "What the item provides.",
  "files": [
    { "source": "src/items/utils/foo/foo.ts", "target": "src/shared/foo.ts" }
  ],
  "dependencies": ["zod"]
}
```

---

## Registry Loading

The CLI loads `registry.json` from the package root at startup. It determines the package root via `import.meta.url` — the function lives in `src/registry/index.ts` and resolves one directory level up (since tsup bundles everything into `dist/cli.js`).

---

## Command Rules

- One command file = one CLI command implementation.
- Command functions are async and accept typed options.
- Use `process.cwd()` as the consumer project root — never assume a fixed path.
- Path-traversal prevention: validate every target path stays within the consumer project.
- Check source files exist before copying; throw a descriptive error if missing.

---

## Validation Rules

- Items that export Zod schemas must use `.strict()` to reject unknown fields.
- Consumer-facing validation libraries (e.g., `zod`) go in the item's `dependencies` list in `registry.json`.

---

## API Rules

- Items that target Next.js route handlers (in `src/shared/api/`) must return `NextResponse.json()`.
- Use `NextResponse` from `next/server`, not Express `Response`.

---

## Import Rules

- Items import each other via `@items/<category>/<item-name>/<file>`.
- Items import shared stubs via `@src/shared/...`.
- No `.js` extension in imports (moduleResolution: "bundler").
- Barrel files (`index.ts`) re-export the main module's public API.

---

## Documentation & JSDoc Rules

- Every exported function and service MUST include JSDoc.
- Describe purpose, params, and return values.

---

## AI Agent Checklist

- [ ] No secrets in source files.
- [ ] Every new item has a folder under `src/items/<category>/<name>/`.
- [ ] Every item's main source file has a barrel `index.ts` that re-exports.
- [ ] All registry source paths in `registry.json` point to `src/items/...`.
- [ ] All new files use `kebab-case`.
- [ ] Every exported function includes JSDoc.
- [ ] Item dependencies are declared in `registry.json`, not in `package.json`.
- [ ] Conventional Commits used for all changes.

---
