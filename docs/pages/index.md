# Kloud Workspace

> 🔋 A batteries included pre-configured development workspace inside a Docker container

## Overview

Run your customized and pre-configured version of [VSCode][] *(powered by Coder)* using
Docker, Kubernetes, or OpenShift and access it in the browser *(or via `ssh`)*.

---

Over the past decade, both companies and individual developers have increasingly embraced
cloud-based workflows for CI, deployment, testing, and staging.
Yet, the shift of actual development processes to the cloud has lagged behind.
Despite the convenience and efficiency the cloud offers, developers have largely clung to
the familiar comfort of the *desktop experience*, hesitating to move their development
tools into the cloud.

Recognizing this gap, Kloud Workspace was tailored to facilitate this transition.
By packaging the widely-used *VSCode* IDE as a Docker container *(powered by Coder)*,
and integrating the latest development environments along with essential tools and
extensions, we offer a seamless bridge to the cloud.

## Add-ons

The *workspace* is tailored for both development and DevOps purposes.
It ships with a set of preinstalled tools, meticulously curated to streamline and enhance
your day-to-day workflow.

These tools, thoughtfully integrated *(and pre-configured)*, encompass a suite of
functionalities ranging from version control, build automation tools, and more.

::: info
The upcoming sections only list a subset of the included addons.
For a full in-depth list, have a look at the various requirement definitions in
[our repo](https://github.com/kloudkit/workspace).
:::

### Tools

See our [dedicated section on CLI tools](/tools/).

### Extensions

See our [dedicated section on VSCode extensions](/editor/extensions).

### Terminal

See our [dedicated section on the terminal](/editor/terminal).

## License

::: info 👏 THANKS
Many thanks to [Coder's `code-server`](https://code-server.dev) for providing the solid
foundation that serves as the cornerstone and enables this project's extensions.
:::

This project is licensed under the [**MIT License**][Workspace].

![License](/icons/mit.svg) {.doc-image-inline style="width:100px"}

[VSCode]: https://github.com/Microsoft/vscode
[Workspace]: https://github.com/kloudkit/workspace?tab=MIT-1-ov-file#MIT-1-ov-file
