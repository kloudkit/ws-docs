# HTTPS / TLS

Secure your Kloud Workspace deployment end-to-end so that the editor, terminal, and
browser-based tooling can use powerful Web APIs and protect data in transit.

Once secure, your are set to enjoy the full power of your cloud-native development
environment.

## Why HTTPS Matters

Modern browsers lock many capabilities behind a [secure context][moz].
When the Kloud Workspace runs on plain HTTP, some features are silently disabled:

- Async Clipboard API
- Service Workers
- WebGPU
- JupyterNotebooks

Additionally, Kloud Workspace shows a banner whenever it detects an insecure host other
than `localhost`, reminding users to switch to HTTPS for full functionality.

## TLS Termination Strategies

::: warning
Self-signed certs are perfect for local prototyping but should **never** be exposed to the
public Internet.

Use a CA-issued cert in production.
:::

### Reverse-Proxy *(Recommended)*

We recommend using a secure ingress controller *(NGINX, Traefik, Caddy, Envoy, etc.)* or
a cloud load-balancer in front of the container to handle TLS termination:

This keeps your certificates in one place and lets you reuse a single wildcard cert for
multiple workspaces.

### Workspace-Managed TLS

::: tip
Even with HTTPS enabled, the internal listener stays on `8080`.
:::

When a reverse proxy isn't feasible, let the container handle HTTPS directly.

Available configuration values are as follows:

- **`WS_SERVER_SSL_HOSTS`:** Space delimited DNS names for self-signed certificate.
- **`WS_SERVER_SSL_KEY`:** Path or inline PEM for the private key.
- **`WS_SERVER_SSL_CERT`:** Path or inline PEM for the server certificate.

```sh
docker run -d \
  -p 443:8080 \
  -v $(pwd)/certs:/certs:ro \
  -e WS_SERVER_SSL_KEY=/certs/tls.key \
  -e WS_SERVER_SSL_CERT="-----BEGIN CERTIFICATE-----..." \
  -e WS_SERVER_PROXY_DOMAIN=ws.dev \
  ghcr.io/kloudkit/workspace:latest
```

[moz]: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts
