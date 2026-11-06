---
description: "What Kloud Workspace gives you: a customized, preconfigured VS Code on Docker, Kubernetes or OpenShift, in the browser or via SSH."
see:
  - name: Getting Started
    link: /pages/getting-started
  - name: Tools Overview
    link: /tools/overview
  - name: Features
    link: /editor/features
  - name: Configuration
    link: /settings/configuration
---

# Introduction

Kloud Workspace gives you a development environment that is ready when it starts:
a customized, preconfigured [VS Code][] with languages, tools and extensions already installed.

Run it with Docker, Kubernetes or OpenShift, and use it in the browser *(or via `ssh`)*.
The editor is VS Code built from source, with telemetry turned off.
The image is based on Debian 13 and runs as the user `kloud` *(uid 1000)*.

## What You Get

| What you get                                                       | Page                                           |
| ------------------------------------------------------------------ | ---------------------------------------------- |
| A workspace in your browser, started with one command              | [Getting Started](/pages/getting-started)      |
| Sign-in with a password or OIDC, once you set one                  | [Authentication](/editor/authentication)       |
| Persistent files, on volumes for `/workspace` and `~/.ws`          | [Storage](/editor/storage)                     |
| Preinstalled tools: Python, Go, Docker, Helm, Claude Code and more | [Tools Overview](/tools/overview)              |
| More tools on demand, such as C/C++, .NET and Rust                 | [Features](/editor/features)                   |
| Preinstalled VS Code extensions, and more from Open VSX            | [Extensions](/editor/extensions)               |
| Preconfigured VS Code settings that you can change                 | [Editor Settings](/editor/settings)            |
| The Catppuccin Frappé theme and bundled fonts                      | [Theme & Fonts](/editor/theme-and-fonts)       |
| zsh with a Starship prompt, history search and clipboard commands  | [Terminal](/editor/terminal)                   |
| Aliases for common commands, and your own                          | [Aliases](/editor/aliases)                     |
| Apps you run in the workspace, served at `/proxy/<port>/`          | [Port Forwarding](/editor/port-forwarding)     |
| Configuration through `WS_*` environment variables                 | [Configuration](/settings/configuration)       |
| Your own scripts, run when a new container starts                  | [Autoload Scripts](/settings/autoload-scripts) |
| Files and secrets written when a new container starts              | [Seed](/settings/seed)                         |
| Secrets encrypted with your own master key                         | [Secrets](/settings/secrets)                   |
| HTTPS, and trust for your own CA certificates                      | [TLS & Certificates](/settings/tls)            |
| Prometheus metrics, once you turn them on                          | [Metrics](/editor/metrics)                     |
| A CLI for features, logs, secrets, seed files and the clipboard    | [ws-cli](/tools/ws-cli)                        |

## License

::: info
Thanks to the [VS Code][] team for open-sourcing the editor this project is built on.
:::

Kloud Workspace is released under the [**MIT License**][MIT].
KloudKIT logos and other brand assets are proprietary, all rights reserved *(see the [brand license][Brand])*.

![License](/icons/mit.svg) {.doc-image-inline style="width:100px"}

[VS Code]: https://github.com/Microsoft/vscode
[MIT]: https://github.com/kloudkit/ws-meta/blob/main/LICENSE
[Brand]: https://github.com/kloudkit/ws-meta/blob/main/shared/brand/LICENSE
