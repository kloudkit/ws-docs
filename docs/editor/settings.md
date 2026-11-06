---
description: "Change Kloud Workspace's VS Code settings for yourself, per project or when a container is created, apart from its environment variables."
see:
  - name: Configuration
    link: /settings/configuration
  - name: Theme & Fonts
    link: /editor/theme-and-fonts
---

# Editor Settings

The workspace's VS Code comes with default settings; change them for yourself, per project, or
when a container is first created.

::: tip
For environment variable configuration *(non-editor settings)*,
see [Configuration](/settings/configuration).
:::

## Where Settings Live

VS Code keeps its settings in `settings.json` files, at two levels:

- [*User settings*](#user-settings).
- [*Workspace settings*](#workspace-settings).

[Environment variables](#environment-variables) can write into the user settings when a
container is first created.

::: warning
*Workspace settings* is VS Code's term for a project's settings, not a reference to Kloud
Workspace.
This page always says Kloud Workspace when it means the workspace image.
:::

Kloud Workspace sets defaults for a wide range of use cases at the
[*user settings*](#user-settings) level.
To override them or add your own, use the [*workspace settings*](#workspace-settings).
This may affect certain tools, as the [Important Notes](#important-notes) below explain.

### User Settings

The user settings are in the `~/.local/share/ws-server/User/settings.json` file.
To open it in the editor, run `open-settings` in a terminal.
Treat these settings as a baseline of defaults to add to, and make your changes at the
*workspace* level.

::: warning
Changes made to these settings are lost when the workspace container is recreated.
By mounting a volume to the settings directory, you opt out of receiving future updates and
configurations related to the editor that come with Kloud Workspace.
:::

### Workspace Settings

To add to or override the defaults, create a `settings.json` in a `.vscode` directory
at the root of your project *(usually `/workspace/.vscode/settings.json`)*.
These settings take precedence over the [*user settings*](#user-settings).
Workspace settings cannot change application-wide or machine-wide settings such as
`update.mode`; set those in the user settings.

The animation below shows the settings tabs and the creation of the `.vscode` directory:

![Settings animation](/settings/settings.gif){.doc-image-shadow}

## Environment Variables

When a container is first created, Kloud Workspace can write VS Code settings from environment
variables into the user settings.
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

```sh{2} [Inline]
docker run \
  -e WS_EDITOR_SETTINGS_MERGE='{"editor.fontSize": 16, "[python]": {"editor.tabSize": 4}}' \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```sh{2,3} [File]
docker run \
  -e WS_EDITOR_SETTINGS_MERGE_FILE=/workspace/.settings-merge.json \
  -v /path/to/my-settings.json:/workspace/.settings-merge.json \
  ghcr.io/kloudkit/workspace:v0.6.0
```

:::

**Override** variables completely replace the user settings with your configuration:

::: warning
Override removes all of Kloud Workspace's default user settings, including the theme and fonts.

Use merge for partial updates.
:::

::: code-group

```sh{2} [Inline]
docker run \
  -e WS_EDITOR_SETTINGS_OVERRIDE='{"editor.fontSize": 16}' \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```sh{2,3} [File]
docker run \
  -e WS_EDITOR_SETTINGS_OVERRIDE_FILE=/workspace/.settings.json \
  -v /path/to/my-settings.json:/workspace/.settings.json \
  ghcr.io/kloudkit/workspace:v0.6.0
```

:::

### Precedence

Set only one of the four variables.
If several are set, only the first of `WS_EDITOR_SETTINGS_OVERRIDE`,
`WS_EDITOR_SETTINGS_OVERRIDE_FILE`, `WS_EDITOR_SETTINGS_MERGE` and
`WS_EDITOR_SETTINGS_MERGE_FILE` applies, and a warning is logged.

The result is written into the user settings once, when the container is first created.
[Workspace settings](#workspace-settings) *(`.vscode/settings.json`)* still take precedence
over it.

## Important Notes

- Take care when you modify a `settings.json` file, as incorrect changes may impact the
    functionality of Kloud Workspace.
- Some settings may require a window refresh before taking effect.
- Certain settings may come with additional tool-based configuration that affects how the
    tool interacts with Kloud Workspace.
- To propose more default settings, open a [pull request](/contribute/).
