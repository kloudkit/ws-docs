---
description: "The AI coding agents Kloud Workspace ships or installs on demand, and how they use the workspace's own tools."
see:
  - name: MCP Server
    link: /ai/mcp
  - name: Claude Code
    link: /tools/claude
  - name: Features
    link: /editor/features
---

# AI Overview

Kloud Workspace ships one AI coding agent, installs three more on demand, and serves its own tools to
any of them.

## Agents

Claude Code is preinstalled.
Codex, Continue and OpenCode are opt-in [features](/editor/features).

| Agent                              | Availability       | CLI                        | VS Code Extension       |
| ---------------------------------- | ------------------ | -------------------------- | ----------------------- |
| [**Claude Code →**](/tools/claude) | Preinstalled       | `claude`                   | `Anthropic.claude-code` |
| Codex                              | `codex` feature    | `@openai/codex` *(npm)*    |                         |
| Continue                           | `continue` feature | `@continuedev/cli` *(npm)* | `Continue.continue`     |
| OpenCode                           | `opencode` feature | `opencode-ai` *(npm)*      | `sst-dev.opencode`      |

The `codex` feature also sets up `zsh` completion for the `codex` command.
The `continue` feature's CLI is named `cn`.

## Install an Agent

To install an agent when a container first starts, list its feature in this variable:

- <EnvVar group="features" name="additional_features" />

```sh{2}
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="codex opencode" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

To add one to a running workspace, run `ws-cli feature install`:

```sh
ws-cli feature install codex
```

A feature configures no account or API key, so sign in the way the agent's own documentation describes.

## Workspace Tools

Every agent runs inside the workspace container, so it can run the preinstalled CLI tools and `ws-cli`
in a terminal, as you do.

The workspace also serves a set of `ws-cli` commands as tools over the Model Context Protocol *(MCP)*.
An agent that registers the [MCP server](/ai/mcp) can read editor diagnostics, settings and logs as
tool calls.
