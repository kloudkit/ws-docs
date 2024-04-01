# Kloud Workspace

> 🔋 A batteries included pre-configured development workspace

## Overview

Run your customized and pre-configured version of [VS Code][] using Docker or Kubernetes
and access it in the browser *(or via `ssh`)*.

## Addons

The *workspace* is tailored for both development and DevOps purposes.
It ships with a set of preinstalled tools, meticulously curated to streamline and enhance your
day-to-day workflow.
These tools, thoughtfully integrated *(and pre-configured)*, encompass a suite of functionalities
ranging from version control, build automation tools, and more.

::: info
The upcoming sections only list a subset of the included addons.
For a full in-depth list, have a look at the various requirement definitions in
[our repo](https://github.com/kloudkit/workspace).
:::

### Tools

#### Containers & Kubernetes

- Docker CLI `>=24`
- Docker Compose `>=2.21`
- Docker Engine
- Docker Buildx
- hadolint `>=2.12`
- Helm `>=3.12`
- helm-diff `>=3.8.1`
- kind `>=0.20`
- Kubectl `>=1.28`
- kube-linter `>=0.6.5`

#### Languages

- Go `>=1.21`
- NodeJS `>=20`
- Python `>=3.11`

#### Other

- cloudflared `>=2023.10`
- cspell `>=8.1`
- Git `>=2.30`
- jq `>=1.6`
- markdownlint `>=0.38`
- nano
- shellcheck
- vim
- yq

### Extensions

See our [dedicated section on VSCode extensions](/editor/extensions).

### Terminal

See our [dedicated section on the terminal](/editor/terminal).

### Configurations

@TODO

## License

::: info 👏 Thanks
Many thanks to [Coder's `code-server`](https://code-server.dev/) for providing the solid
foundation that serves as the cornerstone and enables this project's extensions.
:::

[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&link=https://github.com/kloudkit/workspace?tab=MIT-1-ov-file#MIT-1-ov-file)][Workspace]

This project is licensed under the
[**MIT License**](https://github.com/kloudkit/workspace?tab=MIT-1-ov-file#MIT-1-ov-file).

[VS Code]: https://github.com/Microsoft/vscode
[Workspace]: https://github.com/kloudkit/workspace?tab=MIT-1-ov-file#MIT-1-ov-file
