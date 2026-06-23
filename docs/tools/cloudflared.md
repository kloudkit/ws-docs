---
description: "Expose a Kloud Workspace to the internet with Cloudflare Tunnel — an outbound-only connection needing no inbound ports or public IP."
see:
  - name: Features
    link: /editor/features
---

# Cloudflared <Badge type="tip" text="installable feature" />

<!--@include: ../partials/feature-not-included.md -->

[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
exposes the workspace to the internet through an outbound-only connection to Cloudflare's edge,
no inbound ports and no public IP on the host.

The `cloudflared` feature installs the tunnel connector. Once a tunnel token is supplied, the
workspace runs and supervises the tunnel automatically.

## Installation

Install `cloudflared` using the [features](/editor/features) system:

```sh
# Manual installation
ws feature install cloudflared

# Or at boot time
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="cloudflared" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

## Running a Tunnel

Create a remotely-managed tunnel in the [Cloudflare dashboard](https://one.dash.cloudflare.com/)
and copy its **connector token**.

Provide it through `WS_CLOUDFLARED_TUNNEL_TOKEN` and the tunnel starts automatically on boot:

```sh{2}
docker run \
  -e WS_CLOUDFLARED_TUNNEL_TOKEN="<token>" \
  -e WS_FEATURES_ADDITIONAL_FEATURES="cloudflared" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

The tunnel is supervised: if it exits, it is restarted automatically.
When no token is set, the tunnel stays dormant.

::: tip

`WS_CLOUDFLARED_TUNNEL_TOKEN` is a secret.

Besides the literal value, you can supply it as a `file:` reference *(`file:/path/to/token`)* or mount
it at `/run/secrets/workspace/cloudflared/tunnel_token`.

:::

## Logs

Inspect the tunnel's output with [`ws-cli`](/tools/ws-cli):

```sh
ws logs --target=cloudflared
```
