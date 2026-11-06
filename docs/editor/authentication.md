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
working, as a password session renews itself for as long as the editor stays open.
:::

![Sign out animation](/editor/authentication/authentication.gif){.doc-image-shadow}

## Password Authentication

Passed authentication can be easily configured by setting an environment variable when
deploying the *workspace*.
Setting your password is as simple as defining an `env` variable:

- <EnvVar group="auth" name="password" />
- <EnvVar group="auth" name="password_hashed" />

::: info Automatic Cleanup

The password and OIDC secrets are removed from the editor's environment once it starts, so
editor terminals and extensions don't inherit them.

This is not isolation: startup scripts and `docker exec` shells still receive them, and any
process running as `kloud` can read the editor's original environment from `/proc`.
:::

```sh{2}
docker run \
  -e WS_AUTH_PASSWORD=super_duper_secret \
  ghcr.io/kloudkit/workspace:v0.5.3
```

### Creating a Hashed Password

To generate a hashed password, use the `ws-cli` tool
*(replacing `"super_duper_secret"` with your desired password)*:

```sh
$ echo -n super_duper_secret | ws-cli secrets generate login --raw
$argon2id$v=19$m=65536,t=3,p=4$mfRoKKtjdqmC0fE73vEEfQ$tHJBsv7PlXsUYt/BgOUooS+zUJZgZcd/+/tfAY2t6Q8
```

::: tip

Generate the hash in a terminal of any running workspace, then set it as
`WS_AUTH_PASSWORD_HASHED` on the next container:

```sh
echo -n "your_password" | ws-cli secrets generate login --raw
```

:::

Then deploy the workspace, with the hash in single quotes so the shell leaves its `$` signs alone:

```sh{2}
docker run \
  -e WS_AUTH_PASSWORD_HASHED='$argon2id$v=19$m=65536,t=3,p=4$mfRoKKtjdqmC0fE73vEEfQ$tHJBsv7PlXsUYt/BgOUooS+zUJZgZcd/+/tfAY2t6Q8' \
  ghcr.io/kloudkit/workspace:v0.5.3
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
  ghcr.io/kloudkit/workspace:v0.5.3
```

