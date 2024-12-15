# Storage

![Storage](/icons/storage.svg){.doc-image width=180px}

By default, Docker storage is [*ephemeral*](https://www.merriam-webster.com/dictionary/ephemeral),
meaning any data created inside a container is lost when the container stops, exits, or is
removed.

This ephemeral design ensures containers are lightweight and stateless, but it limits
their suitability for use cases that require persistent data.

## Persistent Storage

To retain data across container restarts *(or share it between containers)*, persistent
storage is essential.
This is achieved by attaching external storage to the container, enabling data to be
saved and accessed independently of the container's lifecycle.

One common method to implement persistent storage is by mounting a **named volume** to a
specific directory within the container.
Named volumes are managed by Docker, offering an efficient way to store and retrieve data
without dealing directly with the host file system.

::: tip Best Practice
For simplicity and consistency, we recommend using **named volumes** over bind mounts
whenever possible.
:::

### Mounting a Named Volume

To persist data using the *workspace* directory in a container, mount a volume to
`/workspace`:

```sh{2}
docker run \
  -v workspace:/workspace \
  ghcr.io/kloudkit/workspace:latest
```

In the command above:

- The volume is named `workspace` *(you can use any name)*.
- The volume is mounted to the `/workspace` directory inside the container.
- Docker automatically creates the volume on first execution.

Alternatively, you can manually create the volume:

```sh
docker volume create workspace
```

To list all existing volumes:

```sh
docker volume ls
```

## Named Volumes vs. Bind Mounts

When configuring persistent storage, it’s important to understand the difference between
**named volumes** and **bind mounts**.

### Named Volumes

- Managed by Docker and stored in a Docker-controlled location on the host.
- Abstracted from the host file system, offering ease of use and portability.
- The initial content of the container directory is copied to the volume automatically.

### Bind Mounts

- Directly link a specific directory or file on the host system to the container.
- Provide greater control but require explicit paths and manual host management.
- Can cause conflicting file ownership and permissions.
- When using *Windows* based mounts, all files will have an insecure mode of `777`.
- When using *Linux* based mounts, there may be an ownership discrepancy.

## Kubernetes

When working with Kubernetes, we recommend creating a single `PersistentVolumeClaim` to
manage the entire workspace efficiently.
This approach simplifies volume management by utilizing *sub-paths* within the workspace.

The following demonstrates this practice
*(note that the paths and names are provided for illustrative purposes only)*:

```yaml{5,9}
# Pod specs
volumeMounts:
  - name: data
    mountPath: /workspace
    subPath: workspace

  - name: data
    mountPath: /home/kloud/.cache/history
    subPath: history

volumes:
  - name: data
```
