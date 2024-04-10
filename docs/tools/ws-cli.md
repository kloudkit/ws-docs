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

`ws-cli` is a CLI tool designed to supercharge your development by providing a suite of helper
commands.
With `ws-cli`, you can navigate and manage your workspace efficiently, automate repetitive tasks,
and access a variety of functionalities directly from your terminal.

::: tip
The `ws-cli` command can be conveniently used with its alias `ws`.
When executing `ws` without any sub-commands, it automatically navigates to the `/workspace`.

This feature allows for quick access to your workspace root with a minimal command.
:::

## Commands

### Logging *(`ws log`)*

- **`log debug`:** Log a *debug* message to the console.
- **`log error`:** Log an *error* message to the console.
- **`log info`:** Log an *info* message to the console.
- **`log pipe`:** Directs the output of a piped command to the logger.
- **`log stamp`:** Print the current timestamp *(in the form: `[2024-01-22T16:25:24.722Z]`)*.

The `log *` functions can be supplied with an optional `--indent=*` flag, indicating the desired
number of indentations for prefixing the message.

### Feature Installation

See our [dedicated section on installing features](/editor/features).
