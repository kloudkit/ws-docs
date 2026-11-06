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

Kloud Workspace comes preinstalled with `helm`, its shell completion, and the Kubernetes VS Code
extension *(which integrates with Helm)*.
The `helm diff` and `helm unittest` plugins come with the
[`helm-extras` feature](/editor/features#available-features).

## Persisting Configurations

Kloud Workspace runs in a Docker container, so any custom Helm configurations, such as
added repositories and credentials, will not automatically persist after the container
stops.

To retain these configurations across workspace restarts or updates:

1. **Mount a Volume for Your Helm Directory:**
  By default, Helm stores configuration files in `~/.config/helm`.
  Mounting a volume or bind-mount to this location ensures your repositories,
  credentials, and related files remain intact even if the container is re-created.

2. **Use the `WS_HELM_PRELOAD_CACHE` Environment Variable:**
  You can streamline the process of autoloading Helm’s repository cache by setting the
  `WS_HELM_PRELOAD_CACHE` environment variable.
  This causes the workspace to automatically load your cached repos whenever it starts.

```sh
docker run \
  -e WS_HELM_PRELOAD_CACHE=1 \
  -v helm:/home/kloud/.config/helm \
  ghcr.io/kloudkit/workspace:v0.5.3
```
