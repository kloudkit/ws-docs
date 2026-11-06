---
description: "Start Kloud Workspace with Docker, Compose, Helm or Kubernetes, open it in your browser and keep your files across containers."
see:
  - name: Storage
    link: /editor/storage
  - name: Authentication
    link: /editor/authentication
  - name: Configuration
    link: /settings/configuration
  - name: Features
    link: /editor/features
---

# Getting Started

Start Kloud Workspace and open VS Code in your browser.

## Installation

Run the command below to start an [*ephemeral*](https://www.merriam-webster.com/dictionary/ephemeral) container,
then open `http://localhost:8080`.

::: warning No sign-in by default
The workspace has no sign-in until you set one, and the `kloud` user has passwordless `sudo`.
Anyone who can reach the port gets a terminal that can run commands as root.
The Docker and Compose examples publish the port on `127.0.0.1` only.
Before you expose the workspace to other machines, set a password:

```sh
docker run -p 8080:8080 -e WS_AUTH_PASSWORD=change-me ghcr.io/kloudkit/workspace:v0.6.0
```

See [Authentication](/editor/authentication) for hashed passwords and OIDC sign-in.
:::

::: code-group

```sh [Docker]
docker run -p 127.0.0.1:8080:8080 ghcr.io/kloudkit/workspace:v0.6.0
```

```yaml [Compose]
services:
  workspace:
    image: ghcr.io/kloudkit/workspace:v0.6.0
    ports:
      - 127.0.0.1:8080:8080
```

```sh [Helm]
# Add the Helm repository
helm repo add kloudkit https://charts.kloudkit.com

# Discover all available values
helm show values kloudkit/workspace

# Install the default Helm chart
helm install my-workspace kloudkit/workspace
```

```sh [Helm (OCI)]
# Discover all available values
helm show values oci://ghcr.io/kloudkit/charts/workspace

# Install the default Helm chart
helm install my-workspace oci://ghcr.io/kloudkit/charts/workspace
```

```yaml [Kubernetes]
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
          image: ghcr.io/kloudkit/workspace:v0.6.0
          ports:
            - containerPort: 8080
```

:::

::: warning Helm chart on hold
The Helm chart is on hold and is not updated with each release.
The published chart still installs Kloud Workspace v0.1.2.
:::

## Keep Your Files

Files that are not on a volume are lost when the container is removed or recreated, for example to upgrade the image.
The editor opens `/workspace`, so mount a volume there for your projects,
and one on `/home/kloud/.ws` for your shell history and startup scripts:

::: code-group

```sh [Docker]
docker run -p 127.0.0.1:8080:8080 \
  -v workspace:/workspace \
  -v ws:/home/kloud/.ws \
  ghcr.io/kloudkit/workspace:v0.6.0
```

```yaml [Compose]
services:
  workspace:
    image: ghcr.io/kloudkit/workspace:v0.6.0
    ports:
      - 127.0.0.1:8080:8080
    volumes:
      - workspace:/workspace
      - ws:/home/kloud/.ws

volumes:
  workspace:
  ws:
```

:::

## Requirements

The minimum system requirements are:

- 2GB RAM.
- 2 vCPUs.
- WebSockets enabled.
- Linux OS *(macOS with Docker Desktop, or Windows with WSL or Docker Desktop, also work)*.

::: tip
The minimums include the overhead of running the Docker engine.
For a more responsive workspace, allocate **4GB RAM** and **4 vCPUs** *(or more)*.

Windows works, but Linux is the recommended host.
:::

### ARM Architecture Support

![ARM](/icons/arm.svg){.doc-image width=150px}

Images are built for 64-bit **ARM** *(`arm64`)* too,
so they run on Apple silicon, NVIDIA Jetson boards and Raspberry Pis with a 64-bit OS.
On an ARM host, Docker pulls the `arm64` image automatically.

::: tip
Release tags *(such as `v0.6.0` and `v0.6`)* and `latest` include `arm64`.
The `dev` and `pr-<N>` tags are built for `amd64` only.
:::

## Install as an App

Install the workspace as an app in Google Chrome to get:

- Quick access from a *desktop shortcut*.
- A distraction-free window without browser elements *(such as the toolbar)*.
- Full keyboard shortcut support.
- Privacy features that you can turn on in Chrome's settings.

### From the Address Bar

Chrome usually detects that the workspace can be installed.
If the address bar shows the install icon ![install-desktop](/icons/install-desktop.svg){.doc-image-inline},
a screen with a downward-pointing arrow, click it.

![Chrome toolbar](/chrome-toolbar.png)

### Other Methods

If Chrome shows no install icon,
follow [Google's instructions](https://support.google.com/chrome_webstore/answer/3060053).
