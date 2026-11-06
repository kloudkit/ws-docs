---
description: "Keep your files and workspace configuration when a Kloud Workspace container is recreated, by persisting /workspace and ~/.ws."
see:
  - name: Autoload Scripts
    link: /settings/autoload-scripts
  - name: Extensions
    link: /editor/extensions
  - name: Seed
    link: /settings/seed
  - name: TLS & Certificates
    link: /settings/tls
---

# Storage

![Storage](/icons/storage.svg){.doc-image width=180px}

Keep your files and the workspace's configuration when the container is recreated, by persisting
two directories: `/workspace` and `~/.ws`.

## Persistent Storage

Any data created inside a container is lost when the container is removed or recreated, for
example to upgrade the image.
To keep it *(or to share it between containers)*, mount a named volume on each directory:

```sh{2-3}
docker run \
  -v ws:/home/kloud/.ws \
  -v workspace:/workspace \
  ghcr.io/kloudkit/workspace:v0.6.0
```

In the command above:

- The volume named `workspace` is mounted on `/workspace`, the workspace root.
- The volume named `ws` is mounted on `~/.ws`, where the workspace keeps its configuration.
- You can use any volume names.
- Docker automatically creates each volume on first execution.

Alternatively, you can manually create a volume:

```sh
docker volume create workspace
```

To list all existing volumes:

```sh
docker volume ls
```

::: tip
For simplicity and consistency, use **named volumes** over bind mounts whenever possible.
:::

### Persisting `~/.ws`

Several workspace features store their configuration under `~/.ws` (`/home/kloud/.ws`),
including [sideloaded extensions](/editor/extensions), [startup and session scripts](/settings/autoload-scripts),
[drop-in CA certificates](/settings/tls#drop-in-directory-ws-ca-d),
the [seed source](/settings/seed), and your shell and REPL history (`~/.ws/history`).
Because this directory lives inside the container, its contents are lost when the container
is recreated, unless you persist it separately as shown above.

When a container is first created, `~/.ws` and its standard subdirectories *(not their
contents)* are re-owned by `kloud`, even when the mounted volume starts out owned by `root`.

## Kubernetes

With Kubernetes, create a single `PersistentVolumeClaim` for the entire workspace and mount
*sub-paths* of it, which keeps volume management simple.

The following demonstrates this practice *(the paths and names are for illustration only)*:

```yaml{5,9,13}
# Pod specs
volumeMounts:
  - name: data
    mountPath: /workspace
    subPath: workspace

  - name: data
    mountPath: /home/kloud/.ws
    subPath: ws

  - name: data
    mountPath: /home/kloud/.config/helm
    subPath: helm

volumes:
  - name: data
```

## Named Volumes vs. Bind Mounts

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
