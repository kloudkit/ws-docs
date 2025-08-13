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
  ghcr.io/kloudkit/workspace:latest
```

### Colorful Output

Many CLI tools feature colorization by default
*(matching the [color theme](/editor/theme-and-fonts))*, enhancing your experience with
improved readability.

![Ls animation](/editor/terminal/ls.gif){.doc-image-shadow}

![Ip animation](/editor/terminal/ip-a.gif){.doc-image-shadow}

![Tree animation](/editor/terminal/tree.gif){.doc-image-shadow}

![Cat animation](/editor/terminal/cat.gif){.doc-image-shadow}

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
  ghcr.io/kloudkit/workspace:latest
```

```sh{2} [Append]
docker run \
  -e WS_ZSH_ADDITIONAL_PLUGINS="php" \
  ghcr.io/kloudkit/workspace:latest
```

:::

[oh-my-zsh]: https://ohmyz.sh
[starship]: https://starship.rs
