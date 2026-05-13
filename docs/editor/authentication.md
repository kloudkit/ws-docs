---
see:
  - name: Secrets
    link: /settings/secrets
---

# Authentication

Given that the majority of users will integrate the *workspace* with an external
authentication provider *(or deploy on a local machine)*, the default deployment is
configured to not require authentication.

The following sections will help you set up our *opt-in* authentication mechanism.

::: warning
Remember to click `Sign out` at the bottom of the `File` menu when you are done working,
as your login session won't expire automatically.
:::

![Settings animation](/editor/authentication/authentication.gif){.doc-image-shadow}

## Password Authentication

Passed authentication can be easily configured by setting an environment variable when
deploying the *workspace*.
Setting your password is as simple as defining an `env` variable:

- <EnvVar group="auth" name="password" />
- <EnvVar group="auth" name="password_hashed" />

::: info Automatic Cleanup

Authentication related environment variables are automatically removed once the workspace
finishes starting up.

This means they will not be visible in your terminal sessions, child processes, or any
application running inside the workspace.
:::

```sh{2}
docker run \
  -e WS_AUTH_PASSWORD=super_duper_secret \
  ghcr.io/kloudkit/workspace:v0.2.1
```

### Creating a Hashed Password

To generate a hashed password, use the `ws-cli` tool
*(replacing `"super_duper_secret"` with your desired password)*:

```sh
$ echo -n super_duper_secret | ws secrets generate login
$argon2id$v=19$m=4096,t=3,p=1$z4DjJlJgI6S7fAdQC35ZQw$Rpu8CLMWedxJaH0eiFCetyoRbg+S8ow/RRyVCZzM6QE
```

::: tip

You can generate the password hash **from within a running workspace** for subsequent executions.
Then restart the instance and set the value for `WS_AUTH_PASSWORD_HASHED`:

```sh
echo -n "your_password" | ws secrets generate --workspace --raw
```

:::

Then deploy the workspace:

```sh{2}
docker run \
  -e WS_AUTH_PASSWORD_HASHED="$argon2id$v=19$m=4096,t=3,p=1$z4DjJlJgI6S7fAdQC35ZQw$Rpu8CLMWedxJaH0eiFCetyoRbg+S8ow/RRyVCZzM6QE" \
  ghcr.io/kloudkit/workspace:v0.2.1
```

### File-Based Passwords

Instead of passing passwords as environment variables, you can mount them as files
*(useful with Docker secrets or Kubernetes `Secret` projections)*.
Point the variable at the file with the `file:` prefix, or mount the file at the
convention path and leave the variable unset.

```sh{2-3}
docker run \
  -e WS_AUTH_PASSWORD_HASHED=file:/run/secrets/workspace/auth/password_hashed \
  -v ./password_hashed.txt:/run/secrets/workspace/auth/password_hashed:ro \
  ghcr.io/kloudkit/workspace:v0.2.1
```

See [Resolving Secret Values](/settings/configuration#resolving-secret-values)
for the full resolution chain and Kubernetes example.

### Rate Limiting

The workspace has a built-in throttling mechanism to rate-limit password authentication
attempts to two per minute and an additional twelve per hour.
