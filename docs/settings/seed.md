---
description: Copy files and secrets from a durable seed directory onto the workspace filesystem when a new container starts, limited to the paths you own.
see:
  - name: Secrets
    link: /settings/secrets
  - name: Autoload Scripts
    link: /settings/autoload-scripts
  - name: Storage
    link: /editor/storage
---

# Seed

![Seed](/icons/seed.svg){.doc-image}

Seed copies files and secrets from a durable source directory onto the filesystem each time a
new container starts.
Fill the source once, and every new container gets the files, with no hand-run setup scripts.

- **Source:** <EnvVar group="seed" name="source" /> *(default `~/.ws/seed.d`)*.
  An empty or absent directory does nothing.
- **Contents:** plain **bare files**, copied as they are, and one **`.seed.yaml` manifest** at the
  source root that adds merge, templating and secrets on top of them.
- **Runs:** when a new container starts, after directory setup, CA trust and the 1Password
  import, and before the other startup scripts *(yours included)*.
- **Writes:** only where you own the destination, anywhere your account owns the nearest existing
  parent directory.

## Seed Your First Files

This source gives every new container an SSH config and a line in `~/.zshenv`:

```text
~/.ws/seed.d/.seed.yaml
~/.ws/seed.d/home/kloud/.ssh/config
```

Create both from a workspace terminal, then apply them:

```sh
mkdir -p ~/.ws/seed.d/home/kloud/.ssh

cat > ~/.ws/seed.d/home/kloud/.ssh/config <<'EOF'
Host github.com
  User git
EOF

cat > ~/.ws/seed.d/.seed.yaml <<'EOF'
version: v1

seeds:
  ~/.zshenv:
    op: lineinfile
    content: "export EDITOR=vim\n"
EOF

ws-cli seed apply
```

`~/.ssh/config` is a bare file: its path under the source is its path on disk.
`~/.zshenv` comes from the manifest, which keeps the `export EDITOR=` line in place and never adds
it twice.
Keep `~/.ws` on a volume, and every new container applies the same source at startup.

## Bare Files

The path under the source maps directly onto the root filesystem:

```text
~/.ws/seed.d/home/kloud/.ssh/config           →  ~/.ssh/config
~/.ws/seed.d/home/kloud/.config/app/env.json  →  ~/.config/app/env.json
```

