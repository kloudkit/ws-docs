# Port Forwarding

When developing in a *workspace*, ports published in the running instance
*(which operates using Docker containers)* are not externally accessible due to default
network isolation settings *(enforced by Docker for security)*.
To allow external connections, specific network configurations or port forwarding must be
implemented.

Ports published in the *workspace* are automatically detected and accessible through an
internal proxy.
A popup will appear in the bottom right corner of the workspace, offering quick access to
the published service.

![Published ports popup](/port-forwardig.png)

The following sections will discuss the methods that can be chosen to allow access to
services running inside the *workspace* instance.

## Subpath Access *(enabled by default)*

All ports published in the *workspace* are accessible at a subpath formatted as
`/proxy/<port>/`.

For example, assume your *workspace* is deployed at `ws.dev`, and you run the `pyserver`
command from the terminal *(which deploys a file index server on port `8000`)*.
You could then access the server via `ws.dev/proxy/8000`.

## Subdomain Access

::: warning
Ensure that your reverse proxy *(if in use)* is configured to forward the host header
correctly.
This setup is essential for the service access configuration to function properly.
:::

To access services through a subdomain, you need to configure a *DNS* entry for each port
you intend to access.
Alternatively, you can set up a wildcard DNS entry *(`*.<domain>`)* to manage proxying
across all ports automatically.

You can specify the domain *(and subdomain)* structure using the `WS_PROXY_DOMAIN`
environment variable:

```sh{2}
docker run \
  -e WS_PROXY_DOMAIN=ws.dev \
  ghcr.io/kloudkit/workspace:latest
```

In the configuration above, if your *workspace* is hosted at `ws.dev` and you initiate a
`pyserver` command *(which launches a file index server on port `8000`)*, you can access
the server at `8000.ws.dev`.

Using the example above, assume your *workspace* is deployed at `ws.dev`, and you run the
`pyserver` command from the terminal *(which deploys a file index server on port `8000`)*.
You could then access the server via `8000.ws.dev`.
