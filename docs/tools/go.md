# GoLang

![GoLang logo](/tools/golang.svg 'attrs={class="doc-image"}')

When developing in Go, VS Code expects the project root to be at the workspace root
*(e.g., `/workspace`)*.
However, this isn't always the case.

To handle this, you can create a `go.work` file at `/workspace/go.work` with the
following content:

```go
go 1.23.3

toolchain go1.23.3

use (
  /workspace/project
  /workspace/team/project
  /workspace/hobby
)
```

This allows you to work with multiple projects simultaneously, even if they are located
at different depths within the workspace.

::: info
A `go.work.sum` file will be generated alongside the `go.work` file, containing the
checksums of the actually downloaded dependencies.
:::
