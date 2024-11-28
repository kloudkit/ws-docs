# Settings

## Overview

VSCode stands out as an incredibly customizable editor, empowering developers to shape
their coding environment through personalized settings stored in a `settings.json` file.
These settings manifest at two levels:

- [*User settings*](#user-settings).
- [*Workspace settings*](#workspace-settings).

::: warning
The term [*workspace settings*](#workspace-settings) mentioned earlier specifically
pertains to VSCode's settings and should not be confused with *Kloud's Workspace*.

To avoid any potential confusion, this document will consistently use the term
*Kloud's Workspace* when referring to the workspace image.
:::

*Kloud's Workspace* comes pre-configured with sane configuration that cover a wide-range
of use-cases at the [*user settings*](#user-settings) level.
If you wish to modify the pre-configured settings or use your own, follow the
process of overriding the [*workspace settings*](#workspace-settings).
However, keep in mind, it may effect certain tools, as stated in the
[Important Notes](#important-notes) section below.
The process of overriding and appending can be managed within the
[*workspace*](#workspace-settings).

### User Settings

The user-specific settings, are located in the
`~/.local/share/code-server/User/settings.json` file.
As mentioned above, these settings should be considered a base-line of default to append
to, any desired changes should be handled at the *workspace* level.

::: warning NOTICE
It is important to note, that changes made to these settings will be reset the next
time the workspace container is launched.
By mounting a volume to the settings directory, you ***opt-out*** of receiving
future updates and configurations related to the editor that come with
*Kloud's Workspace*.
:::

### Workspace Settings

To add or override existing defaults create a `settings.json` in a `.vscode` directory
at the root of your project *(usually `/workspace/.vscode/settings.json`)*.

These settings will take precedence over the [*user settings*](#user-settings).

![settings.gif](/settings/settings.gif)

## Important Notes

- Exercise caution when modifying the `settings.json` file, as incorrect changes may
    impact the functionality of *Kloud's Workspace*.
- Some settings may require a window refresh before taking effect.
- Certain settings may come bundled with additional tool-based configurations that
    effect how the tool interacts with *Kloud's Workspace*.
- If you feel there should be additional pre-configured settings, feel free to open
    a [pull request](/contribute/).
