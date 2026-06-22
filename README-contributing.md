# Contributing Guide — Adding a Registry Item

## Project structure

```
shared-packages/
├── registry.json         # Item catalog (add items here)
├── items/                # Source files to distribute
│   └── <item-name>/      # One directory per item
├── src/cli.ts            # CLI implementation
├── package.json
└── tsconfig.json
```

## How to add a new item

### 1. Create source files

```bash
mkdir -p items/auth-middleware
```

Create `items/auth-middleware/auth.middleware.ts` with your code:

```ts
// Example: items/auth-middleware/auth.middleware.ts
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // ...
}
```

### 2. Register the item in `registry.json`

Add an entry:

```json
{
  "name": "auth-middleware",
  "description": "JWT authentication middleware.",
  "files": [
    {
      "source": "items/auth-middleware/auth.middleware.ts",
      "target": "src/middlewares/auth.middleware.ts"
    }
  ],
  "dependencies": ["jsonwebtoken"]
}
```

Fields:
- `name` — CLI name used in `shared-packages add <name>`
- `description` — shown in `shared-packages list`
- `files[].source` — path relative to the package root
- `files[].target` — destination relative to the consumer project root
- `dependencies` — npm packages the consumer must install (optional)

### 3. Add multiple files per item

```json
{
  "name": "auth-middleware",
  "files": [
    {
      "source": "items/auth-middleware/auth.middleware.ts",
      "target": "src/middlewares/auth.middleware.ts"
    },
    {
      "source": "items/auth-middleware/express.d.ts",
      "target": "src/types/express.d.ts"
    }
  ],
  "dependencies": ["jsonwebtoken"]
}
```

### 4. Rebuild

```bash
pnpm build
```

### 5. Test locally before publishing

```bash
mkdir -p /tmp/test-app && cd /tmp/test-app
node /path/to/shared-packages/dist/cli.js add auth-middleware
```

## Guidelines

- Keep items focused and small
- Avoid placing secrets in registry files
- Pin or review third-party dependencies listed in `dependencies`
- Update the version in `package.json` when adding new items
