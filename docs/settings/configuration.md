# Configuration

![Dotenv logo](/icons/dotenv.svg){.doc-image}

**Kloud Workspace** follows the *convention over configuration* principle, shipping with
sensible defaults.

Nearly every setting can be overridden with environment variables, giving you maximum
flexibility.

All configuration is supplied **exclusively** through environment variables.
No JSON, YAML, or CLI flags required. This makes the workspace fully *stateless* and
cloud-friendly.

Nearly every individual setting can still be overridden, giving you maximum flexibility.

::: tip `WS_<GROUP>` Prefix Convention

Variables that are consumed **solely** by Kloud Workspace start with `WS_<GROUP>_`
followed by the name *(example: `WS_TERMINAL_ZSH_PLUGINS`)*.

When a variable is also consumed by an underlying tool, we keep its original name.
Such variables can be reviewed in the [global variables](#global-variables) section.
:::

<!--@include: ../partials/environment-variables.md -->

## Global Variables

| ENV                   | Description                                  | Read More |
| --------------------- | -------------------------------------------- | --------- |
| `EDITOR`              | Default terminal editor  *(default: `code`)* |           |
| `GIT_COMMITTER_NAME`  | Name to be used in `~/.gitconfig`            | [→][git]  |
| `GIT_COMMITTER_EMAIL` | Email to be used in `~/.gitconfig`           | [→][git]  |
| `PAGER`               | Default terminal pager *(default: `less`)*   |           |
| `TZ`                  | Define the timezone                          |           |

[git]: /tools/git
