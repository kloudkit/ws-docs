---
description: "Preinstalled VS Code extensions in Kloud Workspace, and how to add more from Open VSX, keep them on a volume or use a private gallery."
see:
  - name: Editor Settings
    link: /editor/settings
  - name: Features
    link: /editor/features
  - name: Storage
    link: /editor/storage
---

# Extensions

![VS Code logo](/icons/vscode.svg){.doc-image}

Kloud Workspace comes with [preinstalled extensions](#prepackaged-extensions) and installs more
from [Open VSX](https://open-vsx.org), an open source registry for VS Code extensions.

::: info
The VS Code Marketplace [terms of use](https://aka.ms/vsmarketplace-ToU) allow Marketplace
extensions only with Visual Studio products and services, so the workspace uses Open VSX instead.
Some extensions are licensed only for the official VS Code builds and do not work in the workspace.
:::

## Adding Extensions

Two methods keep the extensions you add when the container is recreated: install them when a
container first starts, or keep the extensions directory on a volume.

::: tip
Prefer [Install at Boot](#install-at-boot), so new Kloud Workspace releases can still update the
preinstalled extensions.
:::

### Install at Boot

When a container first starts, Kloud Workspace installs the `.vsix` files in
`~/.ws/extensions/` *(top level only)*.

At the same first start, it also installs extensions by marketplace ID:

- <EnvVar group="editor" name="additional_vs_extensions" />

```sh{2}
docker run \
  -e WS_EDITOR_ADDITIONAL_VS_EXTENSIONS="dbaeumer.vscode-eslint esbenp.prettier-vscode" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

### Persistent Extensions

To take full control of the extensions, mount a volume at `~/.local/share/ws-server/extensions`.
With a *named volume*, the image's initial content of that directory is copied into the volume.

::: warning
Mounting a volume on the extensions directory opts you out of future updates, installs and
changes to the preinstalled extensions that come with the workspace.
:::

```sh{3,6}
# Optional: the volume name is explicitly defined
# below, so the following can be skipped
docker volume create my-extensions

docker run \
  -v my-extensions:/home/kloud/.local/share/ws-server/extensions \
  ghcr.io/kloudkit/workspace:v0.6.0
```

## Privately Hosted Gallery

The workspace installs extensions from [Open VSX](https://open-vsx.org) by default. To use
your own gallery instead, pick the case that matches it.

### Self-Hosted Open VSX

Point each gallery URL at your instance. Set only the keys you serve; the rest keep their
Open VSX value:

- <EnvVar group="marketplace" name="service_url" />
- <EnvVar group="marketplace" name="item_url" />
- <EnvVar group="marketplace" name="extension_url_template" />
- <EnvVar group="marketplace" name="resource_url_template" />
- <EnvVar group="marketplace" name="control_url" />

```sh{2-5}
docker run \
  -e WS_MARKETPLACE_SERVICE_URL=https://vsx.example.com/vscode/gallery \
  -e WS_MARKETPLACE_ITEM_URL=https://vsx.example.com/vscode/item \
  -e WS_MARKETPLACE_EXTENSION_URL_TEMPLATE='https://vsx.example.com/vscode/gallery/{publisher}/{name}/latest' \
  -e WS_MARKETPLACE_RESOURCE_URL_TEMPLATE='https://vsx.example.com/vscode/asset/{publisher}/{name}/{version}/Microsoft.VisualStudio.Code.WebResources/{path}' \
  ghcr.io/kloudkit/workspace:v0.6.1
```

### Any Other Gallery

For a gallery that implements the VS Code Extension Gallery API with a different layout,
pass the whole gallery as JSON:

- <EnvVar group="marketplace" name="gallery" />

Any per-key variable above that is also set overrides its key in the JSON.

::: warning
We strongly discourage you from setting this for the official VS Code Marketplace, since
it infringes on the [terms of use](https://aka.ms/vsmarketplace-ToU).
:::

## Prepackaged Extensions

The table lists the preinstalled extensions and their licenses; some also come with customized
settings.

Thanks to the developers of these extensions.

<!--@include: ../partials/extensions.md -->
