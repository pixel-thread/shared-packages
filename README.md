# @pixel-thread/shared-packages

A private source-code registry that copies selected source files into your projects — similar to shadcn/ui's `add` workflow.

```bash
pnpm dlx @pixel-thread/shared-packages add user-schema
```

Files become part of your project, editable and customizable.

## Guides

| File | What it covers |
|------|---------------|
| [README-consumer.md](./README-consumer.md) | Using the registry — install items into a project |
| [README-contributing.md](./README-contributing.md) | Adding new items to the registry |
| [README-publishing.md](./README-publishing.md) | Building, versioning, and publishing |

## Quick start

```bash
# Set up consumer auth
echo "@pixel-thread:registry=https://registry.npmjs.org/" >> .npmrc

# Install an item
pnpm dlx @pixel-thread/shared-packages add user-schema

# Or browse and pick interactively
pnpm dlx @pixel-thread/shared-packages add
```

## Registry vs npm package vs workspace

| Approach | When to use |
|----------|------------|
| **Source registry** (this) | Editable templates, schemas, utilities, configs |
| **Private npm package** | Stable shared logic that must stay consistent |
| **Workspace package** | Sharing code inside a single repo |
