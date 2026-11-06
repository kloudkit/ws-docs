---
description: "Enable HTTPS and install custom CA certificates in Kloud Workspace to secure the editor, terminal and browser tooling end-to-end."
see:
  - name: Port Forwarding
    link: /editor/port-forwarding
  - name: Authentication
    link: /editor/authentication
  - name: Storage
    link: /editor/storage
---

# TLS & Certificates

![Enterprise CA icon](/icons/enterprise-ca.svg){.doc-image}

Serve the editor over HTTPS, and make the workspace trust your company's root CA.

## Enable HTTPS {#https-tls-termination}

Terminate TLS in a reverse proxy in front of the container, or let the workspace serve HTTPS
itself.

### Reverse Proxy *(Recommended)*

Put an ingress controller *(NGINX, Traefik, Caddy, Envoy, etc.)* or a cloud load balancer in front
of the container to handle TLS termination, and forward plain HTTP to the editor's port `8080`.
This keeps your certificates in one place and lets you reuse a single wildcard cert for multiple
workspaces.

### Workspace-Managed TLS

When a reverse proxy is not an option, give the editor a certificate and its key, and it serves
HTTPS directly:

```sh
docker run -d \
  -p 443:8080 \
  -v $(pwd)/certs:/certs:ro \
  -e WS_SERVER_SSL_KEY=file:/certs/tls.key \
  -e WS_SERVER_SSL_CERT=file:/certs/tls.crt \
  ghcr.io/kloudkit/workspace:v0.6.0
```

::: tip
Even with HTTPS enabled, the internal listener stays on `8080`.
:::

The variables that control it:

- <EnvVar group="server" name="ssl_cert" />
- <EnvVar group="server" name="ssl_key" />
- <EnvVar group="server" name="ssl_hosts" />

Instead of the variables, you can mount the certificate and key at
`/run/secrets/workspace/server/ssl_cert` and `/run/secrets/workspace/server/ssl_key`.

### Self-Signed Certificate

To test HTTPS without a certificate, set `WS_SERVER_SSL_HOSTS` alone, and the editor creates a
self-signed certificate for those names:

```sh
docker run -d \
  -p 8443:8080 \
  -e WS_AUTH_PASSWORD=change-me \
  -e WS_SERVER_SSL_HOSTS="devbox.lan 192.168.1.50" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

Open `https://devbox.lan:8443` and accept the browser's warning.
The certificate is RSA 4096-bit, valid for one year, and covers every name and IP address in the
list.
The editor creates a new one each time it starts, so a browser that trusted the last one warns
again.

::: warning
Self-signed certs are fine for local prototyping but should **never** be exposed to the public
Internet.

Use a CA-issued cert in production.
:::

## Why HTTPS Matters

HTTPS lets the editor, terminal and browser-based tooling use Web APIs that need a secure context,
and protects data in transit.

Modern browsers lock many capabilities behind a [secure context][moz].
When the workspace runs on plain HTTP, some features are silently disabled:

- Async Clipboard API
- Service Workers
- WebGPU
- JupyterNotebooks

Kloud Workspace also shows a warning notification whenever it is served over plain HTTP from a host
other than `localhost`, reminding users to switch to HTTPS for full functionality.

## Trust Your Company's Root CA {#enterprise-ca-custom-certificates}

If your network inspects TLS traffic with a company root CA *(a MITM firewall)*, add that CA so tools
in the workspace trust it.

### Mount the Certificates

Mount the certificate *(or certificates)* at `/usr/local/share/ca-certificates/workspace/` in the
container:

::: code-group

```sh{2} [Single]
docker run \
  -v /path/on-host/ca.crt:/usr/local/share/ca-certificates/workspace/ca.crt \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```sh{2} [Multiple]
docker run \
  -v /folder/on-host:/usr/local/share/ca-certificates/workspace \
  ghcr.io/kloudkit/workspace:v0.6.0
```

:::

Only `.crt` files at the top of that directory are trusted.
Startup also writes downloaded certificates into it, so a bind-mounted host folder receives
them, and the downloads fail if the folder is read-only.

### Drop-in Directory `~/.ws/ca.d/`

Drop `.crt` files into `~/.ws/ca.d/` and they are trusted when the next container starts,
with no environment variable and nothing to mount beyond `~/.ws/`.

::: warning
The file extension **must** be `.crt`.
`update-ca-certificates` only picks up `.crt`; `.pem` and other extensions are silently skipped.
:::

```sh
docker run \
  -v $(pwd)/corp-ca.crt:/home/kloud/.ws/ca.d/corp-ca.crt \
  ghcr.io/kloudkit/workspace:v0.6.0
```

It uses the same persisted volume as [autoload scripts](/settings/autoload-scripts),
extensions and the [seed source](/settings/seed).

### Download from an HTTPS Endpoint

Or download your company's root CA from one or more secure *HTTPS* endpoints, separated by spaces:

- <EnvVar group="ca" name="additional_cert_endpoints" />

::: code-group

```sh{2} [Single]
docker run \
  -e WS_CA_ADDITIONAL_CERT_ENDPOINTS="https://corp.com/ca.pem" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```sh{2} [Multiple]
docker run \
  -e WS_CA_ADDITIONAL_CERT_ENDPOINTS="https://corp.com/ca.pem https://alt.com/root.crt" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

:::

### Download from an Insecure Endpoint

In trusted network environments, download certificates from *HTTP* or insecure *HTTPS* endpoints:

- <EnvVar group="ca" name="additional_cert_insecure_endpoints" />

::: warning
This variable supports both *HTTP* and *HTTPS* URLs.
For *HTTPS* URLs, certificate validation is bypassed using insecure connections.

**Use only in fully trusted network environments.**
:::

::: code-group

```sh{2} [Single]
docker run \
  -e WS_CA_ADDITIONAL_CERT_INSECURE_ENDPOINTS="http://corp.com/ca.pem" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```sh{2} [Multiple]
docker run \
  -e WS_CA_ADDITIONAL_CERT_INSECURE_ENDPOINTS="http://corp.com/ca.pem https://untrusted.com/root.crt" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

:::

### Generated Configurations

At startup, the installed certificates are detected and bundled along with all other available
certificates *(into `/usr/local/share/ca-certificates/workspace-bundle.crt`)*.

When custom certificates are installed, every process started through `zsh` *(terminals and
startup scripts)* also gets these variables, pointing at the bundle:

- `AWS_CA_BUNDLE`
- `CARGO_HTTP_CAINFO`
- `COMPOSER_CAFILE`
- `CURL_CA_BUNDLE`
- `GIT_SSL_CAINFO`
- `NODE_EXTRA_CA_CERTS`
- `NPM_CONFIG_CAFILE`
- `PIP_CERT`
- `REQUESTS_CA_BUNDLE`
- `SSL_CERT_FILE`

[moz]: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts
