---
description: "Run a customized, pre-configured VS Code workspace on Docker, Kubernetes, or OpenShift, in the browser or via SSH."
---

# Kloud Workspace

> 🔋 A batteries-included pre-configured development workspace inside a Docker container

## Overview

Run your customized and pre-configured version of [VS Code][] using Docker, Kubernetes,
or OpenShift and access it in the browser *(or via `ssh`)*.

---

Over the past decade, both companies and individual developers have increasingly embraced
cloud-based workflows for CI, deployment, testing, and staging.
Yet, the shift of actual development processes to the cloud has lagged behind.
Despite the convenience and efficiency the cloud offers, developers have largely clung to
the familiar comfort of the *desktop experience*, hesitating to move their development
tools into the cloud.

Recognizing this gap, Kloud Workspace was tailored to facilitate this transition.
By packaging the widely-used *VS Code* IDE as a Docker container,
and integrating the latest development environments along with essential tools and
extensions, we offer a seamless bridge to the cloud.

## Add-ons

The *workspace* is tailored for both development and DevOps purposes.
It ships with a set of preinstalled tools, meticulously curated to streamline and enhance
your day-to-day workflow.

These tools, thoughtfully integrated *(and pre-configured)*, encompass a suite of
functionalities ranging from version control, build automation tools, and more.

::: info
For the full lists, see the [Tools overview](/tools/overview) and the
[preinstalled extensions](/editor/extensions#prepackaged-extensions).
:::

### Tools

See our [dedicated section on CLI tools](/tools/overview).

### Extensions

See our [dedicated section on VS Code extensions](/editor/extensions).

### Terminal

See our [dedicated section on the terminal](/editor/terminal).

## License

::: info 👏 THANKS
Many thanks to the [VS Code][] team for open-sourcing the editor that serves as the
cornerstone of this project.
:::

Kloud Workspace is released under the [**MIT License**][MIT].
KloudKIT logos and other brand assets are proprietary, all rights reserved *(see the
[brand license][Brand])*.

![License](/icons/mit.svg) {.doc-image-inline style="width:100px"}

[VS Code]: https://github.com/Microsoft/vscode
[MIT]: https://github.com/kloudkit/ws-meta/blob/main/LICENSE
[Brand]: https://github.com/kloudkit/ws-meta/blob/main/shared/brand/LICENSE
