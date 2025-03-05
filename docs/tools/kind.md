---
see:
  - name: Docker
    link: /tools/docker
  - name: Kind Configuration Options
    link: https://kind.sigs.k8s.io/docs/user/configuration
---

# Kind

## Overview

![Kind logo](/icons/kind.png){.doc-image width=200px}

Kind *(Kubernetes IN Docker)* is a tool for running local Kubernetes clusters using Docker
containers as nodes.
It is primarily used for testing Kubernetes itself or for developing Kubernetes
applications in a local environment.

::: warning
This documentation assumes you are **not** using [`sysbox`][sysbox] or [`dockerd`][dockerd]
as your Docker runtime.
:::

## Custom Cluster Configuration

Custom configurations can be stored in a `yaml` file of your choice.
To create a cluster with custom configurations, for example in `my-config.yaml`, run the
following command:

```sh
touch my-config.yaml
# ... edit configurations as described below
# ... before deploying the cluster
kind create cluster --config my-config.yaml
```

## Adjust the Cluster IP

By default, a *Kind* cluster is only accessible at `127.0.0.1` *(from the current host)*.
When using a remote Docker engine *(or a mapped `docker.sock`)*, you must adjust this
setting, as `127.0.0.1` resolves to the internal address of your workspace.

To make the cluster accessible on the host network, change the listening address to
`0.0.0.0` *(or the appropriate IP, if using a remote engine)* in your cluster
configuration file:

```yaml{4}
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  apiServerAddress: 0.0.0.0
# ... additional configurations follow
```

## Update `KUBECONFIG`

After cluster deployment, update the `KUBECONFIG` to communicate with the API server
using the host IP for the `cluster.server` address:

```yaml{4}
apiVersion: v1
clusters:
- cluster:
    server: https://192.168.1.120:6443
    certificate-authority-data: DATA+OMITTED
  name: created-by-kind
# ... additional configurations follow
```

[dockerd]: /tools/docker
[sysbox]: /tools/docker#_1-use-sysbox-suggested
