# VS Extensions

## Official Marketplace

![VSCode logo](/icons/vscode.svg){.doc-image}

According to the VSCode Marketplace [Terms of Use](https://aka.ms/vsmarketplace-ToU), you
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

Recognizing your individual preferences for VSCode extensions, we provide two methods for
ensuring your workspace retains custom installed extensions across restarts.

::: tip
Kloud Workspace is always evolving.
To gain the most from all the new features and upgrades, we suggest using the
[`"Install at Boot"`](#install-at-boot) method.
:::

### Install at Boot

Upon startup, Kloud Workspace evaluates several environment variables to automate the
installation of additional *user-defined* VSCode extensions.
Both options below can be used in unison:

- **`WS_EDITOR_ADDITIONAL_VS_EXTENSIONS`:** One or more space-delimited extension names.
- **`WS_EDITOR_ADDITIONAL_VS_EXTENSIONS_DIR`:** Directory of extensions with as `*.vsix`.

::: code-group

```sh{2} [list]
docker run \
  -e WS_EDITOR_ADDITIONAL_VS_EXTENSIONS="dbaeumer.vscode-eslint esbenp.prettier-vscode" \
  ghcr.io/kloudkit/workspace:latest
```

```sh{2,3} [directory]
docker run \
  -e WS_EDITOR_ADDITIONAL_VS_EXTENSIONS_DIR=/additional-extensions \
  -v /path/to/my-additional-extensions:/additional-extensions \
  ghcr.io/kloudkit/workspace:latest
```

:::

### Persistent Extensions

You can take full control of the workspace extensions by using a persistent volume to the
`/extensions` directory.
When using a *named volume*, the initial content of `/extensions` from the deployed image
is copied over to the volume.

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
  -v my-extensions:/extensions \
  ghcr.io/kloudkit/workspace:latest
```

## Privately Hosted Gallery

If you own a marketplace that implements the VSCode Extension Gallery API, you can point
the workspace to it by setting `$EXTENSIONS_GALLERY`.
For example:

```sh{2}
docker run \
  -e EXTENSIONS_GALLERY='{"serviceUrl": "https://my-extensions/api"}' \
  ghcr.io/kloudkit/workspace:latest
```

::: warning
We strongly discourage you from setting this for the official VSCode Marketplace, since
it infringes on the [terms of use](https://aka.ms/vsmarketplace-ToU).
:::

## Prepackaged Extensions

The table below describes the preinstalled extensions *(some also have customized settings)*
and their respective license.

👏 Many thanks to the amazing developers of these extensions.

| Name                                                | License                   |
| --------------------------------------------------- | ------------------------- |
| **[Catppuccin.catppuccin-vsc][]**                   | MIT                       |
| **[charliermarsh.ruff][]**                          | MIT                       |
| **[DavidAnson.vscode-markdownlint][]**              | MIT                       |
| **[EditorConfig.EditorConfig][]**                   | MIT                       |
| **[exiasr.hadolint][]**                             | MIT                       |
| **[golang.go][]**                                   | MIT, Apache 2, BSD, Other |
| **[humao.rest-client][]**                           | MIT                       |
| **[ludwhe.vscode-uuid][]**                          | ISC                       |
| **[mikestead.dotenv][]**                            | MIT                       |
| **[ms-azuretools.vscode-docker][]**                 | MIT                       |
| **[ms-kubernetes-tools.vscode-kubernetes-tools][]** | Apache 2                  |
| **[ms-python.python][]**                            | MIT                       |
| **[ms-vscode.hexeditor][]**                         | MIT                       |
| **[PKief.material-icon-theme][]**                   | MIT                       |
| **[redhat.ansible][]**                              | MIT                       |
| **[redhat.vscode-xml][]**                           | EPL 2                     |
| **[redhat.vscode-yaml][]**                          | MIT                       |
| **[samuelcolvin.jinjahtml][]**                      | MIT                       |
| **[streetsidesoftware.code-spell-checker][]**       | GPL 3                     |
| **[tamasfe.even-better-toml][]**                    | MIT                       |
| **[timonwong.shellcheck][]**                        | MIT                       |
| **[wayou.vscode-todo-highlight][]**                 | MIT                       |
| **[yzhang.markdown-all-in-one][]**                  | MIT                       |

[Catppuccin.catppuccin-vsc]: https://marketplace.visualstudio.com/items/Catppuccin.catppuccin-vsc/license
[charliermarsh.ruff]: https://marketplace.visualstudio.com/items/charliermarsh.ruff/license
[DavidAnson.vscode-markdownlint]: https://marketplace.visualstudio.com/items/DavidAnson.vscode-markdownlint/license
[EditorConfig.EditorConfig]: https://marketplace.visualstudio.com/items/EditorConfig.EditorConfig/license
[exiasr.hadolint]: https://marketplace.visualstudio.com/items/exiasr.hadolint/license
[golang.go]: https://marketplace.visualstudio.com/items/golang.go/license
[humao.rest-client]: https://marketplace.visualstudio.com/items/humao.rest-client/license
[ludwhe.vscode-uuid]: https://marketplace.visualstudio.com/items/ludwhe.vscode-uuid/license
[mikestead.dotenv]: https://marketplace.visualstudio.com/items/mikestead.dotenv/license
[ms-azuretools.vscode-docker]: https://marketplace.visualstudio.com/items/ms-azuretools.vscode-docker/license
[ms-kubernetes-tools.vscode-kubernetes-tools]: https://marketplace.visualstudio.com/items/ms-kubernetes-tools.vscode-kubernetes-tools/license
[ms-python.python]: https://marketplace.visualstudio.com/items/ms-python.python/license
[ms-vscode.hexeditor]: https://marketplace.visualstudio.com/items/ms-vscode.hexeditor/license
[PKief.material-icon-theme]: https://marketplace.visualstudio.com/items/PKief.material-icon-theme/license
[redhat.ansible]: https://marketplace.visualstudio.com/items/redhat.ansible/license
[redhat.vscode-xml]: https://marketplace.visualstudio.com/items/redhat.vscode-xml/license
[redhat.vscode-yaml]: https://marketplace.visualstudio.com/items/redhat.vscode-yaml/license
[samuelcolvin.jinjahtml]: https://marketplace.visualstudio.com/items/samuelcolvin.jinjahtml/license
[streetsidesoftware.code-spell-checker]: https://marketplace.visualstudio.com/items/streetsidesoftware.code-spell-checker/license
[tamasfe.even-better-toml]: https://marketplace.visualstudio.com/items/tamasfe.even-better-toml/license
[timonwong.shellcheck]: https://marketplace.visualstudio.com/items/timonwong.shellcheck/license
[wayou.vscode-todo-highlight]: https://marketplace.visualstudio.com/items/wayou.vscode-todo-highlight/license
[yzhang.markdown-all-in-one]: https://marketplace.visualstudio.com/items/yzhang.markdown-all-in-one/license
