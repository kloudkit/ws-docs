---
see:
  - name: terminal
    link: /editor/terminal
  - name: ws-cli
    link: /tools/ws-cli
---

# Autoload Scripts

While we try to take care of most installations and configurations out of the box, we
understand that there are instances where users prefer to personalize their setup with
additional installation and configurations.
Therefore, in addition to the predefined entrypoint scripts, we offer the ability to add
users defined entrypoint scripts to tailor the workspace experience.

::: info TIP
Before creating additional entrypoint scripts, ensure that the objective you intend to
achieve is not already addressed by built-in **[extendable configuration][]**.
:::

Startup scripts are defined at two levels:

- **Entrypoint:** loaded once during the initial startup process, [read more](#entrypoint).
- **Session:** loaded for every new shell session, [read more](#session).

## Entrypoint

On startup, the predefined entrypoint scripts stored in `/autoload/*` are executed in
lexicographical order to initialize the workspace environment.

To add additional functionality during startup, mount your scripts to `/entrypoint/*`.
These scripts are executed as follows:

- Only scripts with an executable file permission *(i.e. `+x`)* are considered.
- Executed in lexicographical order.
- Scripts are executed as the `kloud` user.

```sh{2}
docker run \
  -v /my-entrypoint-scripts:/entrypoint \
  ghcr.io/kloudkit/workspace
```

### Available Languages

Feel free to write you entrypoint scripts in the language of your choice, considering it
is installed in the workspace.

By default, the workspace supports the following languages *(defined using shebangs)*:

- **Ansible:** `#!/usr/bin/env -S ansible-playbook`
- **Bash:** `#!/usr/bin/env bash`
- **Golang:** `//usr/bin/env go run $0 $@; exit $?`
- **NodeJS:** `#!/usr/bin/env node`
- **POSIX:** `#!/bin/sh`
- **Python:** `#!/usr/bin/env python`
- **zsh:** `#!/usr/bin/env zsh`

### Helper Functions

You are welcome to utilize the `log` command of `ws-cli` to generate messages that align
with the format of our logging system.
Refer to the specific [documentation for `ws-cli`](/tools/ws-cli) for more details.

## Session

Similar to entrypoint scripts, the workspace will load startup scripts for every new shell
session.
On shell startup, the predefined scripts stored in `/usr/lib/ohmyzsh/custom/*` are executed in
lexicographical order.

To add additional functionality during startup, mount your scripts to `~/.session/*.zsh`.
These scripts are executed as follows:

- Both executable and not executable scripts are considered.
- Only `.zsh` are considered.
- Executed in lexicographical order.
- Scripts are executed as the `kloud` user.
- Scripts are executed using `source`, therefore any functions, `alias`s or `export`s will
    be available during the current session.

[extendable configuration]: /pages/extendable-configuration
