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
In an interactive workspace terminal, `ws` is a shortcut for `ws-cli`.
With no arguments, it changes to the workspace root *(`WS_SERVER_ROOT`, `/workspace` by default)*.

`ws` is a `zsh` function, so scripts, `docker exec` and CI must call `ws-cli`.
:::

## Commands

<!--@include: ../partials/commands.md -->
