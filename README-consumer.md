# Consumer Guide

## Local development (no publish needed)

Point an alias or link at the local checkout:

### Option A — zsh alias

```zsh
# Add to ~/.zshrc
alias shared-packages="node /path/to/shared-packages/dist/cli.js"
```

Then reload and use:

```bash
source ~/.zshrc
shared-packages list
shared-packages add user-schema
```

### Option B — npm link

```bash
cd /path/to/shared-packages
npm link
```

Now `shared-packages` is available globally:

```bash
shared-packages list
shared-packages add user-schema
```

### Option C — pnpm link

```bash
cd /path/to/shared-packages
pnpm link --global
```

## Prerequisites

- Node.js 20+
- pnpm, npm, or Yarn
- Access to the `@pixel-thread` npm scope

## Setup

Configure npm to resolve the `@pixel-thread` scope:

```ini
# .npmrc
@pixel-thread:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Authenticate (one-time):

```bash
npm login --scope=@pixel-thread
```

## Commands

### List available items

```bash
pnpm dlx @pixel-thread/shared-packages list
```

### Install an item

```bash
pnpm dlx @pixel-thread/shared-packages add user-schema
```

This copies the item's files into your project and installs its dependencies.

### Overwrite existing files

```bash
pnpm dlx @pixel-thread/shared-packages add user-schema --overwrite
```

### Skip dependency installation

```bash
pnpm dlx @pixel-thread/shared-packages add user-schema --skip-install
```

## Installed files become yours

The copied source files are part of your project — edit them freely. They will not be overwritten unless you use `--overwrite`.
