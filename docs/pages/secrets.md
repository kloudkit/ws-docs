# Secrets

## Types

- ENV
- Kubernetes Config
- SSH

```bash
export OP_SECRETS_SPEC='[
  {"type": "ssh", "secret": "ssh:github", "field": "credential",
    "dest": "folder/id_rsa" },
  {"type": "kube", "secret": "k8s", "field": "config" }
]'
```