See [Resolving Secret Values](/settings/configuration#resolving-secret-values)
for the full resolution chain and Kubernetes example.

### Rate Limiting

Failed sign-ins are limited per client IP address: two per minute and twelve per hour in total.
While the limit is reached, every attempt is refused, even with the right password.
Behind a reverse proxy, every user shares the proxy's address and its limit.

## OIDC Authentication *(since v0.4.0)*

To sign in with your identity provider *(Keycloak, Entra ID, Authentik, or any OpenID
Connect issuer)*, set `WS_AUTH_MODE=oidc`.
The editor then signs users in itself on `WS_SERVER_PORT` *(since v0.6.0)*, the same port as
password mode, and checks every request except static assets and `/healthz`, forwarded ports
included.
The workspace refuses to start when a required setting is missing or a password is also set.

- <EnvVar group="auth" name="mode" />
- <EnvVar group="auth" name="oidc_issuer" />
- <EnvVar group="auth" name="oidc_client_id" />
- <EnvVar group="auth" name="oidc_client_secret" />
- <EnvVar group="auth" name="oidc_allowed_emails" />

```sh{2-8}
docker run \
  -p 8080:8080 \
  -e WS_AUTH_MODE=oidc \
  -e WS_AUTH_OIDC_ISSUER=https://idp.example.com/realms/ws \
  -e WS_AUTH_OIDC_CLIENT_ID=workspace \
  -e WS_AUTH_OIDC_CLIENT_SECRET=file:/run/secrets/workspace/auth/oidc_client_secret \
  -v ./oidc_client_secret:/run/secrets/workspace/auth/oidc_client_secret:ro \
  -e WS_AUTH_OIDC_ALLOWED_EMAILS="alice@example.com *@team.example.com" \
  ghcr.io/kloudkit/workspace:v0.5.3
```

::: tip
Serve the workspace over HTTPS.
Behind a TLS terminator, forward `X-Forwarded-Proto: https` so the session cookie is marked
`Secure` and the callback URL uses `https`.
:::

::: info Upgrading from the auth proxy
Before v0.6.0, a separate sign-in proxy ran on port `38080`.

- Publish `8080` instead; `WS_SERVER_AUTH_PROXY_PORT` and `WS_LOGGING_AUTH_PROXY_FILE` are gone,
  and so is `ws logs --target auth_proxy`.
- Set `WS_AUTH_OIDC_ALLOWED_EMAILS`: the workspace refuses to start without it, or with
  `WS_AUTH_OIDC_ALLOWED_GROUPS` set.
- A session now lasts `WS_AUTH_SESSION_TTL` *(one day)* from sign-in, not seven days.
- `WS_AUTH_OIDC_FORBIDDEN_MESSAGE` and `WS_AUTH_OIDC_SESSION_REFRESH` are gone.
:::

### Registering the Workspace

Register the workspace with your identity provider as a *confidential* client:

- Redirect URI: `https://<workspace-host>/oauth2/callback`.
- PKCE: allow `S256`.

The workspace requests the `openid email profile` scopes; `openid` is always added:

- <EnvVar group="auth" name="oidc_scopes" />

The issuer URL must resolve to the same host from your browser and from inside the
workspace container.
By default the callback is derived from the host users browse to.
To pin it, for example behind a proxy that rewrites the `Host` header, set one callback per
proxy domain:

- <EnvVar group="auth" name="oidc_redirect_url" />

### Restricting Access

Only the emails in `WS_AUTH_OIDC_ALLOWED_EMAILS` can sign in.
List exact addresses, or `*@domain` for everyone at a domain; matching ignores case.
The email comes from the ID token, or from the userinfo endpoint when the token has none.
`email_verified` is not checked, so allow only domains your identity provider controls.

A denied user sees an access-denied page with a *Sign in as a different user* button.
It signs them out, and ends their session at the identity provider too when the provider
advertises an `end_session_endpoint`.

![Access-denied page](/editor/authentication/oidc-denied.png){.doc-image-shadow}

### Forwarded Ports

When [subdomain access](/editor/port-forwarding#subdomain-access) is configured, the session
cookie is scoped to the domain in `WS_SERVER_PROXY_DOMAIN` *(`ws.example.com` for
`*.ws.example.com`)*.
Serve the editor on that domain or a subdomain of it, and one sign-in covers the editor and every
forwarded port.
With several proxy domains, the most specific one that matches the host wins, and each domain
signs in on its own.

:::: warning
::: v-pre
A templated domain widens that scope: `{{port}}-ws.example.com` shares the session with
every site under `example.com`.
Prefer a dedicated subdomain such as `*.ws.example.com`.
:::
::::

### Sessions

A session lasts `WS_AUTH_SESSION_TTL` from sign-in and is not extended while you work.
When it ends, the next page load signs you in again, without a prompt while your identity
provider session is still open.

- <EnvVar group="auth" name="session_ttl" />

The cookie secret is generated once and stored in `~/.ws/state`, so sessions survive
restarts; set it explicitly when you redeploy without that volume or run several replicas:

- <EnvVar group="auth" name="oidc_cookie_secret" />

Removing an email from `WS_AUTH_OIDC_ALLOWED_EMAILS` ends that user's session once the
workspace restarts.
To sign everyone out, change the cookie secret.

## Signing Out

The `Sign out of Kloud Workspace` command is only shown when a sign-out URL is known.
It is derived from the active authentication mode and needs no configuration, but can be
overridden:

- <EnvVar group="editor" name="logout_url" />

With OIDC *(since v0.5.3)*, signing out also ends your session at the identity provider when
it advertises an `end_session_endpoint`, and you land on its signed-out page.
Without one, only the workspace session ends, and the next visit may sign you straight back
in.
