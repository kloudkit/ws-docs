# Settings

## Overview

VSCode stands out as an incredibly customizable editor, empowering developers to shape
their coding environment through personalized settings stored in a `settings.json` file.
These settings manifest at two levels:

- [*User settings*](#user-settings).
- [*Workspace settings*](#workspace-settings).
- [*Environment variable settings*](#environment-variables).

::: warning
The term [*workspace settings*](#workspace-settings) mentioned earlier specifically
pertains to VSCode's settings and should not be confused with Kloud Workspace.

To avoid any potential confusion, this document will consistently use the term
Kloud Workspace when referring to the workspace image.
:::

**Kloud Workspace** comes pre-configured with sane configuration that cover a wide-range
of use-cases at the [*user settings*](#user-settings) level.
If you wish to modify the pre-configured settings or use your own, follow the
process of overriding the [*workspace settings*](#workspace-settings).
However, keep in mind, it may effect certain tools, as stated in the
[Important Notes](#important-notes) section below.
The process of overriding and appending can be managed within the
[*workspace*](#workspace-settings).

### User Settings

The user-specific settings, are located in the `~/.local/share/workspace/User/settings.json` file.
As mentioned above, these settings should be considered a base-line of default to append
to, any desired changes should be handled at the *workspace* level.

::: warning NOTICE
It is important to note, that changes made to these settings will be reset the next
time the workspace container is launched.
By mounting a volume to the settings directory, you ***opt-out*** of receiving
future updates and configurations related to the editor that come with
Kloud Workspace.
:::

### Workspace Settings

To add or override existing defaults create a `settings.json` in a `.vscode` directory
at the root of your project *(usually `/workspace/.vscode/settings.json`)*.
These settings will take precedence over the [*user settings*](#user-settings).

The animation below displays the various tabs and the creation of the `.vscode` directory:

![Settings animation](/settings/settings.gif){.doc-image-shadow}

## Environment Variables

Workspace supports customizing VSCode settings at boot time via environment variables.
This is useful for applying consistent settings without committing a `.vscode/settings.json`
file.

### Available Variables

- <EnvVar group="editor" name="settings_merge" />
- <EnvVar group="editor" name="settings_merge_file" />
- <EnvVar group="editor" name="settings_override" />
- <EnvVar group="editor" name="settings_override_file" />

### Merge vs Override

**Merge** variables deep-merge your settings into the existing user settings,
preserving any defaults not explicitly specified:

::: code-group

```sh{2} [inline]
docker run \
  -e WS_EDITOR_SETTINGS_MERGE='{"editor.fontSize": 16, "[python]": {"editor.tabSize": 4}}' \
  ghcr.io/kloudkit/workspace:v0.1.2
```

```sh{2,3} [file]
docker run \
  -e WS_EDITOR_SETTINGS_MERGE_FILE=/workspace/.settings-merge.json \
  -v /path/to/my-settings.json:/workspace/.settings-merge.json \
  ghcr.io/kloudkit/workspace:v0.1.2
```

:::

**Override** variables completely replace the user settings with your configuration:

::: warning
Using override removes all default workspace settings.

*Use merge for partial updates.*
:::

::: code-group

```sh{2} [inline]
docker run \
  -e WS_EDITOR_SETTINGS_OVERRIDE='{"editor.fontSize": 16}' \
  ghcr.io/kloudkit/workspace:v0.1.2
```

```sh{2,3} [file]
docker run \
  -e WS_EDITOR_SETTINGS_OVERRIDE_FILE=/workspace/.settings.json \
  -v /path/to/my-settings.json:/workspace/.settings.json \
  ghcr.io/kloudkit/workspace:v0.1.2
```

:::

### Precedence

When multiple settings sources are present, they are applied in the following order
*(later sources take precedence)*:

1. Default user settings
2. `WS_EDITOR_SETTINGS_MERGE` / `WS_EDITOR_SETTINGS_MERGE_FILE`
3. `WS_EDITOR_SETTINGS_OVERRIDE` / `WS_EDITOR_SETTINGS_OVERRIDE_FILE`
4. [Workspace settings](#workspace-settings) *(`.vscode/settings.json`)*

## Important Notes

- Exercise caution when modifying the `settings.json` file, as incorrect changes may
    impact the functionality of Kloud Workspace.
- Some settings may require a window refresh before taking effect.
- Certain settings may come bundled with additional tool-based configurations that
    effect how the tool interacts with Kloud Workspace.
- If you feel there should be additional pre-configured settings, feel free to open
    a [pull request](/contribute/).
