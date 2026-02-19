---
see:
  - name: ws secrets Command Reference
    link: /tools/ws-cli#secrets-ws-secrets
    target: _self
  - name: Authentication
    link: /editor/authentication
    target: _self
---

# Secrets

![Vault](/icons/vault.svg){.doc-image}

Kloud Workspace applications often require sensitive credentials: database passwords, API
keys, SSH keys, and authentication tokens.
Storing these in plaintext or version control is insecure.

The `ws-cli secrets` command provides a means of managing secrets using
**strong Argon2 encryption**, ensuring safe retrieval in you the development environment.

## Master Keys

A master key is required to encrypt and decrypt secrets.

### Generate a Master Key

```sh
# Standard master key
ws secrets generate master --output .master.key --mode 0o600

# Longer 64-byte key
ws secrets generate master --length 64 --output .master.key

# Output to stdout (CI/CD)
ws secrets generate master --raw
```

The `--mode` flag sets file permissions *(e.g., `0o600` for owner-only access)*.

### Master Key Lookup

The master key will be retrieved from the following locations *(in order)*:

1. `--master` flag.
2. `WS_SECRETS_MASTER_KEY` environment variable.
3. `WS_SECRETS_MASTER_KEY_FILE` environment variable.
4. Default path: `/etc/workspace/master.key`

```sh
export WS_SECRETS_MASTER_KEY_FILE=./master.key
ws secrets encrypt "my-secret"
```

## Encryption & Decryption

### Basic Usage

```sh
# Encrypt
ws secrets encrypt "my-secret" --master .master.key

# Decrypt
ws secrets decrypt "encrypted-value" --master .master.key

# Encrypt/Decrypt to files
ws secrets encrypt "my-secret" --output encrypted.txt --master .master.key
ws secrets decrypt "..." --output secret.txt --mode 0o600 --master .master.key
```

Supports `stdin` input and *multiline encrypted values* for better readability:

```sh
echo "my-secret" | ws secrets encrypt - --master .master.key
cat encrypted.txt | ws secrets decrypt - --master .master.key
```

## Vault Management

YAML vaults allow bulk secret injection:

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

:::warn

Vault secrets can only be written to user-writable paths such as `$HOME`, `/workspace`, and `/tmp`.

System paths like `/etc/` and `/usr/` are protected by Linux file permissions since the workspace
runs as the `kloud` *(non-root)* user.

:::

### File References

For long encrypted values, store them in separate files using the `file:` prefix:

```yaml
secrets:
  ssh-private-key:
    encrypted: file:./secrets/ssh-key.enc
    destination: ~/.ssh/id_rsa
    type: ssh
```

File paths are relative to the current working directory.

### Secret Types

Each secret has a `type` field that determines how it's written and its default permissions:

| Type               | Destination   | Default Mode | Description                        |
| ------------------ | ------------- | ------------ | ---------------------------------- |
| `generic`          | File path     | `0o600`      | General-purpose secrets            |
| `ssh`              | File path     | `0o600`      | SSH private keys                   |
| `env`              | Variable name | `0o644`      | Written to `~/.zshenv`             |
| `kubeconfig`       | File path     | `0o600`      | Kubernetes config files            |
| `dockerconfigjson` | File path     | `0o600`      | Docker authentication config files |

- **`--destination`:** For file types *(generic, ssh, kubeconfig, dockerconfigjson)*, this is the
  file path where the secret will be written. Relative paths are resolved from `/workspace`.
  For `env` types, this is the environment variable name.
- **`--mode` *(optional)*:** File permissions in octal *(e.g., `0o600`)* or decimal *(e.g., `384`)*.
  If omitted, the default mode for the type is used.
- **`--type` *(optional)***.

### Vault Usage

Process vaults:

```sh
# All secrets
ws secrets vault --input vault.yaml --master .master.key

# Specific keys
ws secrets vault --input vault.yaml --key database-password --master .master.key

# Inspect values
ws secrets vault --input vault.yaml --stdout --master .master.key
```

### Autoloading

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

## Authentication Passwords

Generate *Argon2id* password hashes for workspace login:

```sh
PASSWORD=$(echo -n "password" | ws secrets generate login --raw)
```

Use in Docker deployments:

```sh
docker run \
  -e WS_AUTH_PASSWORD_HASHED=$PASSWORD \
  ghcr.io/kloudkit/workspace:v0.1.2
```

See [authentication documentation](/editor/authentication) for details.

## Quick Reference

### Common Flags

- **`--master <key>`:** Master key or file path.
- **`--output <file>`:** Write to file.
- **`--mode <perm>`:** File permissions *(octal or decimal)*.
- **`--raw`:** Disable styling.
- **`--force`:** Overwrite existing files.

### Vault Specific Flags

- **`--input <file>`:** Vault file path *(defaults to `~/.ws/vault/secrets.yaml`; override with `WS_SECRETS_VAULT`)*.
- **`--key <name>`:** Process specific secret *(repeatable)*.
- **`--stdout`:** Inspect without writing.

See [ws secrets command reference](/tools/ws-cli#secrets-ws-secrets) for complete syntax.
