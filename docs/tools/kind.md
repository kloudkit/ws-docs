---
description: "Run local Kubernetes clusters in Docker containers from Kloud Workspace with the preinstalled kind, for testing and local development."
see:
  - name: Docker
    link: /tools/docker
  - name: Helm
    link: /tools/helm
  - name: Kind Configuration Options
    link: https://kind.sigs.k8s.io/docs/user/configuration
    target: _blank
---

# Kind

![Kind logo](/icons/kind.png){.doc-image width=200px}

The workspace comes with kind *(Kubernetes IN Docker)* preinstalled,
for local Kubernetes clusters that use Docker containers as nodes.

## Create a Cluster

With [Sysbox][sysbox] *(method 1 on the Docker page)*, the Docker daemon runs inside the workspace,
so a cluster with the default settings works as is:

```sh
kind create cluster
kubectl get nodes
```

## Custom Cluster Configuration

Keep custom settings in a YAML file of your choice, such as `my-config.yaml`, and create the cluster from it:

```sh
touch my-config.yaml
# ... edit configurations as described below
# ... before deploying the cluster
kind create cluster --config my-config.yaml
```

## Adjust the Cluster IP

By default, a kind cluster is only accessible at `127.0.0.1` *(from the current host)*.
With a remote Docker engine *(or a mapped `docker.sock`)*, you must adjust this setting,
as `127.0.0.1` resolves to the internal address of your workspace.

Set `apiServerAddress` to the Docker host's IP and pin `apiServerPort` in your cluster configuration file:

```yaml{4,5}
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  apiServerAddress: 192.168.1.120
  apiServerPort: 6443
# ... additional configurations follow
```

kind puts that address in the API server certificate and in the kubeconfig it writes,
so `kubectl` reaches the cluster without further edits.
Without `apiServerPort`, kind picks a random port.

[sysbox]: /tools/docker#_1-use-sysbox-suggested
