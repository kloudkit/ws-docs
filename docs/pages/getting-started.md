# Getting Started

## Requirements

Get started, make sure the the *bare-minimum* system requirements are met:

- 2GB RAM.
- 2 vCPUs.
- WebSockets enabled.
- Linux OS *(Windows with WSL or Docker Desktop can also be used)*.

::: tip
The minimum requirements takes into consideration the overhead need to run the Docker
engine.
For enhanced performance, consider allocating **4GB RAM** and **4 vCPUs** *(or more)*, as
these upgrades will contribute to improved overall system responsiveness and efficiency.

Although Windows OS can be used, Linux is the recommended choice for optimal use.
:::

### ARM Architecture Support

![ARM](/icons/arm.svg){.doc-image width=150px}

We provide support for **ARM** systems—such as Apple M-series *(M1, M2, etc.)*, NVIDIA's
Jetsons line, and Raspberry Pis.

If Docker detects an ARM-based host, it will automatically pull the appropriate
ARM-compatible image from our multi-architecture releases.

::: tip
We only publish ARM-based images on specific tagged releases *(e.g., `v0.0.x`)*.
The `latest` tag does **not** include ARM images.

To run on ARM, be sure to use a versioned tag.
:::

## Usage

### Basic

Start coding now!

Run the command below to deploy an
[*ephemeral*](https://www.merriam-webster.com/dictionary/ephemeral) container running on
port `8080`.

::: code-group

```sh [docker]
docker run -p 8080:8080 ghcr.io/kloudkit/workspace:v0.0.21
```

```yaml [compose]
version: '3.8'
services:
  workspace:
    image: ghcr.io/kloudkit/workspace:v0.0.21
    ports:
      - 8080:8080
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
          image: ghcr.io/kloudkit/workspace:v0.0.21
          ports:
            - containerPort: 8080
```

:::

### Advanced

```sh
docker run -it --rm \
    --restart=unless-stopped \
    -p 8080:8080 \
    -e GIT_COMMITTER_NAME="Joe Smith" \
    -e GIT_COMMITTER_EMAIL=j@smith.com \
    -e TZ=Asia/Jerusalem \
    -v ./custom/ca:/usr/local/share/ca-certificates/workspace \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v data:/workspace \
    ghcr.io/kloudkit/workspace:v0.0.21
```

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
