---
see:
  - name: Go
    link: /tools/go
  - name: Features
    link: /editor/features
---

# Rust

![Rust logo](/icons/rust.svg){.doc-image width=150px}

Rust is available as an **optional feature** in Kloud Workspace. It is not pre-installed
by default to keep the base image lightweight.

## Installation

Install the Rust toolchain using the [features](/editor/features) system:

```sh
# Manual installation
ws feature install rust

# Or at boot time
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="rust" \
  ghcr.io/kloudkit/workspace:v0.1.2
```

## What's Included

The `rust` feature installs and configures:

- **rustup** — The official Rust toolchain installer and version manager.
- **cargo** — The Rust package manager and build system.
- **rust-analyzer** — Language server providing IDE features *(completion, go-to-definition,
  refactoring, inline type hints)*.

## VS Code Integration

Once installed, the **rust-analyzer** extension provides:

- IntelliSense and auto-completion.
- Inline type and parameter hints.
- Integrated debugging support.
- Code actions and refactoring.
- Cargo task integration for building, testing, and running.

## Creating Workspace Configuration

When developing in Rust, VS Code expects the project root to be located at the workspace
root *(e.g., /workspace)*.

However, this isn't always the case, especially when dealing with complex project
structures.

To handle such scenarios, you can create a `Cargo.toml` file at `/workspace/Cargo.toml`
with the following content:

```toml
[workspace]
resolver = "2"
members = [
  "/workspace/project",
  "/workspace/team/project",
  "hobby",
]
```

This setup allows you to work with multiple projects simultaneously, even if they are
located at varying depths within the workspace.

The `members` attribute, lists the projects included in the workspace.
These can be defined using either relative or absolute paths.

::: info
A `Cargo.lock` file will be generated alongside the `Cargo.toml` file.
This file contains the checksums of the downloaded dependencies, ensuring consistency
across builds.
:::
