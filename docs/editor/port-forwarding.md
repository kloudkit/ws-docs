---
description: "Open web servers running in Kloud Workspace from your browser, on a subpath of the workspace address or a subdomain per port."
see:
  - name: Authentication
    link: /editor/authentication
  - name: TLS & Certificates
    link: /settings/tls
---

# Port Forwarding

Open the web servers you run in the workspace from your browser, through the workspace's own
address.
Ports opened inside the container are not reachable from outside it by default, because of
Docker's network isolation.
The workspace detects them and makes them reachable through its built-in proxy, and a
notification in the bottom-right corner links to each published service.

![Published ports popup](/port-forwarding.png)

Both access methods sit behind the workspace login: a forwarded port requires the same sign-in as
the editor, and the workspace's own session cookies are removed before a request reaches
your app.

## Subpath Access

Subpath access is enabled by default: every published port is available at `/proxy/<port>/`.

For example, if your Kloud Workspace is published at `127.0.0.1:8080` and you run `pyserver`
in the terminal *(the oh-my-zsh `python` plugin's alias for `python3 -m http.server`, on port
`8000`)*, you can access the server at `http://127.0.0.1:8080/proxy/8000/`.

## Subdomain Access

Set the domain *(and subdomain)* structure with this variable:

- <EnvVar group="server" name="proxy_domain" />

```sh{2}
docker run \
  -e WS_SERVER_PROXY_DOMAIN=ws.example.com \
  ghcr.io/kloudkit/workspace:v0.6.0
```

In the configuration above, if your Kloud Workspace is hosted at `ws.example.com` and you run
`pyserver` *(port `8000`)*, you can access the server at `8000.ws.example.com`.
This assumes the workspace answers on port 80 or 443; otherwise add its port
*(`8000.ws.example.com:8080`)*.

Subdomain access needs a *DNS* entry for each port you want to access, or one wildcard entry
*(`*.<domain>`)* that covers all ports.
If adding DNS entries is not possible, use the [local DNS](#local-dns) workaround on your own
machine.

A leading `*.` is ignored, so `WS_SERVER_PROXY_DOMAIN=*.ws.example.com` behaves the same as
`ws.example.com`.

### Multiple Domains <Badge type="info" text="since v0.0.22" />

You can provide multiple proxy domains by passing a space-delimited list:

```sh{2}
docker run \
  -e WS_SERVER_PROXY_DOMAIN="ws.example.com local.ws.example.com" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

With the configuration above, services are available on both domains: `*.ws.example.com`
and `*.local.ws.example.com`.

### Custom Subdomain Pattern

:::: info
::: v-pre
Each domain is prefixed with `{{port}}.` by default.
To place the port elsewhere, include a `{{port}}` placeholder in the domain:
:::
::::

```sh{2}
docker run \
  -e WS_SERVER_PROXY_DOMAIN="{{port}}-project.ws.example.com ws.example.com" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

With the configuration above, port `8000` is available at both `8000-project.ws.example.com`
and `8000.ws.example.com`.

### Behind a Reverse Proxy

::: warning
Configure the reverse proxy to forward the host header, or subdomain access does not work.
:::

## Local DNS

If you cannot modify a DNS server, define *hostname-to-IP* mappings on your local machine in
`/etc/hosts` on Linux or `C:\Windows\System32\drivers\etc\hosts` on Windows.
This method is useful for testing or development environments.

::: warning
This configuration only affects your local machine and does not impact external DNS
servers.

Avoid using this method in production environments.
:::

To map a domain name to your local machine *(IP: 127.0.0.1)*:

1. Open `/etc/hosts` for editing.

2. Add a new entry at the end of the file.
    For example, for subdomain access to port `8000`:

    ```plaintext
    127.0.0.1    8000.ws.test
    ```

    If you use multiple domains, add one line per domain:

    ```plaintext
    127.0.0.1    8000.ws.test
    127.0.0.1    8000.local.ws.test
    ```

3. Verify the configuration by running `ping 8000.ws.test` in the terminal.
    The output should show the IP `127.0.0.1`.

::: tip
Avoid TLDs like `.dev` or `.new`, as they require an SSL certificate.
:::

Two limits apply to this workaround:

- `/etc/hosts` does not support wildcard records *(such as `*.ws.test`)*.
  Repeat the process for each port you intend to expose.
- `/etc/hosts` maps names to IPs only, not ports.
  If Kloud Workspace is published on a port other than `80` or `443`, include it in the
  URL *(e.g., `8000.ws.test:8080`)*.
