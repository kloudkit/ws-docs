---
description: "Manage VS Code extensions in Kloud Workspace, including Marketplace terms and how to pre-install extensions in your deployment."
---

# VS Extensions

## Official Marketplace

![VS Code logo](/icons/vscode.svg){.doc-image}

According to the VS Code Marketplace [Terms of Use](https://aka.ms/vsmarketplace-ToU), you
may only install and use Marketplace Offerings with Visual Studio Products and Services.

> Marketplace Offerings are intended for use only with Visual Studio Products and
> Services, and you may only install and use Marketplace Offerings with Visual Studio
> Products and Services.

For this reason, we use [Open-VSX](https://open-vsx.org), an open source registry for VS
Code extensions.

::: info
Please note that some Visual Studio Code extensions have licenses that restrict their use
to the official Visual Studio Code builds and therefore do not work with our workspace.
:::

## Installing User-Defined Extensions

Recognizing your individual preferences for VS Code extensions, we provide two methods for
ensuring your workspace retains custom installed extensions across restarts.

::: tip
Kloud Workspace is always evolving.
To gain the most from all the new features and upgrades, we suggest using the
[`"Install at Boot"`](#install-at-boot) method.
:::

### Install at Boot

Upon startup, Kloud Workspace automatically scans `~/.ws/extensions/` for `.vsix` files
and installs them.

You can also install additional extensions by marketplace ID:

- <EnvVar group="editor" name="additional_vs_extensions" />

```sh{2}
docker run \
  -e WS_EDITOR_ADDITIONAL_VS_EXTENSIONS="dbaeumer.vscode-eslint esbenp.prettier-vscode" \
  ghcr.io/kloudkit/workspace:v0.5.2
```

### Persistent Extensions

You can take full control of the workspace extensions by using a persistent volume to the
`~/.local/share/ws-server/extensions` directory.
When using a *named volume*, the initial content of `~/.local/share/ws-server/extensions`
from the deployed image is copied over to the volume.

::: warning NOTICE
It is important to note that by mounting a volume for the extensions directory, you
***opt-out*** of receiving future updates, installs, and changes to the prepackaged
extensions that come with the workspace.
:::

```sh{3,6}
# Optional: the volume name is explicitly defined
# below, so the following can be skipped
docker volume create my-extensions

docker run \
  -v my-extensions:/home/kloud/.local/share/ws-server/extensions \
  ghcr.io/kloudkit/workspace:v0.5.2
```

## Privately Hosted Gallery

If you own a marketplace that implements the VS Code Extension Gallery API, you can point
the workspace to it, either as a complete gallery or key by key:

- <EnvVar group="marketplace" name="gallery" />
- <EnvVar group="marketplace" name="service_url" />
- <EnvVar group="marketplace" name="item_url" />
- <EnvVar group="marketplace" name="extension_url_template" />
- <EnvVar group="marketplace" name="resource_url_template" />
- <EnvVar group="marketplace" name="control_url" />

For example:

```sh{2-3}
docker run \
  -e WS_MARKETPLACE_SERVICE_URL=https://my-extensions/api/gallery \
  -e WS_MARKETPLACE_ITEM_URL=https://my-extensions/api/item \
  ghcr.io/kloudkit/workspace:v0.5.2
```

::: warning
We strongly discourage you from setting this for the official VS Code Marketplace, since
it infringes on the [terms of use](https://aka.ms/vsmarketplace-ToU).
:::

## Prepackaged Extensions

The table below describes the preinstalled extensions *(some also have customized settings)*
and their respective license.

👏 Many thanks to the amazing developers of these extensions.

<!--@include: ../partials/extensions.md -->
