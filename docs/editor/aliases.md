---
description: "The shell aliases and functions Kloud Workspace ships for common commands, and how to add your own."
see:
  - name: Autoload Scripts
    link: /settings/autoload-scripts
  - name: Terminal
    link: /editor/terminal
---

# Aliases

The workspace shell comes with short names for common commands, and loads the aliases you add.
For example, `ll` runs `eza --long --all --classify`.

::: tip
To bypass an alias and run the original command, prefix it with `\`.
For example, `\ls` runs the original `ls` instead of `eza`.
:::

## Preinstalled Aliases

The aliases come from two sources:

- **Oh My Zsh plugins:** each active *oh-my-zsh* plugin, set with `WS_ZSH_PLUGINS`, adds its own
    aliases *(see the [terminal documentation](/editor/terminal))*.
- **Kloud Workspace configuration:** the scripts in `/usr/share/ohmyzsh/custom` define the aliases
    and functions below.

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

Add your own aliases to a `.zsh` file in `~/.ws/session.d/`:

```sh
echo "alias proj='cd /workspace/my-project'" >> ~/.ws/session.d/aliases.zsh
```

Every new terminal session loads these files after the workspace's own aliases, so your alias wins
over a preinstalled one with the same name.
See the [autoload documentation](/settings/autoload-scripts) for more details.

## Finding Aliases

To list every alias in the current session:

```sh
alias
```

To search them interactively, pipe the list through `fzf`:

```sh
alias | fzf
```
