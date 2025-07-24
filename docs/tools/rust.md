# Rust

![Rust logo](/icons/rust.svg){.doc-image width=150px}

When developing in Rust, VSCode expects the project root to be located at the workspace
root *(e.g., /workspace)*.

However, this isn't always the case, especially when dealing with complex project
structures.

## Creating Workspace Configuration

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
