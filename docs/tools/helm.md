---
see:
  - name: Storage
    link: /editor/storage
  - name: HELM Configurations
    link: https://helm.sh/docs/helm/helm/
    target: _blank
---

# HELM

![HELM logo](/icons/helm.svg){.doc-image width=200px}

Kloud Workspace comes pre-installed with `helm`, auto-completion, the `helm diff` plugin,
and VSCode extensions for Kubernetes *(which integrates with HELM)*, all ready to use
right out of the box.

## Persisting Configurations

Kloud Workspace runs in a Docker container, so any custom HELM configurations—such as
added repositories and credentials—will not automatically persist after the container
stops.

To retain these configurations across workspace restarts or updates:

1. **Mount a Volume for Your HELM Directory:**
  By default, HELM stores configuration files in `~/.config/helm`.
  Mounting a volume or bind-mount to this location ensures your repositories,
  credentials, and related files remain intact even if the container is re-created.

2. **Use the `WS_HELM_PRELOAD_CACHE` Environment Variable:**
  You can streamline the process of autoloading HELM’s repository cache by setting the
  `WS_HELM_PRELOAD_CACHE` environment variable.
  This causes the workspace to automatically load your cached repos whenever it starts.

```sh
docker run \
  -e WS_HELM_PRELOAD_CACHE=1 \
  -v helm:/home/kloud/.config/helm \
  ghcr.io/kloudkit/workspace:v0.1.0
```
