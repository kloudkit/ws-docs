---
description: "Build and run containers from Kloud Workspace: turn on Docker, then reach a daemon with Sysbox, dockerd, the host socket, or a remote host."
see:
  - name: Kind
    link: /tools/kind
  - name: SSH
    link: /tools/ssh
  - name: Docker in Docker
    link: https://hub.docker.com/_/docker
    target: _blank
  - name: Docker Engine Security
    link: https://docs.docker.com/engine/security/
    target: _blank
---

# Docker

![Docker logo](/icons/docker.svg){.doc-image}

The workspace comes with everything Docker needs preinstalled, so you can build and run containers from its terminal.

## Enable Docker

Set this variable when you start the workspace:

- <EnvVar group="docker" name="enable_client" />

```sh{2}
docker run \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.6.0
```

Methods 1 and 2 below need `WS_DOCKER_ENABLE_CLIENT`: without it, the Docker daemon never starts.
With method 3, the daemon stays off, and the variable only checks that the socket's group matches the `docker` group.
Methods 4 to 6 connect through `DOCKER_HOST` instead.

## Docker in Docker

Docker in Docker *(dind)* runs containers inside the workspace container, to create sandboxed container environments.
Docker does not support this natively, so pick one of the six methods below, each with its own risks and trade-offs.

::: warning
These methods are written for a Linux host.
On a Windows host, they may not work as described.
:::

The diagram below shows the basic Docker architecture, and each method shows the part of it that applies.

![Docker architecture](/tools/docker/architecture.png)

::: warning
Methods 3, 4, 5, and 6 connect, each in its own way, to the Docker daemon running on the **remote host**.
All *paths* and *ports* then refer to the **remote host**, not to the workspace.

If you only use Docker to build images, you can skip this warning.
:::

### 1. Use Sysbox *(Suggested)*

[Sysbox](https://github.com/nestybox/sysbox) is the recommended method for running Docker in Docker securely.
It lets containers act as virtual machines, with stronger isolation and no privileged mode.

Once Sysbox is installed, run the workspace with the `sysbox-runc` runtime:

```sh{2,3}
docker run \
  --runtime=sysbox-runc \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.6.0
```

### 2. Run `dockerd` in the Container

This method starts the Docker daemon *(`dockerd`)* directly inside the container.
The container must run in **privileged** mode:

```sh{2,3}
docker run \
  --privileged \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.6.0
```

### 3. Mount the Docker Socket From the Host

![Host mount](/tools/docker/host-mount.png)

Mount the host's Docker socket into the workspace:

```sh{2,3}
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.6.0
```

To give the workspace access to the socket, match its group as [Docker Group](#docker-group) shows.

### 4. Connect to a Remote Host *(TCP)*

![TCP](/tools/docker/tcp.png)

With access to a remote host that runs Docker, set `DOCKER_HOST` *(replace `<remote>` with your node's IP)*:

```sh{2}
docker run \
  -e DOCKER_HOST=tcp://<remote>:2375 \
  ghcr.io/kloudkit/workspace:v0.6.0
```

To connect [securely][protect-tls] instead, use port `2376` with pregenerated key pairs.

### 5. Connect to a Remote Host *(SSH)*

![SSH](/tools/docker/ssh.png)

With SSH access to a [remote host that runs Docker][protect-ssh], set `DOCKER_HOST`
*(replace `<remote>` and `<user>` with your node's IP and username)*:

```sh{2}
docker run \
  -e DOCKER_HOST=ssh://<user>@<remote> \
  ghcr.io/kloudkit/workspace:v0.6.0
```

The workspace's SSH client reuses each connection for 10 minutes *(`ControlPersist 10m`)*,
so repeated Docker commands over SSH connect quickly.

### 6. Use `docker:dind` on a Remote Host

![DIND](/tools/docker/dind.png)

Run the [`docker:dind`][dind] image in three steps:

1. Create a shared network for both containers *(workspace and dind)*:

    ```sh
    docker network create dind
    ```

2. Run the *dind* container without TLS *(`DOCKER_TLS_CERTDIR=""`)*.
    To use TLS, follow these [instructions][protect-tls] instead.

    ```sh
    docker run \
      --privileged \
      --name dind \
      --net dind \
      -v workspace:/workspace:ro \
      -e DOCKER_TLS_CERTDIR="" \
      docker:dind
    ```

3. Run the workspace container on the same network:

    ```sh
    docker run \
      -e DOCKER_HOST=tcp://dind:2375 \
      -v workspace:/workspace \
      --net dind \
      ghcr.io/kloudkit/workspace:v0.6.0
    ```

::: info
From a running workspace, you can use the `docker context` command instead of the `DOCKER_HOST` environment variable.
:::

## Docker Group

By default, the `docker` group in the workspace has the ID `990`.
With a mounted host socket, the workspace needs access to the host's `docker.sock`.

Add the socket's group to the container with the `--group-add` flag,
so the group on the host matches a group inside the container:

```sh{2}
docker run \
  --group-add=8888 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.6.0
```

Replace `8888` with the group ID of `docker.sock` on your host.
To find it, list the socket with numeric IDs and read the fourth column:

```sh
ls -ln /var/run/docker.sock
```

In Kubernetes, add the group with `supplementalGroups`:

```yaml{3,4}
# ...
securityContext:
  supplementalGroups:
    - 8888
# ...
```

[dind]: https://hub.docker.com/_/docker/tags?page=1&name=dind
[protect-tls]: https://docs.docker.com/engine/security/protect-access/#use-tls-https-to-protect-the-docker-daemon-socket
[protect-ssh]: https://docs.docker.com/engine/security/protect-access/#use-ssh-to-protect-the-docker-daemon-socket
