---
description: "Configure Kloud Workspace with environment variables, pass them from an env file, and read secrets from mounted files."
see:
  - name: Editor Settings
    link: /editor/settings
  - name: Secrets
    link: /settings/secrets
---

# Configuration

::: tip
For VS Code editor settings *(JSON-based)*, see [Editor Settings](/editor/settings).
:::

![Dotenv logo](/icons/dotenv.svg){.doc-image}

Kloud Workspace ships with sensible defaults, and nearly every setting can be overridden with an
environment variable.

Settings are environment variables.
Secrets can also come from mounted files, and drop-in directories under `~/.ws` add startup
scripts, certificates, extensions and [seed](/settings/seed) files.

## Set Variables

Pass variables to the container with `-e`:

```sh
docker run \
  -e WS_METRICS_ENABLE=true \
  -e TZ=Europe/London \
  ghcr.io/kloudkit/workspace:v0.6.0
```

To keep them in a file, write one `NAME=value` per line, such as this `workspace.env`:

```ini
WS_METRICS_ENABLE=true
TZ=Europe/London
```

Then pass the file with `--env-file`:

```sh
docker run --env-file workspace.env ghcr.io/kloudkit/workspace:v0.6.0
```

Docker skips lines that start with `#` and keeps quotes as part of the value, so leave values
unquoted.

::: tip `WS_<GROUP>` Prefix Convention
Variables that are consumed **solely** by Kloud Workspace start with `WS_<GROUP>_`
followed by the name *(example: `WS_ZSH_PLUGINS`)*.

A variable that an underlying tool also reads keeps that tool's original name.
Those are listed under [Global Variables](#global-variables).
:::

::: tip Boolean Values
To enable a boolean environment variable, set it to a *truthy* value, either `1` or `true`.
:::

## Resolving Secret Values

These variables hold secrets, so each one can also be read from a file, and the same setting works
across Docker and Kubernetes without `_FILE` companion variables:

- <EnvVar group="auth" name="password" />
- <EnvVar group="auth" name="password_hashed" />
- <EnvVar group="auth" name="github_token" />
- <EnvVar group="auth" name="oidc_client_secret" />
- <EnvVar group="auth" name="oidc_cookie_secret" />
- <EnvVar group="cloudflared" name="tunnel_token" />
- <EnvVar group="secrets" name="master_key" />
- <EnvVar group="server" name="ssl_cert" />
- <EnvVar group="server" name="ssl_key" />

Each value comes from the first of these that applies:

1. **Literal value:** `WS_X=value`.
2. **`file:` prefix:** `WS_X=file:/path` reads the file *(the editor trims surrounding whitespace;
   `ws-cli` strips one trailing newline)*.
3. **Mounted file:** mount a file at `/run/secrets/workspace/<group>/<property>` and leave
   the variable unset.
4. **Default:** typically unset.

::: code-group

```sh [Literal Value]
docker run \
  -e WS_AUTH_PASSWORD=super_duper_secret \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```sh [file: Prefix]
docker run \
  -e WS_AUTH_PASSWORD=file:/run/secrets/workspace/auth/password \
  -v ./password.txt:/run/secrets/workspace/auth/password:ro \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```yaml [Kubernetes]
volumes:
  - name: workspace-secrets
    secret:
      secretName: workspace-secrets
      items:
        - key: password
          path: auth/password
containers:
  - name: workspace
    volumeMounts:
      - name: workspace-secrets
        mountPath: /run/secrets/workspace
        readOnly: true
```

:::

::: tip
To see where a value came from, run `ws-cli show env` with its dotted key, such as
`ws-cli show env server.port` for `WS_SERVER_PORT`.
The source reads `process` *(the environment)*, `file` *(a `file:` path)*, `mount`
*(the `/run/secrets/workspace` convention)*, `alias` *(a deprecated name)* or `declared`
*(the default)*.
Set the matching `WS_*` variable, not the dotted key, to change it.
In an editor terminal, secrets passed as plain environment values are already removed, so they
show as unset.
:::

<!--@include: ../partials/environment-variables.md -->

## Deprecated

<!--@include: ../partials/deprecated-variables.md -->

## Global Variables

| ENV                   | Description                                                       | Read More |
| --------------------- | ----------------------------------------------------------------- | --------- |
| `EDITOR`              | Default terminal editor *(default: `code --wait --reuse-window`)* |           |
| `GIT_COMMITTER_NAME`  | Name to be used in `~/.gitconfig`                                 | [→][git]  |
| `GIT_COMMITTER_EMAIL` | Email to be used in `~/.gitconfig`                                | [→][git]  |
| `PAGER`               | Default terminal pager *(default: `less`)*                        |           |
| `TZ`                  | Define the timezone                                               |           |

[git]: /tools/git
