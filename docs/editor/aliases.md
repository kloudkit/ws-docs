---
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

For example, instead of typing `ls -l` every time, you can create an alias `ll` to
execute it.

::: tip
If you need to bypass an alias and run the original command, you can prefix it with `\`.
Using the example above, to use the original `ls` command, use `\ls`.
:::

## Pre-Configured Aliases

Kloud Workspace's shell environments come packed with automatically configured aliases.
These aliases are typically loaded from:

- **Oh My Zsh Plugins:** depending on the active *oh-my-zsh* plugins that defined using
    `WS_ZSH_PLUGINS` *(see [terminal documentation](/editor/terminal) for more details)*.
- **Kloud Workspace Configuration:** Scripts are defined within Kloud Workspace at
    `/usr/lib/ohmyzsh/custom`.

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
