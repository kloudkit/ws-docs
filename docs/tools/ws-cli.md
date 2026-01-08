---
see:
  - name: Github Repository
    link: https://github.com/kloudkit/ws-cli
  - name: Feature installation
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
desired number of indentations for prefixing the message. There is also a `--pipe` flag to loop through piped output.

### Logs (`ws logs`)

Retrieve workspace logs.

```sh
ws logs --level=error --tail=100 --follow
```

### Secrets (`ws secrets`)

Manage encryption, decryption, and master key generation for secure secrets handling.

- **`generate`:** Generate a cryptographically secure master key.
- **`encrypt <plaintext>`:** Encrypt a plaintext value using a master key.
- **`decrypt <encrypted>`:** Decrypt an encrypted value using a master key.

#### Flags

- **`--master <key>`:** Master key or path to key file.
- **`--mode <permissions>`:** File permissions *(e.g., 0o600, 384)*, only when `--output`
    is used. Values can be decimal or octet.
- **`--force`:** Overwrite existing files.
- **`--raw`:** Output without styling.

```sh
# Generate a master key
ws secrets generate --output .master.key --mode 0o600

# Encrypt a value
ws secrets encrypt "my-secret-value" --master .master.key

# Decrypt a value
ws secrets decrypt "base64:TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu..." --master .master.key
```

### Serve (`ws serve`)

Serve internal assets.

- **`current`:** Serve current directory as a static site.
- **`font`:** Serve fonts for local download.

### Show (`ws show`)

Display information about the current workspace instance.

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
