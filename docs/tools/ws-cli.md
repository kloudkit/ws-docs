---
description: "ws-cli is the CLI companion for Kloud Workspace — a suite of helper commands to navigate, manage, and automate your workspace."
see:
  - name: GitHub Repository
    link: https://github.com/kloudkit/ws-cli
  - name: Feature Installation
    link: /editor/features
---

# `ws-cli` *(alias: `ws`)*

> ⚡ CLI companion to charge the workspace batteries

## Overview

`ws-cli` is a CLI tool designed to supercharge your development by providing a suite of
helper commands.
With `ws-cli`, you can navigate and manage your workspace efficiently, automate repetitive
tasks, and access a variety of functionalities directly from your terminal.

::: tip
The `ws-cli` command can be conveniently used with its alias `ws`.
When executing `ws` without any sub-commands, it automatically navigates to the
`/workspace`.

This feature allows for quick access to your workspace root with a minimal command.
:::

## Commands

### Clipboard (`ws clip`)

Interact with the browser clipboard from the terminal.

- **`paste`:** Paste clipboard content.

```sh
# Save clipboard to file
ws clip paste > out.txt

# Use in pipeline
ws clip paste | grep "pattern"
```

::: tip
For quick clipboard access, use the clipboard binaries:

```sh
# macOS-compatible
echo "copy this" | pbcopy
pbpaste

# X11-compatible
echo "copy this" | xclip -sel c
xclip -o -sel c

# Alternative X11
echo "copy this" | xsel -b
xsel -b -o
```

:::

See the [Terminal Clipboard](/editor/terminal#clipboard) section for more details.

### Features (`ws feature`)

Install and manage additional pre-configured features.

- **`list`:** List available features that can be installed.
- **`info <feature>`:** Show detailed information about a feature.
- **`install <feature>`:** Install a feature.

See our [dedicated section on installing features](/editor/features).

### Information (`ws info`)

Display workspace information.

- **`env`:** Display effective workspace environment variables.
- **`extensions`:** Display installed extensions.
- **`metrics`:** Display system resource usage *(CPU, memory, disk, GPU, networking, etc.)*.
- **`uptime`:** Display the workspace uptime.
- **`version`:** Display installed workspace version.

### Logging (`ws log`)

Log messages to the console.

- **`debug <message>`:** Log a *debug* message.
- **`error <message>`:** Log an *error* message.
- **`info <message>`:** Log an *info* message.
- **`warn <message>`:** Log a *warning* message.
- **`stamp`:** Print the current timestamp.

The `log *` functions can be supplied with an optional `--indent=*` flag, indicating the
desired number of indentations for prefixing the message. There is also a `--pipe` flag to
loop through piped output.

### Logs (`ws logs`)

Retrieve workspace logs.

```sh
ws logs --level=error --tail=100 --follow
```

### Secrets (`ws secrets`)

Manage encryption, decryption, and master key generation for secure secrets handling.

For comprehensive documentation including secret types and security best practices, see the
[dedicated secrets documentation](/settings/secrets).

#### Quick Reference

- **`generate`:**
  - **`master`:** Generate a cryptographically secure master key.
  - **`login`:** Generate a login password hash for authentication.
- **`encrypt <plaintext>`:** Encrypt a plaintext value.
- **`decrypt <encrypted>`:** Decrypt an encrypted value.

### Seed (`ws seed`)

Project files and secrets from a durable source directory onto the filesystem. See the
[seed documentation](/settings/seed) for the manifest schema and ownership boundary.

- **`apply [dest...]`:** Project the seed plan, optionally scoped to named destinations *(`--force`
  overwrites existing destinations)*.
- **`ls`:** List the resolved seed plan.

### Serve (`ws serve`)

Serve internal assets.

- **`current`:** Serve current directory as a static site.
- **`font`:** Serve fonts for local download.

### Show (`ws show`)

Display information about the current workspace instance.

- **`env <group.prop>`:** Display the resolved value of a setting, queried by its canonical **dotted** key
  (e.g. `ws-cli show env server.port`). Falls back to the default declared in `env.reference.yaml` when unset.
  The matching `WS_*` variable (`WS_SERVER_PORT`) is the environment binding you `export` to set it — it is
  not a query key (`ws-cli show env WS_SERVER_PORT` exits `2` with a hint pointing at the dotted form).
  - *(no flags)* — pretty mode: shows the dotted key (and its `WS_*` binding), schema description,
    markdown-rendered `longDescription`, resolved value, and source label (`env-set` / `deprecated-alias` / `yaml-default`).
  - `--value` — print the resolved value as a single line (script-friendly). Combinable with `--check`
    to emit the value only when the operator has set the variable (`--value --check`).
  - `--as bool|int|list` — validate and emit the resolved value as the requested type
    (`bool` exits `0` truthy / `1` falsy / error on garbage; `int` prints canonical int10;
    `list` newline-splits using the YAML `delimiter:` or `--delimiter` override). Mutually exclusive with `--value`.
  - `--check [--deprecated <WS_ALIAS>]` — existence probe. `--deprecated` takes a **raw `WS_*` alias** (deprecated
    aliases have no dotted form). Exits `0` when the preferred variable is set;
    `1` when unset (stderr carries a deprecation warning if `--deprecated` is supplied and the alias
    is set); `2` when both the preferred variable and the deprecated alias are set (aborts to stderr).
  - `--or-skip` — modifier on `--value` / `--value --check` / `--as bool`: exit `1` (not an error) on the
    natural absence of the chosen projection, emitting a `Skipped: env [<KEY>] not set` debug breadcrumb to
    stderr. Lets a script guard with `if val=$(ws-cli show env <group.prop> --value --or-skip); then …`.
  - `--validate <regex>` — modifier on `--as list`: each token must full-match the anchored caller-supplied
    charset; on any miss the whole list fails **closed** (no tokens emitted, exit `3`, stderr
    `Rejected: invalid item [<token>]`). Centralizes token rejection for untrusted delimited sinks.
  - Unknown dotted keys (not declared in `env.reference.yaml`) exit non-zero with stderr
    `Unknown env var [<group.prop>]` (echoing the typed dotted form) in all non-`--check` modes.
- **`ip`:**
  - **`internal`:** Display the internal IP address.
  - **`node`:** Display the node/host IP address.
- **`path`:**
  - **`home`:** Display the workspace home path.
  - **`vscode-settings`:** Display the VS Code settings path.

A useful example could be when executing a *reverse tunnel* to the remote node:

```sh
ws_node_ip=$(ws show ip node)

ssh -N -R "3001:${ws_node_ip}:3001" "${ws_node_ip}"
```

### Templates (`ws template`)

Manage static configuration files. Many configuration files are defined
globally *(in `~` or `/etc`)* and are used system-wide without needing to be included in
the project root.

However, this approach may not work in *CI* environments or on other
machines *(when not using the workspace image)*, as they might lack these global
configurations.

- **`list`:** List all available configuration templates.
- **`show <template>`:** Display the contents of a configuration template.
- **`apply <template>`:** Apply a configuration template to the current project.

```sh
ws template apply ruff
```

### Version (`ws version`)

Display the installed workspace version.
