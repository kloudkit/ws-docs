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

### Clipboard *(`ws clipboard`)*

- **`paste`:** Paste the clipboard content to the terminal.

```sh
ws clipboard paste > out.txt
```

### Configurations *(`ws config`)*

Many configuration files are defined globally *(in `~` or `/etc`)* and are used
system-wide without needing to be included in the project root.
However, this approach may not work in *CI* environments or on other machines
*(when not using the workspace image)*, as they might lack these global configurations.

To address this, you can use `wp config cp` to copy the current global configuration into
your project root.

- **`markdownlint`:** Copy markdownlint configuration to the project.
- **`ruff`:** Copy ruff configuration to the project.
- **`yamllint`:** Copy yamllint configuration to the project.

```sh
ws config cp ruff
```

### Logging *(`ws log`)*

- **`log debug`:** Log a *debug* message to the console.
- **`log error`:** Log an *error* message to the console.
- **`log info`:** Log an *info* message to the console.
- **`log pipe`:** Directs the output of a piped command to the logger.
- **`log stamp`:** Print the current timestamp *(in the form: `[2025-01-22T16:25:24.722Z]`)*.

The `log *` functions can be supplied with an optional `--indent=*` flag, indicating the
desired number of indentations for prefixing the message.

### Information *(`ws info`)*

Retrieve workspace-related information, including versions and installations.

### Feature Installation *(`ws feature`)*

See our [dedicated section on installing features](/editor/features).

### IP Helpers *(`ws get ip`)*

Retrieve the internal container IP address.
Use the `--node` flag to optionally obtain the IP address of the external node.

A useful example could be when executing a *reverse tunnel* to the remote node:

```sh
ws_node_ip=$(ws get ip --node)

ssh -N -R "3001:${ws_node_ip}:3001" "${ws_node_ip}"
```
