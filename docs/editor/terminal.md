---
see:
  - name: Theme and fonts
    link: /editor/theme-and-fonts
---

# Terminal

![Terminal logo](/icons/terminal.svg){.doc-image}

The terminal experience in Kloud Workspace isn't just about getting things done, but
about embarking on an exquisite journey through the digital expanse, where beauty and
functionality align like the stars in the sky.

Our terminal operates on the `zsh` shell, meticulously tailored for a seamless and
enjoyable experience.

## Components

### Prompt

The terminal prompt is powered by [`starship`][starship] and blends perfectly with our
[color theme](/editor/theme-and-fonts).
Modules are shown based on the specific context of the prompt.
For instance, the Python module appears only when your current working directory includes
a Python-based project.

![Prompt](/editor/terminal/prompt.gif){.doc-image-shadow}

Some users find the descriptive prompt to be too noisy.
To *opt-out* of some of the prompt modules, you can set any of the following environment variables
to either `1` or `true`:

- <EnvVar group="terminal" name="prompt_hide_docker_context" />
- <EnvVar group="terminal" name="prompt_hide_hostname" />
- <EnvVar group="terminal" name="prompt_hide_kubernetes_context" />
- <EnvVar group="terminal" name="prompt_hide_nodejs_version" />
- <EnvVar group="terminal" name="prompt_hide_python_version" />
- <EnvVar group="terminal" name="prompt_hide_user" />

For example, to disable the Docker and Python modules, you could add the following lines
to your deployment:

```sh{2,3}
docker run \
  -e WS_TERMINAL_PROMPT_HIDE_DOCKER_CONTEXT=1 \
  -e WS_TERMINAL_PROMPT_HIDE_PYTHON_VERSION=1 \
  ghcr.io/kloudkit/workspace:v0.1.2
```

### Colorful Output

Many CLI tools feature colorization by default
*(matching the [color theme](/editor/theme-and-fonts))*, enhancing your experience with
improved readability.

![Ls animation](/editor/terminal/ls.gif){.doc-image-shadow}

![Ip animation](/editor/terminal/ip-a.gif){.doc-image-shadow}

![Tree animation](/editor/terminal/tree.gif){.doc-image-shadow}

![Cat animation](/editor/terminal/cat.gif){.doc-image-shadow}

### Clipboard

The workspace provides clipboard utilities that bridge the terminal with the browser's
clipboard.

#### Available Commands

- **`pbcopy`**
- **`pbpaste`**
- **`xclip`**
- **`xsel`**
- **`ws clip paste`**

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
All clipboard commands communicate with the VSCode extension running in your browser,
bridging the terminal environment with your native clipboard.

All X11 selections *(primary, secondary, clipboard)* map to the same browser clipboard.
:::

### ZSH

The standard shell utilized is `zsh`, enhanced by the [`oh-my-zsh`][oh-my-zsh] framework.
Tools and programming languages within the *workspace* that have corresponding
*oh-my-zsh plugins* are automatically activated for each shell session.

To modify the default set of plugins, adjust the `env` variables listed below:

- <EnvVar group="zsh" name="plugins" />
- <EnvVar group="zsh" name="additional_plugins" />

::: code-group

```sh{2} [Override]
docker run \
  -e WS_ZSH_PLUGINS="kubectl npm python pip" \
  ghcr.io/kloudkit/workspace:v0.1.2
```

```sh{2} [Append]
docker run \
  -e WS_ZSH_ADDITIONAL_PLUGINS="php" \
  ghcr.io/kloudkit/workspace:v0.1.2
```

:::

### History Search

The workspace includes an interactive history search powered by [`fzf`][fzf].
Press <kbd>Ctrl</kbd>+<kbd>R</kbd> to open a fuzzy finder over your shell history.

By default, duplicate entries are removed and event numbers are hidden for a
clean, distraction-free list. The following environment variables let you
customize the behavior:

- <EnvVar group="zsh" name="fzf_history_bind" />
- <EnvVar group="zsh" name="fzf_history_args" />
- <EnvVar group="zsh" name="fzf_history_extra_args" />
- <EnvVar group="zsh" name="fzf_history_remove_duplicates" />
- <EnvVar group="zsh" name="fzf_history_dates_in_search" />
- <EnvVar group="zsh" name="fzf_history_event_numbers" />
- <EnvVar group="zsh" name="fzf_history_end_of_line" />
- <EnvVar group="zsh" name="fzf_history_query_prefix" />

[fzf]: https://github.com/junegunn/fzf
[oh-my-zsh]: https://ohmyz.sh
[starship]: https://starship.rs
