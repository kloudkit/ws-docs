---
description: "Encrypt passwords, API keys and SSH keys in Kloud Workspace with the ws-cli secrets command instead of storing them in plaintext."
see:
  - name: Seed
    link: /settings/seed
  - name: ws-cli secrets Reference
    link: /tools/ws-cli#ws-cli-secrets
  - name: Authentication
    link: /editor/authentication
---

# Secrets

![Secrets](/icons/secrets.svg){.doc-image}

Encrypt database passwords, API keys, SSH keys and authentication tokens with `ws-cli secrets`,
instead of storing them in plaintext or version control.

The `ws-cli secrets` command encrypts secrets with **AES-256-GCM**, using a key derived from your
master key with Argon2id.

## Master Keys

A master key is required to encrypt and decrypt secrets.

### Generate a Master Key

```sh
# Standard master key
ws-cli secrets generate master --output .master.key --mode 0o600

# Longer 64-byte key
ws-cli secrets generate master --length 64 --output .master.key

# Output to stdout (CI/CD)
ws-cli secrets generate master --raw
```

The `--mode` flag sets file permissions *(e.g., `0o600` for owner-only access)*.
Write octal with the `0o` prefix; a value without it is read as decimal.

### Master Key Lookup

Point `ws-cli` at your key with:

- <EnvVar group="secrets" name="master_key" />

The master key is read from the first of:

1. The `--master` flag *(a path to an existing file, or the key itself)*.
2. `WS_SECRETS_MASTER_KEY` set to the key.
3. `WS_SECRETS_MASTER_KEY` set to `file:/path/to/key`.
4. A file mounted at `/run/secrets/workspace/secrets/master_key`.

```sh
export WS_SECRETS_MASTER_KEY=file:./master.key
ws-cli secrets encrypt "my-secret"
```

::: warning
`--master` takes any value that is not an existing file as the key itself, so a mistyped path
silently encrypts with the wrong key.
:::

## Encryption & Decryption

### Basic Usage

```sh
# Encrypt
ws-cli secrets encrypt "my-secret" --master .master.key

# Decrypt
ws-cli secrets decrypt "encrypted-value" --master .master.key

# Encrypt/Decrypt to files
ws-cli secrets encrypt "my-secret" --output encrypted.txt --master .master.key
ws-cli secrets decrypt "..." --output secret.txt --mode 0o600 --master .master.key
```

Both commands also read `stdin` when given `-`, and encrypted values may span several lines for
readability:

```sh
echo "my-secret" | ws-cli secrets encrypt - --master .master.key
cat encrypted.txt | ws-cli secrets decrypt - --master .master.key
```

## Seed

The [seed manifest](/settings/seed) decrypts secrets into files for you: inline `${secrets.NAME}`
values in templated entries, and whole files marked `secret: true`.

## Authentication Passwords

Generate *Argon2id* password hashes for workspace login:

```sh
PASSWORD=$(echo -n "password" | ws-cli secrets generate login --raw)
```

Use in Docker deployments:

```sh
docker run \
  -e WS_AUTH_PASSWORD_HASHED="$PASSWORD" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

## Quick Reference

### Common Flags

- **`--master <key>`:** Master key, or the path to a file holding it.
- **`--output <file>`:** Write to file.
- **`--mode <perm>`:** File permissions, as `0o`-prefixed octal or decimal *(default `0o600`)*.
- **`--raw`:** Disable styling.
- **`--force`:** Overwrite existing files.
