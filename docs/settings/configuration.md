---
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

**Kloud Workspace** follows the *convention over configuration* principle, shipping with
sensible defaults.

Nearly every setting can be overridden with environment variables, giving you maximum
flexibility.

All configuration is supplied **exclusively** through environment variables.
No JSON, YAML, or CLI flags required. This makes the workspace fully *stateless* and
cloud-friendly.

::: tip `WS_<GROUP>` Prefix Convention
Variables that are consumed **solely** by Kloud Workspace start with `WS_<GROUP>_`
followed by the name *(example: `WS_ZSH_PLUGINS`)*.

When a variable is also consumed by an underlying tool, we keep its original name.
Such variables can be reviewed in the [global variables](#global-variables) section.
:::

::: tip Boolean Values
To enable a boolean environment variable, set it to a *truthy* value, either `1` or `true`.
:::

## Resolving Secret Values

Secret-shaped variables resolve through a four-step chain so the same property works across
Docker and Kubernetes without `_FILE` companions:

- <EnvVar group="auth" name="password" />
- <EnvVar group="auth" name="password_hashed" />
- <EnvVar group="auth" name="github_token" />
- <EnvVar group="secrets" name="master_key" />
- <EnvVar group="server" name="ssl_cert" />
- <EnvVar group="server" name="ssl_key" />

The resolver returns the first match:

1. **Env literal:** `WS_X=value`.
2. **`file:` prefix:** `WS_X=file:/path` reads the file *(one trailing newline stripped, internal newlines preserved)*.
3. **Convention default:** mount a file at `/run/secrets/workspace/<group>/<property>` and leave
   the variable unset.
4. **Schema default:** typically unset.

::: code-group

```sh [Env literal]
docker run \
  -e WS_AUTH_PASSWORD=super_duper_secret \
  ghcr.io/kloudkit/workspace:v0.2.1
```

```sh [file: prefix]
docker run \
  -e WS_AUTH_PASSWORD=file:/run/secrets/workspace/auth/password \
  -v ./password.txt:/run/secrets/workspace/auth/password:ro \
  ghcr.io/kloudkit/workspace:v0.2.1
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
`ws-cli show env <KEY>` reports where the value came from: `env-set`, `env-file`,
`secret-file-default`, or `yaml-default`.
:::

<!--@include: ../partials/environment-variables.md -->

## Deprecated

<!--@include: ../partials/deprecated-variables.md -->

## Global Variables

| ENV                   | Description                                  | Read More |
| --------------------- | -------------------------------------------- | --------- |
| `EDITOR`              | Default terminal editor  *(default: `code`)* |           |
| `GIT_COMMITTER_NAME`  | Name to be used in `~/.gitconfig`            | [→][git]  |
| `GIT_COMMITTER_EMAIL` | Email to be used in `~/.gitconfig`           | [→][git]  |
| `PAGER`               | Default terminal pager *(default: `less`)*   |           |
| `TZ`                  | Define the timezone                          |           |

[git]: /tools/git
