---
see:
  - name: Extensions
    link: /editor/extensions
  - name: Configuration
    link: /settings/configuration
---

# Claude Code

![Claude Code logo](/icons/claude.svg){.doc-image}

Claude Code is pre-installed in Kloud Workspace as both a CLI tool and a VS Code
extension, ready to use out of the box.

- CLI available system-wide.
- VS Code extension pre-installed.
- Powerline-style statusline with the same [terminal theming](/editor/theme-and-fonts).
- Managed default settings with security-conscious permissions.

## CLI

The `claude` binary is available globally and works independently of VS Code in any
terminal session.

```sh
claude --version
```

## Statusline

A custom Powerline-style bar is rendered vi whenever Claude Code is active in the
terminal.
It uses the **Catppuccin Frappe** color palette to match the workspace theme.

The statusline displays the following segments:

- **Directory:** git-aware path with repository name and truncated subdirectories.
- **Git branch & status:** current branch, staging state, and ahead/behind tracking.
- **Lines changed:** additions and deletions in the current session.
- **Model name:** the active Claude model.
- **Context window usage:** a visual progress bar showing how much of the context window
  is consumed.

Each segment can be individually hidden via environment variables *(see below)*.
To disable the statusline entirely, set `WS_CLAUDE_STATUSLINE_DISABLE` to `true`.

## Managed Settings

Kloud Workspace ships with managed settings that configure sensible defaults for
Claude Code.

The default permission rules:

| Action    | Targets                                    |
| --------- | ------------------------------------------ |
| **Allow** | Reading `.env.sample` and `.env.example`   |
| **Deny**  | Reading `.env`, `.env.*`, and `secrets/**` |
| **Ask**   | `curl` commands via Bash                   |

::: info
These rules protect sensitive files while still allowing Claude Code to read common
example environment files. Override them by editing the managed settings file directly.
:::

## Environment Variables

- <EnvVar group="claude" name="statusline_disable" />
- <EnvVar group="claude" name="statusline_hide_context_bar" />
- <EnvVar group="claude" name="statusline_hide_git" />
- <EnvVar group="claude" name="statusline_hide_lines_changed" />
- <EnvVar group="claude" name="statusline_hide_model" />
- <EnvVar group="claude" name="statusline_script" />
- <EnvVar group="claude" name="statusline_shell" />
