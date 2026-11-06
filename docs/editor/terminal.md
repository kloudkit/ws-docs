---
description: "The Kloud Workspace terminal: zsh with oh-my-zsh plugins, a Starship prompt, fzf history search and clipboard commands."
see:
  - name: Aliases
    link: /editor/aliases
  - name: Autoload Scripts
    link: /settings/autoload-scripts
  - name: Theme & Fonts
    link: /editor/theme-and-fonts
---

# Terminal

![Terminal logo](/icons/terminal.svg){.doc-image}

The terminal in Kloud Workspace runs `zsh` with *oh-my-zsh* plugins, a `starship` prompt, `fzf`
history search, and clipboard commands that reach your browser.

## ZSH and Plugins

The shell is `zsh`, enhanced by the [`oh-my-zsh`][oh-my-zsh] framework.
A fixed set of *oh-my-zsh plugins* is enabled by default: `1password`, `auto-venv`, `docker`,
`encode64`, `fzf-history`, `git`, `golang`, `helm`, `kubectl`, `npm`, `python`, `pip`,
`ssh-agent` and `zsh-autosuggestions`.

To modify the default set of plugins, set these variables:

- <EnvVar group="zsh" name="plugins" />
- <EnvVar group="zsh" name="additional_plugins" />

::: code-group

```sh{2} [Override]
docker run \
  -e WS_ZSH_PLUGINS="kubectl npm python pip" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```sh{2} [Append]
docker run \
  -e WS_ZSH_ADDITIONAL_PLUGINS="laravel" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

:::

::: warning
`WS_ZSH_PLUGINS` replaces the whole default set, including `fzf-history` *(the
<kbd>Ctrl</kbd>+<kbd>R</kbd> search below)* and `zsh-autosuggestions`.
List every plugin you want to keep, or use `WS_ZSH_ADDITIONAL_PLUGINS` instead.
A name that is not an *oh-my-zsh* plugin is skipped without an error.
:::

## Prompt

The terminal prompt is powered by [`starship`][starship] and matches the workspace's
[color theme](/editor/theme-and-fonts).
Modules are shown based on the specific context of the prompt.
For instance, the Python module appears in a Python project, or while a virtual environment
is active.

![Prompt](/editor/terminal/prompt.gif){.doc-image-shadow}

To hide a prompt module, set its variable to either `1` or `true`:

- <EnvVar group="terminal" name="prompt_hide_docker_context" />
- <EnvVar group="terminal" name="prompt_hide_hostname" />
- <EnvVar group="terminal" name="prompt_hide_kubernetes_context" />
- <EnvVar group="terminal" name="prompt_hide_nodejs_version" />
- <EnvVar group="terminal" name="prompt_hide_python_version" />
- <EnvVar group="terminal" name="prompt_hide_user" />

For example, to hide the Docker and Python modules, add the following lines to your deployment:

```sh{2,3}
docker run \
  -e WS_TERMINAL_PROMPT_HIDE_DOCKER_CONTEXT=1 \
  -e WS_TERMINAL_PROMPT_HIDE_PYTHON_VERSION=1 \
  ghcr.io/kloudkit/workspace:v0.6.0
```

## History Search

Press <kbd>Ctrl</kbd>+<kbd>R</kbd> to search your shell history with [`fzf`][fzf] *(exact
substring matches by default)*.

By default, duplicate entries are removed and event numbers are hidden.
The following environment variables customize the behavior:

- <EnvVar group="zsh" name="fzf_history_bind" />
- <EnvVar group="zsh" name="fzf_history_args" />
- <EnvVar group="zsh" name="fzf_history_extra_args" />
- <EnvVar group="zsh" name="fzf_history_remove_duplicates" />
- <EnvVar group="zsh" name="fzf_history_dates_in_search" />
- <EnvVar group="zsh" name="fzf_history_event_numbers" />
- <EnvVar group="zsh" name="fzf_history_end_of_line" />
- <EnvVar group="zsh" name="fzf_history_query_prefix" />

## Clipboard

The workspace provides clipboard commands that connect the terminal to your browser's clipboard.

### Available Commands

- **`pbcopy`**
- **`pbpaste`**
- **`xclip`**
- **`xsel`**
- **`ws-cli clip copy`**
- **`ws-cli clip paste`**

```sh
# Copy to clipboard
echo "Hello World" | pbcopy
cat file.txt | xclip -sel c
echo "data" | xsel -b

# Paste from clipboard
pbpaste
xclip -o -sel c
xsel -b -o

# Use in pipelines
pbpaste | grep "pattern"
xclip -o | jq .
```

::: info
All clipboard commands communicate with the editor running in your browser, which connects the
terminal to your native clipboard.

All X11 selections *(primary, secondary, clipboard)* map to the same browser clipboard.
:::

## Colorful Output

Many CLI tools color their output by default, in the workspace's
[color theme](/editor/theme-and-fonts), for easier reading.

![Ls animation](/editor/terminal/ls.gif){.doc-image-shadow}

![Ip animation](/editor/terminal/ip-a.gif){.doc-image-shadow}

![Tree animation](/editor/terminal/tree.gif){.doc-image-shadow}

![Cat animation](/editor/terminal/cat.gif){.doc-image-shadow}

::: tip Clickable File Paths
Paths printed as `file://` URIs are clickable and open the file in the editor.
Because the workspace runs remotely, they resolve against the remote filesystem, so they work in
the browser instead of pointing at your local machine.
:::

[fzf]: https://github.com/junegunn/fzf
[oh-my-zsh]: https://ohmyz.sh
[starship]: https://starship.rs
