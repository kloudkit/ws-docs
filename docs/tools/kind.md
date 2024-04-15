---
see:
  - name: Docker
    link: /tools/docker
  - name: All Configuration Options
    link: https://kind.sigs.k8s.io/docs/user/configuration
---

# Kind

Kind *(Kubernetes IN Docker)* is a tool for running local Kubernetes clusters using
Docker container as *nodes*.
It is primarily used for testing Kubernetes itself, or for developing Kubernetes
applications in a local environment.

::: warn
The documentation below assumes you are **not** using [`sysbox`][sysbox] as you Docker
runtime.
:::

## Custom Configuration

Custom configuration can be stored in a `yaml` file of your choice and used with
the `kind create cluster --config my-config.yaml`.

### Cluster IP

For security reasons, a *kind* cluster is configured by default to be accessible at
`127.0.0.1`.
When using a remote Docker engine, it's necessary to adjust this setting, as the IP
address resolves to the internal address of the current *workspace*.

To make the cluster accessible on the network of the running host, change the listening
address to `0.0.0.0` *(or to a specific host IP)*:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  apiServerAddress: 0.0.0.0
# ... more custom configurations follow
```

Once deployed, you will need to update the `KUBECONFIG` to communicate with the API server
using the host IP for the `cluster.server` address.

```yaml
apiVersion: v1
clusters:
- cluster:
    server: https://192.168.1.120:6443
    certificate-authority-data: DATA+OMITTED
  name: created-by-kind
# ... more custom configurations follow
```

[sysbox]: /tools/docker#_1-use-sysbox-suggested
