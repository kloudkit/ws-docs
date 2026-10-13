---
description: "Configure Kloud Workspace's opt-in authentication or integrate an external provider — the default deployment requires no authentication."
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
Remember to run `Sign out of Kloud Workspace` from the Command Palette when you are done
working, as your login session won't expire automatically.
:::

![Sign out animation](/editor/authentication/authentication.gif){.doc-image-shadow}

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
  ghcr.io/kloudkit/workspace:v0.5.2
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
  ghcr.io/kloudkit/workspace:v0.5.2
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
  ghcr.io/kloudkit/workspace:v0.5.2
```

See [Resolving Secret Values](/settings/configuration#resolving-secret-values)
for the full resolution chain and Kubernetes example.

### Rate Limiting

The workspace has a built-in throttling mechanism to rate-limit password authentication
attempts to two per minute and an additional twelve per hour.

## OIDC Authentication *(since v0.4.0)*

To sign in with your identity provider *(Keycloak, Entra ID, Authentik, or any OpenID
Connect issuer)*, set `WS_AUTH_MODE=oidc`.
An authenticating proxy then listens on port `38080` and checks every request, forwarded
ports included, before it reaches the editor, which binds to loopback only.
Publish `38080` instead of `8080`.

- <EnvVar group="auth" name="mode" />
- <EnvVar group="auth" name="oidc_issuer" />
- <EnvVar group="auth" name="oidc_client_id" />
- <EnvVar group="auth" name="oidc_client_secret" />

::: warning
Serve the workspace over HTTPS.
The session cookie is marked `Secure`, so over plain HTTP the browser drops it and sign-in
loops back to the identity provider.
:::

```sh{2-6}
docker run \
  -p 38080:38080 \
  -e WS_AUTH_MODE=oidc \
  -e WS_AUTH_OIDC_ISSUER=https://idp.example.com/realms/ws \
  -e WS_AUTH_OIDC_CLIENT_ID=workspace \
  -e WS_AUTH_OIDC_CLIENT_SECRET=file:/run/secrets/workspace/auth/oidc_client_secret \
  ghcr.io/kloudkit/workspace:v0.5.2
```

### Registering the Workspace

Register the workspace with your identity provider as a *confidential* client:

- Redirect URI: `https://<workspace-host>/oauth2/callback`.
- PKCE: allow `S256`.
- Groups: when you restrict access by group, add a `groups` claim to the ID token.

The issuer URL must resolve to the same host from your browser and from inside the
workspace container.

### Restricting Access

By default, any user your identity provider signs in is allowed.
Narrow that down by group or by email:

- <EnvVar group="auth" name="oidc_allowed_groups" />
- <EnvVar group="auth" name="oidc_allowed_emails" />
- <EnvVar group="auth" name="oidc_forbidden_message" />

A denied user sees your message and a *Sign in as a different user* button, which ends their
session at the identity provider *(since v0.5.3)*.

![Not-authorized page](/editor/authentication/oidc-denied.png){.doc-image-shadow}

### Forwarded Ports

When [subdomain access](/editor/port-forwarding#subdomain-access) is configured, the session
cookie is scoped to the parent of `WS_SERVER_PROXY_DOMAIN`, so one sign-in covers the editor
and every forwarded port.

:::: warning
::: v-pre
A templated domain widens that scope: `{{port}}-ws.example.com` shares the session with
every site under `example.com`.
Prefer a dedicated subdomain such as `*.ws.example.com`.
:::
::::

### Sessions

A session lasts seven days.
The cookie secret is generated once and stored in the workspace home, so sessions survive
restarts; set it explicitly when you redeploy without that volume or run several replicas:

- <EnvVar group="auth" name="oidc_cookie_secret" />

Sessions are not re-checked with the identity provider by default, so a user you disable
there keeps access until the session expires.
To re-check them periodically *(since v0.5.3)*:

- <EnvVar group="auth" name="oidc_session_refresh" />

::: tip
Add `offline_access` to `WS_AUTH_OIDC_SCOPES` so idle users refresh silently instead of
being asked to sign in again.
Keycloak, Entra ID and Authentik support it; Google does not.
:::

::: warning
If the identity provider refuses `offline_access` for a user, sign-in fails.
In Keycloak, users need the `offline_access` role, which the default roles include.
:::

## Signing Out

The `Sign out of Kloud Workspace` command is only shown when a sign-out URL is known.
It is derived from the active authentication mode and needs no configuration, but can be
overridden:

- <EnvVar group="editor" name="logout_url" />

With OIDC *(since v0.5.3)*, signing out also ends your session at the identity provider when
it advertises an `end_session_endpoint`, and you land on its signed-out page.
Without one, only the workspace session ends, and the next visit may sign you straight back
in.
