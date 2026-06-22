# Publishing Guide

## Before you publish

### 1. Set the correct package name

Replace `@pixel-thread` with your actual npm scope in:

- `package.json` — `name` and `publishConfig`
- `registry.json` — `name`
- `README-consumer.md` — scope references

### 2. Build

```bash
pnpm build
```

### 3. Verify the package contents

```bash
pnpm pack --dry-run
```

Ensure `dist/`, `registry.json`, and `src/items/` are included (defined in `package.json` `files` field).

### 4. Version your release

```bash
# Patch (bug fix)
pnpm version patch

# Minor (new backward-compatible item)
pnpm version minor

# Major (breaking change)
pnpm version major
```

## Publish

### npm public registry

```bash
pnpm publish --access restricted
```

### GitHub Packages

Update `package.json`:

```json
"publishConfig": {
  "registry": "https://npm.pkg.github.com"
}
```

Add `.npmrc`:

```ini
@pixel-thread:registry=https://npm.pkg.github.com
```

Publish:

```bash
npm login --scope=@pixel-thread --registry=https://npm.pkg.github.com
pnpm publish
```

## Verify the published package

From a clean directory:

```bash
pnpm dlx @pixel-thread/shared-packages list
pnpm dlx @pixel-thread/shared-packages add user-schema
```

## Release checklist

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm format:check` passes
- [ ] `pnpm pack --dry-run` shows all expected files
- [ ] `shared-packages list` works locally
- [ ] Each item installs into a clean test project
- [ ] Existing-file skip behavior works
- [ ] `--overwrite` works
- [ ] Dependency installation works
- [ ] Version is updated
- [ ] No credentials or secrets in the package
