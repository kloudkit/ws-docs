---
outline: deep
---

# Getting Started

## Requirements

Get started, make sure the the *bare-minimum* system requirements are met:

- 2GB RAM.
- 2 vCPUs.
- WebSockets enabled.

::: tip
The minimum requirements takes into consideration the overhead need to run the Docker engine.
For enhanced performance, consider allocating **4GB RAM** and **4 vCPUs** *(or more)*, as these
upgrades will contribute to improved overall system responsiveness and efficiency.
:::

## Usage

### Basic

Start coding now!

Run the command below to deploy an
[*ephemeral*](https://www.merriam-webster.com/dictionary/ephemeral) container running on port
`8080`.

::: code-group

```sh [docker]
docker run -p 8080:8080 ghcr.io/kloudkit/workspace:latest
```

```yaml [compose]
version: '3.8'
services:
  workspace:
    image: ghcr.io/kloudkit/workspace:latest
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
          image: ghcr.io/kloudkit/workspace:latest
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
    ghcr.io/kloudkit/workspace:latest
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
If you see a *screen with an downward pointing arrow* icon in your address, just click and
you are ready to go.

![Chrome toolbar](/chrome-toolbar.png)

### Alterative Methods

If the automatic detection did not work, follow
[these instructions](https://support.google.com/chrome_webstore/answer/3060053).
