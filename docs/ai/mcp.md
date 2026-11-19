---
description: "Serve Kloud Workspace's own tools to an AI agent over the Model Context Protocol with ws-cli serve mcp, read-only by default."
see:
  - name: AI Overview
    link: /ai/
  - name: Claude Code
    link: /tools/claude
  - name: ws-cli
    link: /tools/ws-cli
  - name: Configuration
    link: /settings/configuration
---

# MCP Server <Badge type="info" text="next release" />

`ws-cli serve mcp` serves the workspace's own tools to an AI agent: editor diagnostics, settings, logs,
features and templates.

It is a Model Context Protocol *(MCP)* server over stdio: the agent starts it and talks to it over
stdin and stdout.
No port is opened, so the server is not reachable over the network.

## Register the Server

Registration is manual.
Run the command for your agent once, in a workspace terminal:

::: code-group

```sh [Claude Code]
claude mcp add ws -- ws-cli serve mcp
```

```sh [Codex]
codex mcp add ws -- ws-cli serve mcp
```

:::

Any other MCP client that can start a stdio command can use the same command, `ws-cli serve mcp`.

::: tip
Register `ws-cli`, not the `ws` shortcut.
`ws` exists only in interactive terminals, so an agent cannot start it.
:::

## Tools

Each tool runs one `ws-cli` command and returns its output.
A tool is named after its command path, joined with `_`: `ws-cli show env` is the tool `show_env`.

By default the server lists only tools that read:

| Group      | Tool                        | Returns                                                            |
| ---------- | --------------------------- | ------------------------------------------------------------------ |
| `editor`   | `editor_diagnostics`        | Language-server errors and warnings, for the workspace or one file |
| `editor`   | `editor_list`               | Open editor tabs, each with its path, language and state           |
| `editor`   | `editor_selection`          | The active editor's selection: file, range and selected text       |
| `feature`  | `feature_info`              | A feature's description and the variables it accepts               |
| `feature`  | `feature_list`              | The features you can install and where each comes from             |
| `feature`  | `feature_store`             | The artifacts in the feature store                                 |
| `info`     | `info_extensions`           | Installed VS Code extensions with their versions                   |
| `info`     | `info_metrics`              | Live CPU, memory, disk and file descriptor usage, GPU on request   |
| `info`     | `info_uptime`               | When the workspace session started and how long it has run         |
| `info`     | `info_version`              | The workspace version, with `ws-cli` and VS Code on request        |
| `logs`     | `logs`                      | A workspace log, filtered by level and limited to its last lines   |
| `seed`     | `seed_ls`                   | Seed destinations, each with its operation                         |
| `show`     | `show_env`                  | A setting by its dotted key *(`server.port`)*, with its source     |
| `show`     | `show_ip_internal`          | The container's internal IP address                                |
| `show`     | `show_ip_node`              | The IP address of the node hosting the workspace                   |
| `show`     | `show_path_home`            | The workspace root path                                            |
| `show`     | `show_path_vscode_settings` | The path to the VS Code settings file, user or folder              |
| `template` | `template_list`             | The configuration templates you can apply                          |
| `template` | `template_show`             | The contents of a configuration template                           |

`feature_store` is listed only when `WS_FEATURES_STORE_URL` is set.

`show_env` never returns the value of a secret setting: it shows `<redacted>` in its place.

## Allow Tools That Act on the Workspace

Three tools change the workspace instead of reading it:

| Tool             | Action                                                              |
| ---------------- | ------------------------------------------------------------------- |
| `editor_open`    | Opens a file in the editor, as a tab or a preview tab               |
| `editor_reveal`  | Selects a file or folder in the Explorer sidebar without opening it |
| `template_apply` | Copies a configuration template into the project                    |

The server lists them only when this variable is `true`:

- **`WS_AI_MCP_ALLOW_WRITE`:** Enables the MCP tools that act on the workspace.

```sh{2}
docker run \
  -e WS_AI_MCP_ALLOW_WRITE=true \
  ghcr.io/kloudkit/workspace:v0.6.0
```

## Narrow the Tool List

To serve fewer tools, name the ones to keep in this variable:

- **`WS_AI_MCP_TOOLS`:** Comma-separated list of MCP tools to serve.

Each entry is a group or a tool name from the tables above.
The default, `*`, serves every tool.

To serve the `info` and `editor` groups and the single tool `show_env`:

```sh{2}
docker run \
  -e WS_AI_MCP_TOOLS="info,show_env,editor" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

An entry that names no group or tool is ignored with a warning.
Naming a tool that acts on the workspace does not allow it: `editor_open` is still listed only with
`WS_AI_MCP_ALLOW_WRITE`.

::: warning Not a Security Boundary
These two variables shape the list of tools an agent sees.
They do not restrict the agent: one with a terminal can already run `ws-cli` itself.
:::

## Server Output

The server writes a start banner and one line per tool call to stderr.
The banner reports how many tools are served and any filter in effect, and each line names the tool,
its outcome and how long it took.