A home file therefore lives at `seed.d/home/kloud/<path>`, not at the source root.
Bare files are copied as they are, with mode `644` *(new directories `744`)*, and never written
if the destination already exists, unless [forced](#write-if-absent-and-force).
Files the image already ships, such as `~/.gitconfig`, are skipped for that reason.

## The Manifest

A single hidden `.seed.yaml` at the source root declares behaviors.
It opens with a `version` key and two sections:

```yaml
version: v1

secrets:
  GH_TOKEN: <salt>$<ciphertext>   # from ws-cli secrets encrypt, or file:/run/secrets/gh_token

seeds:
  ~/.config/app/settings.json:
    op: merge

  ~/.ssh/id_ed25519:
    secret: true

  ~/.zshenv:
    op: lineinfile
    content: "export EDITOR=vim\n"
```

The `seeds:` map is **keyed by destination**.
In a key, `~` and the variables `${ws_home}` *(your home directory)*, `${ws_user}` *(your user
name)* and `${ws_server_root}` *(the workspace root, `WS_SERVER_ROOT`)* expand.
Other `$VAR` references in a key expand from the environment too, and an unset one becomes empty.

Each entry's source follows from its key: the file at the matching path under the source
*(`<source>/<dest-without-leading-slash>`)*, or an inline `content:` literal.
Outside `secret: true` entries, there is no `file:` pointer inside `seeds:`.

Each entry must carry at least one behavior: `secret`, `mode`, a non-`copy` `op`, `template` or
an inline `content:`.
A plain copy needs no entry, because a bare file already does that, so an entry with none of these
is a parse error.

When a destination is produced by both a bare file and a manifest entry, the manifest entry wins.

## Write-If-Absent and Force

The default is **write-if-absent**: an entry writes only when the destination is missing.
Paths that do not persist get their files again in every new container, and a file you edited on
a persistent volume is kept.
To overwrite an existing destination, set `force: true` on the entry or pass `--force` to apply
everything again.
For `merge`, `force` gates the merge too: without it, an existing destination is left alone.

## Operations

`op` is one of `copy` *(default)*, `merge`, `append`, `prepend`, `block` or `lineinfile`.

### Merge

`merge` deep-merges structured data, with the format inferred from the destination extension
*(`.json`, `.yaml`, `.toml`)*.
Maps merge recursively, scalars override, and **lists replace** wholesale.
A scalar-versus-map conflict at a key is a hard error that leaves the destination unchanged.

```yaml
seeds:
  ~/.config/app/config.json:
    op: merge
    content: '{"telemetry": false}'
```

### Append and Prepend

`append` and `prepend` add `content` to the end or start of the destination.

::: warning

`append` and `prepend` follow the same [write-if-absent](#write-if-absent-and-force) rule as every
entry: an existing destination is skipped unless forced.

Forced, they apply again in every new container and add the content each time, so it piles up
*(if a persistent volume is mounted)*.

To add a single line only once, use [`op: lineinfile`](#managed-lines); to manage a region, use
[`op: block`](#managed-blocks).

:::

### Managed Blocks

`op: block` manages a marked region inside a file.

It wraps `content` between two marker lines and updates that block in place each time seed runs,
without duplicating it, even when the content changes:

```yaml
seeds:
  ~/.zshenv:
    op: block
    content: "export EDITOR=vim\n"
```

The first apply appends the block and inserts the markers for you:

```text
# >>> ws-seed >>>
export EDITOR=vim
# <<< ws-seed <<<
```

Later applies find those markers and replace only the body between them, so the region never
duplicates and tracks content changes.

You never write the markers by hand.
A missing file is created; an existing file keeps its content and gains the block at the end.

`block` ignores `force`: it is safe to run again, and rewrites the file only when the block's
contents change.
Malformed markers *(a begin without an end, or markers out of order)* are a hard error that leaves
the destination unchanged.

The marker text is fixed, but its comment prefix defaults to `#` and is set per entry with `comment`
for files where `#` is not a comment:

```yaml
seeds:
  ~/.config/app/config.js:
    op: block
    comment: //
    content: "module.exports = { telemetry: false }\n"
```

```text
// >>> ws-seed >>>
module.exports = { telemetry: false }
// <<< ws-seed <<<
```

`block` is plain text and does not infer a file's comment syntax; `comment` is valid only with
`op: block`.
For structured files, prefer `merge` over a marked block.

### Managed Lines

`op: lineinfile` manages a single line, matched by its key, without ever duplicating it:

```yaml
seeds:
  ~/.zshenv:
    op: lineinfile
    content: "export EDITOR=vim\n"
```

The key is the text up to and including the first `=` *(here `export EDITOR=`)*.
On each apply, a line with that key is replaced in place; if none exists, the line is appended,
creating the file if needed.
The content is exactly one line, so an interior newline is a hard error *(use `op: block` for a
multi-line region)*.

Like `block`, `lineinfile` ignores `force` and rewrites the file only when the line changes.
It is the counterpart to `append` that never adds a line twice, for `key=value` files such as
`~/.zshenv`.

## Templating

Set `template: true` to fill in a fixed set of variables in the source before writing:

```yaml
seeds:
  ~/.config/app/env:
    template: true
    content: "HOME=${ws_home}\nTOKEN=${secrets.GH_TOKEN}\n"
```

The available variables are `${ws_home}`, `${ws_user}`, `${ws_server_root}` and `${secrets.NAME}`.
An unknown `${...}` variable is a hard error.
There is no expression language and no escape syntax.
To emit a literal `${...}`, leave `template` unset.

## Secrets

Seed decrypts two kinds of secret, both encrypted in the same format by
[`ws-cli secrets encrypt`](/settings/secrets):

- **Inline values:** live in the top-level `secrets:` map *(`NAME: <ciphertext>` or `NAME: file:<path>`)*
  and are referenced only through `${secrets.NAME}` in a `template: true` entry.
- **Whole-file secrets:** set `secret: true` on the entry.
  Its source *(the encrypted file at the matching path under the source, or an inline `content:`
  ciphertext)* is decrypted and written as plaintext.

A file that holds a secret is always written with mode `0600`, and its cleartext never reaches the
logs.
A secret that does not decrypt *(missing key, corrupt ciphertext)* is skipped with a warning, and
nothing is written: neither the ciphertext nor a partial file.

A manifest with no secrets needs no key.

::: warning

Keep encrypted files **out of** the bare-file paths unless a manifest entry claims them.
An encrypted file with no entry is copied as it is, still encrypted, like any other bare file.

:::

::: info

To change the master key, run [`ws-cli seed rotate`](#apply-and-rotate): it re-encrypts every
managed ciphertext in place under the new key.

:::

## Ownership Boundary

Seed writes only to destinations you own, anywhere your account owns the nearest existing parent
directory: `~/.ssh`, `~/.ws/startup.d`, dotfiles, a `/opt/mine` you created.
Anything else is skipped with a warning.

Seed never uses `sudo` or any other escalation: a location you do not own fails the check, which is
also exactly where you could not write by hand.

::: tip

A write into `~/.ws/{startup.d,ca.d,session.d,features.d}` is allowed and logs a notice, so you can
seed your own startup scripts.
Bare files are written with mode `644`, so give a script `mode: "0o755"` in the manifest to make it
executable.
Write the `0o` prefix: `"0755"` is read as decimal and rejected.

:::

## Apply and Rotate

At startup, the workspace runs `ws-cli seed apply` with no arguments.
Run it yourself to apply the source again, or name the destinations to apply:

```sh
# Apply everything
ws-cli seed apply

# Apply again, overwriting existing destinations
ws-cli seed apply --force

# Apply a single destination
ws-cli seed apply ~/.gitconfig

# List the resolved plan
ws-cli seed ls
```

A named destination matches its entry regardless of `~`, `$HOME` or absolute form.

Rotate the master key across every managed ciphertext in one pass: the `secrets:` map, its `file:`
targets, and every `secret: true` source.

```sh
# Re-encrypt everything from the current key to a new one
ws-cli seed rotate --master <current> --new-master <new>
```

::: warning

`seed rotate` rewrites ciphertext **in place**, with no dry run and no backup.
It fails closed: every secret is decrypted under the current key *before* anything is written, so a
wrong key changes nothing.
If a run is interrupted while writing, the source holds both old-key and new-key ciphertext, and
`seed rotate` refuses it under either key.
Re-encrypt the items still under the old key by hand.

:::
