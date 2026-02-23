---
see:
  - name: Rust
    link: /tools/rust
  - name: Features
    link: /editor/features
---

# Go

![Go logo](/icons/golang.svg){.doc-image width=160px}

Go is pre-installed in Kloud Workspace and comes with a full development toolchain ready
to use out of the box.

Key features provided *out-of-the-box*:

- **Go** runtime and compiler.
- The **Go** VS Code extension *(golang.go)* with rich language support.
- A comprehensive set of Go development tools *(linting, debugging, testing, code generation)*.
- Auto-completion, go-to-definition, and refactoring powered by **gopls**.

## Pre-installed Tools

Kloud Workspace ships with the following Go tools, all pre-compiled and available
on `$PATH`:

- **dlv:** Delve debugger for Go.
- **gopls:** The official Go language server providing IDE features.
- **staticcheck:** Advanced static analysis and linting.
- **gomodifytags:** Modify struct field tags *(add, remove, clear)*.
- **gotests:** Generate table-driven tests from function signatures.
- **impl:** Generate method stubs for implementing interfaces.
- **go-outline** Extract JSON representation of Go source file declarations.
- **goplay:** Run Go snippets in the Go Playground from the editor.

## VS Code Integration

The pre-installed [Go extension](https://open-vsx.org/extension/golang/Go) provides:

- IntelliSense and auto-completion via **gopls**.
- Integrated debugging with **dlv**.
- Test runner with code-lens support.
- Code generation *(struct tags, interface stubs, test skeletons)*.
- Linting and analysis via **staticcheck**.

## Go Version Management

Alternative Go versions can be installed using the [features](/editor/features) system.

## Creating Workspace Configuration

When developing in Go, VS Code expects the project root to be located at the workspace
root *(e.g., /workspace)*.

However, this isn't always the case, especially when dealing with complex project
structures.

To handle such scenarios, you can create a `go.work` file at `/workspace/go.work` with
the following content:

```go
go 1.24.0

toolchain go1.24.0

use (
  /workspace/project
  /workspace/team/project
  /workspace/hobby
)
```

This setup allows you to work with multiple projects simultaneously, even if they are
located at varying depths within the workspace.

::: info
A `go.work.sum` file will be generated alongside the `go.work` file.
This file contains the checksums of the downloaded dependencies, ensuring consistency
across builds.
:::
