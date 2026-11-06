---
description: "Claude Code comes pre-installed in Kloud Workspace as both a system-wide CLI and a VS Code extension, ready to use out of the box."
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

Every segment except the directory can be hidden with an environment variable *(see below)*.
To disable the statusline entirely, set `WS_CLAUDE_STATUSLINE_DISABLE` to `true`.

## Managed Settings

Kloud Workspace ships managed settings for Claude Code in
`/etc/claude-code/managed-settings.json`:

| Setting       | Value                                    |
| ------------- | ---------------------------------------- |
| **Deny**      | Reading `./.env`                         |
| **Telemetry** | Off *(`CLAUDE_CODE_ENABLE_TELEMETRY=0`)* |

::: info
Managed settings take precedence over your own `~/.claude/settings.json`.
The file is owned by `root` and is reset when the container is recreated.
:::

## Environment Variables

- <EnvVar group="claude" name="statusline_disable" />
- <EnvVar group="claude" name="statusline_hide_context_bar" />
- <EnvVar group="claude" name="statusline_hide_git" />
- <EnvVar group="claude" name="statusline_hide_lines_changed" />
- <EnvVar group="claude" name="statusline_hide_model" />
- <EnvVar group="claude" name="statusline_script" />
- <EnvVar group="claude" name="statusline_shell" />
