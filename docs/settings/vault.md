---
see:
  - name: Secrets
    link: /settings/secrets
  - name: ws secrets Command Reference
    link: /tools/ws-cli#secrets-ws-secrets
    target: _self
---

# Vault

![Vault](/icons/vault.svg){.doc-image}

YAML vaults allow bulk secret injection into the workspace. Vaults build on the
[encryption primitives](/settings/secrets) provided by `ws-cli secrets` and add structured,
declarative secret management.

## Vault Format

A vault is a YAML file listing one or more secrets with their encrypted values,
destinations, and types:

```yaml
secrets:
  database-password:
    encrypted: Xy1z2A3...
    destination: /workspace/.secrets/db-password
    type: generic
    mode: 0o600

  api-key:
    encrypted: Ab1c2D3...
    destination: API_KEY
    type: env

  ssh-private-key:
    encrypted: Kl1m2N3...
    destination: ~/.ssh/id_rsa
    type: ssh
```

:::warning

Vault secrets can only be written to user-writable paths such as `$HOME`, `/workspace`, and `/tmp`.

System paths like `/etc/` and `/usr/` are protected by Linux file permissions since the workspace
runs as the `kloud` *(non-root)* user.

:::

## File References

For long encrypted values, store them in separate files using the `file:` prefix:

```yaml
secrets:
  ssh-private-key:
    encrypted: file:./secrets/ssh-key.enc
    destination: ~/.ssh/id_rsa
    type: ssh
```

File paths are relative to the current working directory.

## Secret Types

Each secret has a `type` field that determines how it's written and its default permissions:

| Type               | Destination   | Default Mode | Description                        |
| ------------------ | ------------- | ------------ | ---------------------------------- |
| `generic`          | File path     | `0o600`      | General-purpose secrets            |
| `ssh`              | File path     | `0o600`      | SSH private keys                   |
| `env`              | Variable name | `0o644`      | Written to `~/.zshenv`             |
| `kubeconfig`       | File path     | `0o600`      | Kubernetes config files            |
| `dockerconfigjson` | File path     | `0o600`      | Docker authentication config files |

- **`--destination`:** For file types *(generic, ssh, kubeconfig, dockerconfigjson)*, this
  is the file path where the secret will be written. Relative paths are resolved
  from `/workspace`.
  For `env` types, this is the environment variable name.
- **`--mode` *(optional)*:** File permissions in octal *(e.g., `0o600`)* or decimal *(e.g., `384`)*.
  If omitted, the default mode for the type is used.
- **`--type` *(optional)***.

## Processing a Vault

```sh
# All secrets
ws secrets vault --input vault.yaml --master .master.key

# Specific keys
ws secrets vault --input vault.yaml --key database-password --master .master.key

# Inspect values
ws secrets vault --input vault.yaml --stdout --master .master.key
```

## Autoloading

At startup the workspace automatically processes `~/.ws/vault/secrets.yaml` when it exists.
Place your vault manifest and any referenced encrypted files together in that directory:

```text
~/.ws/vault/
├── secrets.yaml        # vault manifest
├── db-password.enc     # encrypted file referenced via file:
└── ssh-key.enc
```

To use a different location, set `WS_SECRETS_VAULT`:

```sh
export WS_SECRETS_VAULT=/custom/path/vault/secrets.yaml
ws secrets vault
```

## Vault Flags

- **`--input <file>`:** Vault file
  path *(defaults to `~/.ws/vault/secrets.yaml`; override with `WS_SECRETS_VAULT`)*.
- **`--key <name>`:** Process specific secret *(repeatable)*.
- **`--stdout`:** Inspect without writing.

See [ws secrets command reference](/tools/ws-cli#secrets-ws-secrets) for complete syntax.
