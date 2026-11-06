---
description: "Run your own scripts when a new Kloud Workspace container starts, and load your own functions and aliases in every shell session."
see:
  - name: Terminal
    link: /editor/terminal
  - name: Aliases
    link: /editor/aliases
  - name: Seed
    link: /settings/seed
  - name: ws-cli
    link: /tools/ws-cli
  - name: TLS & Certificates
    link: /settings/tls
---

# Autoload Scripts

Run your own installation and configuration steps when a new container starts, and load your own
functions and aliases in every shell session.

- **Startup scripts:** run once, when a new container starts, [read more](#startup-scripts).
- **Session scripts:** sourced by every new shell session, [read more](#session-scripts).

::: tip
Before you write a script, check whether a built-in [configuration template](/tools/ws-cli#ws-cli-template)
or an [installable feature](/editor/features) already covers it.
:::

## Startup Scripts

Save a script as `startup.d/01-git.sh`:

```bash
#!/usr/bin/env bash

ws-cli log info "Configuring Git"

git config --global pull.rebase true
```

Make it executable and mount the folder at `~/.ws/startup.d/` *(i.e. `/home/kloud/.ws/startup.d`)*:

```sh
chmod +x startup.d/01-git.sh

docker run \
  -v ./startup.d:/home/kloud/.ws/startup.d \
  ghcr.io/kloudkit/workspace:v0.6.0
```

`ws-cli log` writes the message in the same format as the built-in startup scripts.
If `~/.ws` is on a volume, a script you save in `~/.ws/startup.d/` from a workspace terminal runs in
the next new container.
The directories are created automatically on startup.

### When They Run

Startup scripts run once, when a new container starts; restarting the container does not run them
again.
They run after the built-in startup scripts in `/usr/libexec/workspace/startup.d/`, which are
executed in lexicographical order to initialize the workspace environment.
With `WS_AUTH_DISABLE_SUDO` set, `sudo` is already disabled when your scripts run.

Your scripts are executed as follows:

- Only scripts with an executable file permission *(i.e. `+x`)* are considered.
- Executed in sorted order of their full path, files in subdirectories included.
  The sort ignores punctuation, so `10-a` runs before `1-b`; use zero-padded prefixes such as `01-`.
- Symbolic links are skipped.
- Scripts are executed as the `kloud` user.

### When a Script Fails

A script that exits with a non-zero status is logged as
`Autoloading [<script>] failed with status [<code>]`, and startup continues with the next script.

To stop instead, set:

- <EnvVar group="startup" name="fail_on_error" />

The first of your scripts that fails then stops the container, and the scripts after it do not run.

### Where the Output Goes

Everything a script prints, on `stdout` and `stderr`, goes to the container log *(`docker logs`)*
and to `/var/log/workspace/workspace.log`.
Read it from a workspace terminal with:

```sh
ws-cli logs
```

### Available Languages

Write your scripts in any language installed in the workspace, chosen with the shebang.
By default, the workspace supports the following languages:

- **Ansible:** `#!/usr/bin/env -S ansible-playbook`
- **Bash:** `#!/usr/bin/env bash`
- **Go:** `//usr/bin/env go run $0 $@; exit $?` *(name the file `*.go`)*
- **Node.js:** `#!/usr/bin/env node`
- **POSIX:** `#!/bin/sh`
- **Python:** `#!/usr/bin/env python`
- **zsh:** `#!/usr/bin/env zsh`

Scripts without a shebang run under `bash`.

### Environment

Startup scripts run through `zsh`, so every script, whatever its language, inherits the exports
from `/etc/zsh/zshenv` and from `~/.zshenv`.
This includes the [custom CA](/settings/tls) variables, secrets imported from 1Password, and
any `export` that an earlier script appended to `~/.zshenv`.
When 1Password secrets are imported, `~/.zshenv` is left read-only; run `chmod u+w ~/.zshenv`
before you append to it.

## Session Scripts

Every new shell session sources the predefined `/usr/share/ohmyzsh/custom/*.zsh` files in
lexicographical order, then your `.zsh` files in `~/.ws/session.d/`
*(i.e. `/home/kloud/.ws/session.d`)*.
Save an alias in `~/.ws/session.d/aliases.zsh`, and every new terminal has it:

```sh
alias gs="git status"
```

The directories are created automatically on startup.

Session scripts are loaded as follows:

- Both executable and non-executable scripts are considered.
- Only `.zsh` files are considered.
- Executed in lexicographical order.
- Scripts are executed as the `kloud` user.
- Scripts are executed using `source`, so any functions, `alias`es or `export`s are available in
  the current session.
