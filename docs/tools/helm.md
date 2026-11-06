---
description: "Helm comes preinstalled in Kloud Workspace with shell completion and the Kubernetes VS Code extension, plus plugins through the helm-extras feature."
see:
  - name: Kind
    link: /tools/kind
  - name: Storage
    link: /editor/storage
  - name: Helm Configurations
    link: https://helm.sh/docs/helm/helm/
    target: _blank
---

# Helm

![Helm logo](/icons/helm.svg){.doc-image width=200px}

Kloud Workspace comes preinstalled with `helm`, its shell completion,
and the Kubernetes VS Code extension *(which integrates with Helm)*.
The `helm diff` and `helm unittest` plugins come with the [`helm-extras` feature](/editor/features#available-features).

## Persisting Configurations

Kloud Workspace runs in a Docker container,
so any custom Helm configurations, such as added repositories and credentials, are lost when the container is recreated.

To keep these configurations when the container is recreated, for example on an update:

1. **Mount a Volume for Your Helm Directory:**
   By default, Helm stores configuration files in `~/.config/helm`.
   Mount a volume or bind-mount at this location,
   so your repositories, credentials, and related files remain intact when the container is recreated.

2. **Set the `WS_HELM_PRELOAD_CACHE` Environment Variable:**
   With it set, the workspace runs `helm repo update` for the repositories in your persisted config
   when a new container starts, so their indexes are ready.

```sh
docker run \
  -e WS_HELM_PRELOAD_CACHE=1 \
  -v helm:/home/kloud/.config/helm \
  ghcr.io/kloudkit/workspace:v0.6.0
```
