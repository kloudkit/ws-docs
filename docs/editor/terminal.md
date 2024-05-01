---
see:
  - name: Theme and fonts
    link: /editor/theme-and-fonts
---

# Terminal

The *workspace*'s terminal experience isn't just about getting things done, but about
embarking on an exquisite journey through the digital expanse, where beauty and
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

![Prompt](/prompt.png)

Some users find the descriptive prompt to be too noisy.
To *opt-out* of some of the prompt modules, you can set any of the following environment
`env` variables to a *truthy* value *(either `1` or `true`)*:

- **`WS_PROMPT_DISABLE_DOCKER`:** Disable the `docker` module of the terminal prompt.
- **`WS_PROMPT_DISABLE_HOSTNAME`:** Disable the `hostname` module of the terminal prompt.
- **`WS_PROMPT_DISABLE_KUBERNETES`:** Disable the `kubernetes` module of the terminal prompt.
- **`WS_PROMPT_DISABLE_NODEJS`:** Disable the `nodejs` module of the terminal prompt.
- **`WS_PROMPT_DISABLE_PYTHON`:** Disable the `python` module of the terminal prompt.
- **`WS_PROMPT_DISABLE_USER`:** Disable the user module of the terminal prompt.

For example, to disable the Docker and Python modules, you could add the following lines
to your deployment:

```sh{2,3}
docker run \
  -e WS_PROMPT_DISABLE_DOCKER=1 \
  -e WS_PROMPT_DISABLE_PYTHON=1 \
  ghcr.io/kloudkit/workspace:latest
```

### Colorful Output

Many CLI tools feature colorization by default
*(matching the [color theme](/editor/theme-and-fonts))*, enhancing your experience with
improved readability.

![Colorful Output](/colorful-output.png)
![Colorful Output 2](/colorful-output-2.png)

### ZSH

The standard shell utilized is `zsh`, enhanced by the [`oh-my-zsh`][oh-my-zsh] framework.
Tools and programming languages within the *workspace* that have corresponding
*oh-my-zsh plugins* are automatically activated for each shell session.

To modify the default set of plugins, adjust the `env` variables listed below:

- **`WS_ZSH_PLUGINS`:** Specifies the `zsh` plugins to be enabled in each session.
- **`WS_ZSH_EXTRA_PLUGINS`:** Adds additional `zsh` plugins to the existing defaults.

::: code-group

```sh{2} [Override]
docker run \
  -e WS_ZSH_PLUGINS="kubectl npm python pip" \
  ghcr.io/kloudkit/workspace:latest
```

```sh{2} [Append]
docker run \
  -e WS_ZSH_EXTRA_PLUGINS="php" \
  ghcr.io/kloudkit/workspace:latest
```

:::

## Licenses

The table below describes the pre-configured shell components
*(some also have customized settings)* and their respective license.

👏 Many thanks to the amazing developers of these components.

| Name                                 | License       |
| ------------------------------------ | ------------- |
| **[bat][]**                          | Apache 2, MIT |
| **[eza][]**                          | MIT           |
| **[fzf][]**                          | MIT           |
| **[oh-my-zsh][]**                    | MIT           |
| **[starship][]**                     | ISC           |
| **[zsh-autosuggestions][]**          | MIT           |
| **[zsh/fzf History Search][search]** | MIT           |

[bat]: https://github.com/sharkdp/bat
[eza]: https://github.com/eza-community/eza
[fzf]: https://github.com/junegunn/fzf
[oh-my-zsh]: https://ohmyz.sh
[search]: https://github.com/joshskidmore/zsh-fzf-history-search
[starship]: https://starship.rs
[zsh-autosuggestions]: https://github.com/zsh-users/zsh-autosuggestions
