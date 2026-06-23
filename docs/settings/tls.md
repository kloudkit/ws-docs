---
description: "Enable HTTPS and install custom CA certificates in Kloud Workspace to secure the editor, terminal, and browser tooling end-to-end."
see:
  - name: Port Forwarding
    link: /editor/port-forwarding
---

# TLS & Certificates

![Enterprise CA icon](/icons/enterprise-ca.svg){.doc-image}

This page covers all TLS-related configuration for Kloud Workspace: enabling HTTPS for
secure browser access, and installing custom CA certificates for enterprise environments.

## HTTPS / TLS Termination

Secure your Kloud Workspace deployment end-to-end so that the editor, terminal, and
browser-based tooling can use powerful Web APIs and protect data in transit.

Once secure, you are set to enjoy the full power of your cloud-native development
environment.

### Why HTTPS Matters

Modern browsers lock many capabilities behind a [secure context][moz].
When the Kloud Workspace runs on plain HTTP, some features are silently disabled:

- Async Clipboard API
- Service Workers
- WebGPU
- JupyterNotebooks

Additionally, Kloud Workspace shows a banner whenever it detects an insecure host other
than `localhost`, reminding users to switch to HTTPS for full functionality.

### TLS Termination Strategies

::: warning
Self-signed certs are perfect for local prototyping but should **never** be exposed to the
public Internet.

Use a CA-issued cert in production.
:::

#### Reverse-Proxy *(Recommended)*

We recommend using a secure ingress controller *(NGINX, Traefik, Caddy, Envoy, etc.)* or
a cloud load-balancer in front of the container to handle TLS termination:

This keeps your certificates in one place and lets you reuse a single wildcard cert for
multiple workspaces.

#### Workspace-Managed TLS

::: tip
Even with HTTPS enabled, the internal listener stays on `8080`.
:::

When a reverse proxy isn't feasible, let the container handle HTTPS directly.

Available configuration values are as follows:

- <EnvVar group="server" name="ssl_cert" />
- <EnvVar group="server" name="ssl_key" />
- <EnvVar group="server" name="ssl_hosts" />

```sh
docker run -d \
  -p 443:8080 \
  -v $(pwd)/certs:/certs:ro \
  -e WS_SERVER_SSL_KEY=/certs/tls.key \
  -e WS_SERVER_SSL_CERT="-----BEGIN CERTIFICATE-----..." \
  -e WS_SERVER_PROXY_DOMAIN=ws.dev \
  ghcr.io/kloudkit/workspace:v0.4.0
```

## Enterprise CA *(Custom Certificates)*

Many companies implement a *MITM (Man-in-the-Middle) firewall* as part of a strict and
secure network infrastructure using a self-hosted *CA (certificate authority)*.

A *custom root CA* along with a *MITM firewall*, also known as an interception or
enterprise certificate, is a digital certificate used by network security devices to
intercept `SSL/TLS`-encrypted communication between a user and a server.
During interception, data is decrypted and inspected for security and monitoring purposes.

### Mounting Certificate Volume

To add your company's root CA, all you need to do is mount the certificate
*(or certificates)* to `/usr/local/share/ca-certificates/workspace/` path
*(in the container)*:

::: code-group

```sh{2} [Single]
docker run \
  -v /path/on-host/ca.crt:/usr/local/share/ca-certificates/workspace/ca.crt \
  ghcr.io/kloudkit/workspace:v0.4.0
```

```sh{2} [Multiple]
docker run \
  -v /folder/on-host:/usr/local/share/ca-certificates/workspace \
  ghcr.io/kloudkit/workspace:v0.4.0
```

:::

### Drop-in Directory `~/.ws/ca.d/`

Drop `.crt` files into `~/.ws/ca.d/` and they are auto-trusted at boot —
no environment variable, no host-side plumbing beyond the existing
`~/.ws/` volume mount.

::: warning
The file extension **must** be `.crt`. `update-ca-certificates` only picks
up `.crt`; `.pem` and other extensions are silently skipped.
:::

```sh
docker run \
  -v $(pwd)/corp-ca.crt:/home/kloud/.ws/ca.d/corp-ca.crt \
  ghcr.io/kloudkit/workspace:v0.4.0
```

This is the recommended path for ad-hoc certificate injection on a
running workspace — the same persisted volume already used for
[autoload scripts](/settings/autoload-scripts), extensions, and the
[secrets vault](/settings/vault).

### Install Certificate from HTTPS Endpoint

Alternatively, you can add your company's root CA via secure *HTTPS* endpoints.
Use the `WS_CA_ADDITIONAL_CERT_ENDPOINTS` environment variable to define one or more
*(space-delimited)* endpoints pointing to the desired certificate.

::: code-group

```sh{2} [Single]
docker run \
  -e WS_CA_ADDITIONAL_CERT_ENDPOINTS="https://corp.com/ca.pem" \
  ghcr.io/kloudkit/workspace:v0.4.0
```

```sh{2} [Multiple]
docker run \
  -e WS_CA_ADDITIONAL_CERT_ENDPOINTS="https://corp.com/ca.pem https://alt.com/root.crt" \
  ghcr.io/kloudkit/workspace:v0.4.0
```

:::

### Install Certificate from Insecure Endpoint

For trusted network environments, you can retrieve certificates from *HTTP* or
insecure *HTTPS* endpoints using the `WS_CA_ADDITIONAL_CERT_INSECURE_ENDPOINTS`
environment variable.

:::warning
This variable supports both *HTTP* and *HTTPS* URLs. For *HTTPS* URLs, certificate
validation is bypassed using insecure connections.

**Use only in fully trusted network environments.**
:::

::: code-group

```sh{2} [Single]
docker run \
  -e WS_CA_ADDITIONAL_CERT_INSECURE_ENDPOINTS="http://corp.com/ca.pem" \
  ghcr.io/kloudkit/workspace:v0.4.0
```

```sh{2} [Multiple]
docker run \
  -e WS_CA_ADDITIONAL_CERT_INSECURE_ENDPOINTS="http://corp.com/ca.pem https://untrusted.com/root.crt" \
  ghcr.io/kloudkit/workspace:v0.4.0
```

:::

### Generated Configurations

The installed certificates will be detected at startup and bundled along with all other
available certificates *(into `/usr/local/share/ca-certificates/workspace-bundle.crt`)*.

In addition, each `zsh` session will contain program specific environment variables
that require the abovementioned bundles and are set automatically *(system-wide)*:

- `COMPOSER_CAFILE`
- `CURL_CA_BUNDLE`
- `NODE_EXTRA_CA_CERTS`
- `NPM_CONFIG_CAFILE`
- `PIP_CERT`
- `REQUESTS_CA_BUNDLE`
- `SSL_CERT_FILE`

[moz]: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts
