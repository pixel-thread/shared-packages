# Contributing Guide — Adding a Registry Item

## Project structure

```
shared-packages/
├── registry.json         # Item catalog (add items here)
├── src/
│   ├── cli.ts            # CLI entry point
│   ├── commands/         # Command implementations
│   │   ├── index.ts
│   │   ├── add.ts
│   │   └── list.ts
│   ├── items/            # Distributable source files (categorised)
│   │   ├── errors/       # Error classes and utilities
│   │   ├── schemas/      # Zod schemas and validations
│   │   ├── lib/          # Infrastructure wrappers (Prisma, etc.)
│   │   └── utils/        # General-purpose utilities and clients
│   ├── registry/         # Registry loading & path resolution
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Internal CLI utility helpers
│   └── shared/           # Stubs for alias resolution
├── .husky/
│   ├── pre-commit        # lint-staged (eslint + prettier)
│   └── pre-push          # pnpm build
├── commitlint.config.js  # Conventional commit enforcement
├── package.json
└── tsconfig.json
```

## How to add a new item

### 1. Pick the right category

| Directory | Contents |
|-----------|----------|
| `src/items/errors/` | Error classes and error utilities |
| `src/items/schemas/` | Zod schemas and validation patterns |
| `src/items/lib/` | Infrastructure wrappers (Prisma, etc.) |
| `src/items/utils/` | General-purpose utilities and clients |

### 2. Create source files

```bash
mkdir -p src/items/utils/my-utility
```

Create the main source file and a barrel `index.ts`:

```ts
// src/items/utils/my-utility/my-utility.ts
/** @file Description of what this utility does. */

/**
 * Brief description of the exported function.
 *
 * @param input - What to pass in.
 * @returns What you get back.
 */
export function myUtility(input: string): string {
  return input.toUpperCase();
}
```

```ts
// src/items/utils/my-utility/index.ts
export { myUtility } from './my-utility';
```

**Rules:**
- File and folder names use **kebab-case** (strict — no exceptions)
- Every exported function **must** include JSDoc (`@param`, `@returns`)
- Add a barrel `index.ts` that re-exports the public API
- Import other items via `@items/<category>/<item-name>/<file>`

### 3. Register the item in `registry.json`

Add an entry:

```json
{
  "name": "my-utility",
  "description": "What the item provides.",
  "files": [
    {
      "source": "src/items/utils/my-utility/my-utility.ts",
      "target": "src/shared/utils/my-utility.ts"
    }
  ],
  "dependencies": []
}
```

Fields:
- `name` — CLI name used in `shared-packages add <name>` (kebab-case)
- `description` — shown in `shared-packages list`
- `files[].source` — path relative to the package root
- `files[].target` — destination relative to the consumer project root
- `dependencies` — npm packages the consumer must install (optional)

### 4. Add multiple files per item

```json
{
  "name": "my-utility",
  "files": [
    {
      "source": "src/items/utils/my-utility/my-utility.ts",
      "target": "src/shared/utils/my-utility.ts"
    },
    {
      "source": "src/items/utils/my-utility/helper.ts",
      "target": "src/shared/utils/my-utility-helper.ts"
    }
  ]
}
```

### 5. Add devDependencies if needed

If the item imports packages not already in `devDependencies`, install them:

```bash
pnpm add -D <package-name>
```

### 6. Verify

```bash
pnpm build
pnpm lint
pnpm format:check
```

### 7. Test locally before publishing

```bash
mkdir -p /tmp/test-app && cd /tmp/test-app
node /path/to/shared-packages/dist/cli.js add my-utility
```

## Commit convention

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via commitlint:

```
feat: add user-schema item
fix: resolve path traversal in add command
chore: update dependencies
docs: add contributing guide
```

Pre-commit runs `lint-staged` (eslint + prettier on staged `.ts` files).
Pre-push runs `pnpm build`.

## Guidelines

- Keep items focused and small
- Use kebab-case for all file and folder names
- Add JSDoc to every exported function
- Include a barrel `index.ts` for every item
- Avoid placing secrets in registry files
- Pin or review third-party dependencies listed in `dependencies`
- Update the version in `package.json` when adding new items
