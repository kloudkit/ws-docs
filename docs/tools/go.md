# GoLang

![GoLang logo](/icons/golang.svg){.doc-image width=160px}

When developing in Rust, VSCode expects the project root to be located at the workspace
root *(e.g., /workspace)*.

However, this isn't always the case, especially when dealing with complex project
structures.

## Creating a Workspace Configuration

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
