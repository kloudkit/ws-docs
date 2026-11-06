---
description: "Built-in shell aliases in Kloud Workspace that shorten long, common commands into convenient keywords, plus how to define your own."
see:
  - name: Autoload Scripts
    link: /settings/autoload-scripts
  - name: Terminal
    link: /editor/terminal
---

# Aliases

Shell aliases are shortcuts that represent long or complex commands in a more convenient
and concise form.
By defining an alias, you can replace a commonly used command with a simple keyword or
abbreviation.
This helps to speed up your workflow, reduce typing, and minimize errors by using
predefined command patterns.

For example, `ll` runs `eza --long --all --classify`.

::: tip
To bypass an alias and run the original command, prefix it with `\`.
For example, `\ls` runs the original `ls` instead of `eza`.
:::

## Pre-Configured Aliases

Kloud Workspace's shell environments come packed with automatically configured aliases.
These aliases are typically loaded from:

- **Oh My Zsh Plugins:** depending on the active *oh-my-zsh* plugins that defined using
    `WS_ZSH_PLUGINS` *(see [terminal documentation](/editor/terminal) for more details)*.
- **Kloud Workspace Configuration:** Scripts are defined within Kloud Workspace at
    `/usr/share/ohmyzsh/custom`.

### Workspace Aliases

| Alias           | Runs                                                           |
| --------------- | -------------------------------------------------------------- |
| `art`           | `php artisan`                                                  |
| `cat`           | `bat`                                                          |
| `cspell`        | `cspell --config=/etc/cspell/config.yaml`                      |
| `diff`          | `diff --side-by-side --suppress-common-lines --color=auto`     |
| `ip`            | `ip -c`                                                        |
| `l`             | `eza --long --all`                                             |
| `ld`            | `eza -lD` *(directories only)*                                 |
| `lf`            | `eza -lF` *(files only)*                                       |
| `lh`            | `eza -dl .* --group-directories-first` *(hidden entries only)* |
| `ll`            | `eza --long --all --classify`                                  |
| `ls`            | `eza --color=always`                                           |
| `lsi`           | `eza --icons`                                                  |
| `lt`            | `eza -al --sort=modified`                                      |
| `open-settings` | Opens your user `settings.json` in the editor                  |
| `pnpx`          | `pnpm dlx` *(shows its help with no arguments)*                |
| `tree`          | `eza --tree`                                                   |

The *oh-my-zsh* `la` and `lsa` aliases are removed.

### Shell Functions

| Function         | Does                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| `ws`             | With no arguments, changes to the workspace root; otherwise runs `ws-cli` |
| `open <file>`    | Opens a file in the editor                                                |
| `help <command>` | Shows a command's help, highlighted                                       |

## User-Defined Aliases

You can define your aliases by editing the session configuration files.
See the [autoload documentation](/settings/autoload-scripts) for more details.

These aliases will be available whenever you start a new session, making it easier to
access commonly used commands.

## Finding Aliases

If you're unsure which aliases are available or want to find specific aliases, you can use
the following command to list them all:

```sh
alias
```

You can also pipe the output through `fzf`  to interactively search for specific aliases:

```sh
alias | fzf
```
