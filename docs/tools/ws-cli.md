---
description: "ws-cli is the Kloud Workspace command line: inspect the running workspace, manage settings and secrets, drive the editor, and serve local assets."
see:
  - name: Features
    link: /editor/features
  - name: GitHub Repository
    link: https://github.com/kloudkit/ws-cli
    target: _blank
---

# ws-cli

`ws-cli` groups the workspace's helper commands:
inspect the running workspace, manage settings and secrets, drive the editor, and serve local assets.
The startup scripts call most of them, and all of them work in your terminal:

```sh
ws-cli info version --all
```

## The `ws` Shortcut

In an interactive workspace terminal, `ws` is a shortcut for `ws-cli`.
With no arguments, it changes to the workspace root *(`WS_SERVER_ROOT`, `/workspace` by default)*.

`ws` is a `zsh` function that exists only in interactive terminals, so scripts, `docker exec` and CI must call `ws-cli`.

## Commands

<!--@include: ../partials/commands.md -->
