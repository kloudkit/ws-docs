# Using Docker

## Overview

The workspace comes pre-packaged with all the requirements to run Docker.

It is important to understand that the concept of running Docker from within an existing
container *(workspace)* is not something that is supported natively by Docker.
Nonetheless, there are a few ways methods of execution that should suite your needs.

::: info
Since this topic is widely documented online, we will not delve into the various risks and
tradeoffs of each method.

You can read more about this topic by running a simple Google search for
[`"run docker in docker"`](https://www.google.com/search?q=run+docker+in+docker).
:::

Throughout this page, we will refer to the diagram below which illustrates the basic
Docker architecture.
The subsequent sections might present a partial perspective of the complete architecture.

![Docker architecture](/docker/architecture.png)

## Docker In Docker

Docker In Docker *(also known as dind)* allows developers to run a Docker container within
an already running Docker container, in order to create sandboxed container environments.

There are five possible methods to accomplish this:

::: warning CAVEAT
Options `#2`, `#3`, `#4`, and `#5` utilize different forms of remote connections to the
Docker daemon running on the remote host.
As such, all *paths* and *ports* are relative to the remote host and not the running
workspace.

If your intention is solely to utilize Docker for building purposes, feel free to ignore
the information provided above.
:::

### 1. Use [`sysbox`](https://github.com/nestybox/sysbox) ***(suggested)***

Once `sysbox` is installed, run the workspace using the `sysbox-runc` runtime:

```sh{2}
docker run \
  --runtime=sysbox-runc \
  ghcr.io/kloudkit/workspace:latest
```

### 2. Mounting the Docker Socket From the Host

![Host mount](/docker/host-mount.png)

```sh{2}
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  ghcr.io/kloudkit/workspace:latest
```

### 3. Connect to a Remote Host *(TCP)*

![TCP](/docker/tcp.png)

Assuming you have access to a remote host running docker, you can set the value of
`DOCKER_HOST` as follows *(replace `<remote>` with your node's IP)*:

```sh{2}
docker run \
  -e DOCKER_HOST=tcp://<remote>:2375 \
  ghcr.io/kloudkit/workspace:latest
```

Alternately, you can run the command above [securely][protect-tls] using port `2376` and
pregenerated key-pairs.

### 4. Connect to a Remote Host *(SSH)*

![SSH](/docker/ssh.png)

Assuming you have SSH access to a [remote host running docker][protect-ssh], you can set
the value of `DOCKER_HOST` as follows
*(replace `<remote>` and `<user>` with your node's IP and username)*:

```sh{2}
docker run \
  -e DOCKER_HOST=ssh://<user>@<remote> \
  ghcr.io/kloudkit/workspace:latest
```

This method is optimized by the workspace as we internally configure a persistent
`ssh-agent` behind the scenes for a quicker connection experience.
For more information, visit our documentation on [`ssh`](/tools/ssh)

### 5. Use [`docker:dind`][dind] Running on a Remote Host

![DIND](/docker/dind.png)

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
      ghcr.io/kloudkit/workspace:latest
    ```

::: info NOTE
Feel free to use the `docker context` command instead of the `DOCKER_HOST` environment
variable from within a running workspace.
:::

## Automatically Configure the Docker Daemon

Certain methods mentioned earlier *(`#1` and `#2`)* may require additional user
permissions for interacting with the Docker socket.
In certain instances *(specifically, `#1`)*, the daemon may not be running upon startup.

To streamline the process, during initialization, assign the `WS_CONFIGURE_DOCKER`
environment variable to effortlessly grant all required permissions and initiate the
daemon *(if necessary)*:

```sh{2}
docker run \
  -e WS_CONFIGURE_DOCKER=1 \
  ghcr.io/kloudkit/workspace:latest
```

[dind]: https://hub.docker.com/_/docker/tags?page=1&name=dind
[protect-tls]: https://docs.docker.com/engine/security/protect-access/#use-tls-https-to-protect-the-docker-daemon-socket
[protect-ssh]: https://docs.docker.com/engine/security/protect-access/#use-ssh-to-protect-the-docker-daemon-socket
