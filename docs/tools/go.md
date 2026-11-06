---
description: "Go comes preinstalled in Kloud Workspace with gopls, Delve, staticcheck, more Go tools, and the Go VS Code extension."
see:
  - name: Rust
    link: /tools/rust
  - name: Features
    link: /editor/features
---

# Go

![Go logo](/icons/golang.svg){.doc-image width=160px}

Go is preinstalled in Kloud Workspace, with its development tools and VS Code extension:

- **Go** runtime and compiler.
- The **Go** VS Code extension *(golang.go)*.
- Go development tools *(linting, debugging, testing, code generation)*.
- Auto-completion, go-to-definition, and refactoring powered by **gopls**.

## Projects Below the Workspace Root

VS Code expects a Go project's root to be the workspace root *(e.g., /workspace)*.
When your projects sit elsewhere, as in more complex project structures,
create a `go.work` file at `/workspace/go.work` that lists them:

```sh
cd /workspace
go work init ./project ./team/project ./hobby
```

You can then work on several projects at once, even at different depths in the workspace.

::: info
Go generates a `go.work.sum` file next to the `go.work` file.
It holds the checksums of the downloaded dependencies, which keeps builds consistent.
:::

## Go Version Management

Go downloads the toolchain a module asks for:
`GOTOOLCHAIN` is `auto`, so a `go` or `toolchain` line newer than the preinstalled Go fetches that version.
To keep another version alongside, install it with `go install golang.org/dl/go1.X.Y@latest`.

## Preinstalled Tools

Kloud Workspace ships these Go tools, all precompiled and on `$PATH`:

- **dlv:** Delve debugger for Go.
- **gopls:** The official Go language server, which provides the IDE features.
- **staticcheck:** Static analysis and linting.
- **gomodifytags:** Modify struct field tags *(add, remove, clear)*.
- **gotests:** Generate table-driven tests from function signatures.
- **impl:** Generate method stubs for implementing interfaces.
- **go-outline:** Extract a JSON representation of the declarations in a Go source file.
- **goplay:** Run Go snippets in the Go Playground from the editor.

## VS Code Integration

The preinstalled [Go extension](https://open-vsx.org/extension/golang/Go) provides:

- IntelliSense and auto-completion via **gopls**.
- Integrated debugging with **dlv**.
- Test runner with code-lens support.
- Code generation *(struct tags, interface stubs, test skeletons)*.
- Linting and analysis via **staticcheck**.
