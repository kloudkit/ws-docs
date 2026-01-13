---
see:
  - name: Docker in Docker
    link: https://www.google.com/search?q=run+docker+in+docker
    target: _blank
---

# Docker in Workspace

## Overview

![Docker logo](/icons/docker.svg){.doc-image}

The workspace comes pre-packaged with all the requirements to run Docker.

Running Docker inside an existing Kloud Workspace container is not natively supported by
Docker.
However, there are alternative methods to achieve this, each with its trade-offs.

::: info
Since this topic is widely documented online, we will not delve into the various risks and
tradeoffs of each method.

You can read more about this topic by running a simple Google search for
[`"run docker in docker"`](https://www.google.com/search?q=run+docker+in+docker).
:::

Throughout this page, we will refer to the diagram below which illustrates the basic
Docker architecture.
The subsequent sections might present a partial perspective of the complete architecture.

![Docker architecture](/tools/docker/architecture.png)

::: warning
The documentation below is tailored for use on a Linux host.
Running Docker on Windows may introduce various discrepancies that could impact the
applicability and effectiveness of the provided solutions.
:::

## Docker In Docker

Docker In Docker *(also known as dind)* allows developers to run a Docker container within
an already running Docker container, in order to create sandboxed container environments.

There are five possible methods to accomplish this:

::: warning CAVEAT
Options `#3`, `#4`, `#5`, and `#6` utilize different forms of remote connections to the
Docker daemon running on the **remote host**.
As such, all *paths* and *ports* are relative to the **remote host** and not the running
workspace.

If your intention is solely to utilize Docker for building purposes, feel free to ignore
the information provided above.
:::

### 1. Use [`sysbox`](https://github.com/nestybox/sysbox) ***(suggested)***

`Sysbox` is the recommended method for securely running Docker in Docker.
It enables containers to act as virtual machines by improving isolation without
requiring privileged mode.

Once `sysbox` is installed, run the workspace using the `sysbox-runc` runtime:

```sh{2,3}
docker run \
  --runtime=sysbox-runc \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.1.1
```

### 2. Run `dockerd` in the Container

This approach allows you to start the Docker daemon *(`dockerd`)* directly within the
container.
However, this requires the container to run in **privileged** mode:

```sh{2,3}
docker run \
  --privileged \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.1.1
```

### 3. Mounting the Docker Socket From the Host

![Host mount](/tools/docker/host-mount.png)

```sh{2,3}
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.1.1
```

### 4. Connect to a Remote Host *(TCP)*

![TCP](/tools/docker/tcp.png)

Assuming you have access to a remote host running docker, you can set the value of
`DOCKER_HOST` as follows *(replace `<remote>` with your node's IP)*:

```sh{2}
docker run \
  -e DOCKER_HOST=tcp://<remote>:2375 \
  ghcr.io/kloudkit/workspace:v0.1.1
```

Alternately, you can run the command above [securely][protect-tls] using port `2376` and
pregenerated key-pairs.

### 5. Connect to a Remote Host *(SSH)*

![SSH](/tools/docker/ssh.png)

Assuming you have SSH access to a [remote host running docker][protect-ssh], you can set
the value of `DOCKER_HOST` as follows
*(replace `<remote>` and `<user>` with your node's IP and username)*:

```sh{2}
docker run \
  -e DOCKER_HOST=ssh://<user>@<remote> \
  ghcr.io/kloudkit/workspace:v0.1.1
```

This method is optimized by the workspace as we internally configure a persistent
`ssh-agent` behind the scenes for a quicker connection experience.
For more information, visit our documentation on [`ssh`](/tools/ssh)

### 6. Use [`docker:dind`][dind] Running on a Remote Host

![DIND](/tools/docker/dind.png)

This process is split into 3 steps:

1. Create a shared network for both containers *(workspace and dind)*:

    ```sh
    docker network create dind
    ```

2. Run the *dind* container without TLS shares. Follow these [instructions][protect-tls]
    if you decide to use TLS.

    ```sh
    docker run \
      --privileged \
      --name dind \
      --net dind \
      -v workspace:/workspace:ro \
      -e DOCKER_TLS_CERTDIR="" \
      docker:dind
    ```

3. Finally, run the workspace container using the same network as above.

    ```sh
    docker run \
      -e DOCKER_HOST=tcp://dind:2375 \
      -v workspace:/workspace \
      --net dind \
      ghcr.io/kloudkit/workspace:v0.1.1
    ```

::: info NOTE
Feel free to use the `docker context` command instead of the `DOCKER_HOST` environment
variable from within a running workspace.
:::

## Automatically Configure the Docker Daemon

Certain methods mentioned earlier *(`#1`, `#2`, and `#3`)* may require additional user
permissions for interacting with the Docker socket.
In certain instances *(specifically, `#1` and`#2`)*, the daemon may not be running upon
startup.

To speed up the process, during initialization, assign the `WS_DOCKER_ENABLE_CLIENT`
environment variable to effortlessly initiate the daemon *(if necessary)*:

```sh{2}
docker run \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.1.1
```

### Docker Group

By default, the group assigned to `docker` is `999`.
When working with host mounts, it's essential to ensure that the `docker.sock` file on
the host is accessible within the container.

To make sure the container has the necessary group access to the Docker socket, you can
use the `--group-add` flag.
This allows you to match the group from the host system to the group inside the
container, ensuring the container has the appropriate permissions, as seen below:

```sh{2}
docker run \
  --group-add=8888
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e WS_DOCKER_ENABLE_CLIENT=1 \
  ghcr.io/kloudkit/workspace:v0.1.1
```

Make sure to replace `8888` with the appropriate group ID from your host system.
You can find the group ID associated with `docker.sock` by checking the permissions:

```sh
ls -l /var/run/docker.sock
```

The same can be achieved in Kubernetes by using `supplementalGroups`:

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
