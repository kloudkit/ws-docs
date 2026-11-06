---
description: "Add Rust to Kloud Workspace with the opt-in rust feature: rustup, cargo, and the rust-analyzer extension."
see:
  - name: Features
    link: /editor/features
  - name: Go
    link: /tools/go
---

# Rust <Badge type="tip" text="installable feature" />

<!--@include: ../partials/feature-not-included.md -->

![Rust logo](/icons/rust.svg){.doc-image width=150px}

The `rust` feature adds the Rust toolchain and the rust-analyzer extension to the workspace.

## Installation

Install the Rust toolchain using the [features](/editor/features) system:

```sh
# Manual installation
ws-cli feature install rust

# Or at boot time
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="rust" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

The toolchain uses rustup's `minimal` profile, without `clippy` or `rustfmt`.
The editor's rust-analyzer checks code with `clippy`,
so add both after installing, or install with `--opt profile=default`:

```sh
rustup component add clippy rustfmt
```

## Projects Below the Workspace Root

VS Code expects a Rust project's root to be the workspace root *(e.g., /workspace)*.
When your projects sit elsewhere, as in more complex project structures,
create a `Cargo.toml` file at `/workspace/Cargo.toml` that lists them:

```toml
[workspace]
resolver = "2"
members = [
  "/workspace/project",
  "/workspace/team/project",
  "hobby",
]
```

You can then work on several projects at once, even at different depths in the workspace.

The `members` list names the projects in the workspace, as relative or absolute paths.

::: info
Cargo generates a `Cargo.lock` file next to the `Cargo.toml` file.
It holds the checksums of the downloaded dependencies, which keeps builds consistent.
:::

## What's Included

The `rust` feature installs and configures:

- **rustup:** The official Rust toolchain installer and version manager.
- **cargo:** The Rust package manager and build system.
- **rust-analyzer:** Language server providing IDE features
  *(completion, go-to-definition, refactoring, inline type hints)*.

## VS Code Integration

Once installed, the **rust-analyzer** extension provides:

- IntelliSense and auto-completion.
- Inline type and parameter hints.
- Run and debug code lenses *(debugging needs a debug adapter extension such as CodeLLDB)*.
- Code actions and refactoring.
- Cargo task integration for building, testing, and running.
