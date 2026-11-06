---
description: "Set up a local checkout of the Kloud Workspace docs, ws-cli or the feature store, and run their checks."
see:
  - name: Contribute
    link: /contribute/
  - name: Contribution Workflow
    link: /contribute/contribution-workflow
---

# Development Environment

Each public repository builds on its own.
Every one of them lints with [pre-commit](https://pre-commit.com), so install it once:

```sh
pip install pre-commit
```

## Documentation *(ws-docs)*

Use Node.js 22 or later and Yarn 1.

```sh
git clone https://github.com/kloudkit/ws-docs
cd ws-docs
yarn install --frozen-lockfile

# Generate the tables that come from other repositories, then start the dev server
yarn docs:generate-dynamic
yarn docs:dev
```

Pages live in `docs/`, the site config in `.vitepress/` and the table generators in `scripts/`.
Files in `.vitepress/data/` are synced from other repositories; don't edit them by hand.

::: tip
`yarn docs:dev` does not regenerate the generated tables.
Run `yarn docs:generate-dynamic` again after you pull new data.
:::

Before you push:

```sh
yarn test
yarn build
pre-commit run --all-files
```

## CLI *(ws-cli)*

Use Go 1.27.1 or later.

```sh
git clone https://github.com/kloudkit/ws-cli
cd ws-cli
go mod download
go build -o ws-cli .
```

After you change a command under `cmd/`, regenerate the command manifest; a test fails until it matches:

```sh
go run ./tools/gen-commands
```

Before you push:

```sh
go test ./...
go vet ./...
pre-commit run --all-files
```

## Feature Store *(ws-feature-store)*

The store's downloadable artifacts are listed in `src/artifacts/*.json`.
After you change one, refresh its checksums:

```sh
./scripts/update-artifact-checksums.sh
```

Building the store image needs the KloudKIT signing key, so a maintainer builds and publishes it.
