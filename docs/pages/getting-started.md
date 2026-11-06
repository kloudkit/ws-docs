---
description: "Get started with Kloud Workspace — system requirements and the quickest path to running your pre-configured development workspace."
---

# Getting Started

## Requirements

Get started, make sure the *bare-minimum* system requirements are met:

- 2GB RAM.
- 2 vCPUs.
- WebSockets enabled.
- Linux OS *(Windows with WSL or Docker Desktop can also be used)*.

::: tip
The minimum requirements take into consideration the overhead needed to run the Docker
engine.
For enhanced performance, consider allocating **4GB RAM** and **4 vCPUs** *(or more)*, as
these upgrades will contribute to improved overall system responsiveness and efficiency.

Although Windows OS can be used, Linux is the recommended choice for optimal use.
:::

### ARM Architecture Support

![ARM](/icons/arm.svg){.doc-image width=150px}

We provide support for **ARM** systems, such as Apple M-series *(M1, M2, etc.)*, NVIDIA's
Jetsons line, and Raspberry Pis.

If Docker detects an ARM-based host, it will automatically pull the appropriate
ARM-compatible image from our multi-architecture releases.

::: tip
We only publish ARM-based images on specific tagged releases *(e.g., `v0.0.x`)*.
The `latest` tag does **not** include ARM images.

To run on ARM, be sure to use a versioned tag.
:::

## Installation

Run the command below to start an
[*ephemeral*](https://www.merriam-webster.com/dictionary/ephemeral) container, then open
`http://localhost:8080`.

::: warning No sign-in by default
The workspace has no sign-in until you set one, and the `kloud` user has passwordless `sudo`.
Anyone who can reach the port gets a terminal that can run commands as root.
The Docker and Compose examples publish the port on `127.0.0.1` only.
Before you expose the workspace to other machines, set a password:

```sh
docker run -p 8080:8080 -e WS_AUTH_PASSWORD=change-me ghcr.io/kloudkit/workspace:v0.5.3
```

See [Authentication](/editor/authentication) for hashed passwords and OIDC sign-in.
:::

::: code-group

```sh [docker]
docker run -p 127.0.0.1:8080:8080 ghcr.io/kloudkit/workspace:v0.5.3
```

```yaml [compose]
services:
  workspace:
    image: ghcr.io/kloudkit/workspace:v0.5.3
    ports:
      - 127.0.0.1:8080:8080
```

```sh [helm]
# Add the Helm repository
helm repo add kloudkit https://charts.kloudkit.com

# Discover all available values
helm show values kloudkit/workspace

# Install the default Helm chart
helm install my-workspace kloudkit/workspace
```

```sh [helm (oci)]
# Discover all available values
helm show values oci://ghcr.io/kloudkit/charts/workspace

# Install the default Helm chart
helm install my-workspace oci://ghcr.io/kloudkit/charts/workspace
```

```yaml [kubernetes]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: workspace
spec:
  selector:
    matchLabels:
      app: workspace
  template:
    metadata:
      labels:
        app: workspace
    spec:
      containers:
        - name: workspace
          image: ghcr.io/kloudkit/workspace:v0.5.3
          ports:
            - containerPort: 8080
```

:::

::: tip

For advanced configuration via environment variables, see the
[Configuration](/settings/configuration) page.

:::

## Installing in Chrome - SPA

This guide will walk you through the steps to install a SPA *(single-page application)* in
Google Chrome.

Once installed, you will immediately benefit from:

- Quick access via a *desktop shortcut*.
- Distraction-free environment by removing browser elements *(i.e. toolbar, etc.)*.
- Full keyboard shortcut support.
- Privacy-focused features that can be enabled via Chrome's settings.

### Auto-Detected SPA

In many cases, the ability to install the SPA will be detected automatically.
If you see a *screen with an downward pointing arrow* icon in your address
![install-desktop](/icons/install-desktop.svg){.doc-image-inline}, just click and you are
ready to go.

![Chrome toolbar](/chrome-toolbar.png)

### Alterative Methods

If the automatic detection did not work, follow
[these instructions](https://support.google.com/chrome_webstore/answer/3060053).
