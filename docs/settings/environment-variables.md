# Environment Variables

![Dotenv logo](/icons/dotenv.svg){.doc-image}

The *workspace* follows the *convention over configuration* principle, providing sensible
defaults.
However, nearly all settings can be customized or extended using environment variables.

This approach enhances flexibility, allowing default configurations to be overridden as
needed.

## `WS_` Prefix

Please note that environment variables used *solely* by the workspace a are prefixed with
`WS_`.
The only exception are environment variables that are identical to what the underlying tool uses.

For example, the `GIT_COMMITTER_NAME` variable does  not contain the `WS_` prefix, since it
is defined by the underlying tool *(`git` in this case)* and not the workspace.
However, `WS_ROOT` is only used by the workspace, therefore it contains the prefix.

## Variables

### Workspace Variables

| ENV                            | Description                                                     | Read More       |
| ------------------------------ | --------------------------------------------------------------- | --------------- |
| `WS_APT_DISABLE_DEBIAN_REPO`   | Disables the default Debian repository                          | [→][apt]        |
| `WS_APT_DISABLE_EXTRAS_REPO`   | Disables the additional extra *(3rd-party)* repository          | [→][apt]        |
| `WS_CLONE_WORKSPACE_REPO`      | Clone a repository to the workspace directory on startup        | [→][git]        |
| `WS_COMMENTS_DISABLE_FONT`     | Disable the custom comments font                                | [→][fonts]      |
| `WS_DISABLE_SUDO`              | Disable `sudo` privileges                                       |                 |
| `WS_CONFIGURE_DOCKER`          | Attempt to auto-configure docker                                | [→][docker]     |
| `WS_CONFIGURE_HELM`            | Autoload helm repository cache                                  | [→][helm]       |
| `WS_EXTRA_CA_CERT_ENDPOINTS`   | Extra CA endpoints to install at startup *(delimited by space)* | [→][ca]         |
| `WS_EXTRA_CA_CERT_INSECURE`    | Use insecure communication when installing CA endpoints         | [→][ca]         |
| `WS_EXTRA_FEATURES`            | Extra features to install at startup *(delimited by space)*     | [→][features]   |
| `WS_EXTRA_VS_EXTENSIONS`       | Extra extensions to install at startup *(delimited by space)*   | [→][extensions] |
| `WS_EXTRA_VS_EXTENSIONS_DIR`   | Directory of extensions to install at startup *(`*.vsix`)*      | [→][extensions] |
| `WS_PASSWORD`                  | Password for login authentication                               | [→][auth]       |
| `WS_PASSWORD_HASHED`           | Hashed *(`argon2`)* password for login authentication           | [→][auth]       |
| `WS_PORT`                      | Specify the server port *(default: `8080`)*                     |                 |
| `WS_PROXY_DOMAIN`              | Specify a domain name for proxying services' ports              | [→][ports]      |
| `WS_PROMPT_DISABLE_DOCKER`     | Disable the `docker` module of the terminal prompt              | [→][terminal]   |
| `WS_PROMPT_DISABLE_HOSTNAME`   | Disable the `hostname` module of the terminal prompt            | [→][terminal]   |
| `WS_PROMPT_DISABLE_KUBERNETES` | Disable the `kubernetes` module of the terminal prompt          | [→][terminal]   |
| `WS_PROMPT_DISABLE_NODEJS`     | Disable the `nodejs` module of the terminal prompt              | [→][terminal]   |
| `WS_PROMPT_DISABLE_PYTHON`     | Disable the `python` module of the terminal prompt              | [→][terminal]   |
| `WS_PROMPT_DISABLE_USER`       | Disable the user module of the terminal prompt                  | [→][terminal]   |
| `WS_ROOT`                      | Root directory for the workspace *(default: `/workspace`)*      |                 |
| `WS_ZSH_PLUGINS`               | Specifies the `zsh` plugins to be enabled in each session       | [→][terminal]   |
| `WS_ZSH_EXTRA_PLUGINS`         | Adds additional `zsh` plugins to the existing defaults          | [→][terminal]   |

### Tool Variables

| ENV                   | Description                                  | Read More |
| --------------------- | -------------------------------------------- | --------- |
| `EDITOR`              | Default terminal editor  *(default: `code`)* |           |
| `GIT_COMMITTER_NAME`  | Name to be used in `~/.gitconfig`            | [→][git]  |
| `GIT_COMMITTER_EMAIL` | Email to be used in `~/.gitconfig`           | [→][git]  |
| `PAGER`               | Default terminal pager *(default: `less`)*   |           |
| `TZ`                  | Define the timezone                          |           |

[auth]: /editor/authentication
[apt]: /tools/apt
[ca]: /settings/enterprise-ca
[docker]: /tools/docker
[extensions]: /editor/extensions
[helm]: /tools/helm
[fonts]: /editor/theme-and-fonts
[features]: /editor/features
[git]: /tools/git
[ports]: /editor/port-forwarding
[terminal]: /editor/terminal
