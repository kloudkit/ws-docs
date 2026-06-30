---
description: Project files and secrets from a durable seed directory onto the workspace filesystem on every boot, within an ownership boundary.
see:
  - name: Secrets
    link: /settings/secrets
  - name: Autoload Scripts
    link: /settings/autoload-scripts
---

# Seed

![Seed](/icons/seed.svg){.doc-image}

Seeding projects files and secrets from a durable source directory onto the filesystem on every
container boot.
Fill the source once and it re-projects each restart, with no hand-run setup scripts.

One source tree carries two tiers: plain **bare files** copied verbatim, and a **`.seed.yaml`
manifest** that layers merge, templating, and secrets over them.

## At a Glance

- **Source:** <EnvVar group="seed" name="source" /> *(default `~/.ws/seed.d`)*. An empty or absent
  directory is a clean no-op.
- **Manifest:** a single `<source>/.seed.yaml` at the source root, excluded from the bare mirror.
- **Runs:** at boot, before the workspace's own configuration steps.
- **Writes:** only where you own the destination, anywhere your account owns the nearest existing
  parent directory.

## Bare Files: FS-Rooted Mirror

The path under the source maps directly onto the root filesystem:

```text
~/.ws/seed.d/home/kloud/.gitconfig   →  ~/.gitconfig
~/.ws/seed.d/etc/workspace/x         →  /etc/workspace/x
```

A home file therefore lives at `seed.d/home/kloud/<path>`, not at the source root.
Bare files copy verbatim with mode `644` *(new directories `755`)* and never write if the
destination already exists, unless forced.

## The Manifest

A single hidden `.seed.yaml` at the source root declares behaviors.
It opens with a `version` key and two sections:

```yaml
version: v1

secrets:
  GH_TOKEN: kZ9...   # inline ciphertext, or file:/run/secrets/gh_token

seeds:
  ~/.gitconfig:
    op: merge

  ~/.ssh/id_ed25519:
    secret: true

  ~/.zshenv:
    op: append
    content: |
      export EDITOR=nano
```

The `seeds:` map is **keyed by destination**, `~`, `${ws_home}`, `${ws_server_root}` and
`${ws_user}` expand.

The source for each entry is implied by that key: the **rhyming mirror file**
*(`<source>/<dest-without-leading-slash>`)*, or an inline `content:` literal.
There is no `file:` pointer inside `seeds:`.

Each entry must carry at least one behavior, `secret`, `mode`, a non-`copy` `op`, or `template`.
A plain copy belongs in the mirror tier, so a copy-only manifest entry is a parse error.

When a destination is produced by both a bare file and a manifest entry, the manifest entry wins.

## Operations

`op` is one of `copy` *(default)*, `merge`, `append`, `prepend` or `block`.

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

`append` and `prepend` add `content` to the end or start of the destination.

::: warning

`append` and `prepend` follow the same **write-if-absent** rule as every entry
*(see [Force and Ephemerality](#force-and-ephemerality))*: an existing destination is skipped unless forced.

Forced, they re-apply on every boot *(**naive, not idempotent**)*, so the content is added again each
time and accumulates *(if a persistent volume is mounted)*.

To manage a region inside an existing file idempotently, use [`op: block`](#managed-blocks).

:::

::: info

JSON `merge` can lose precision on integers larger than 2⁵³. YAML and TOML keep them exact.

:::

### Managed Blocks

`op: block` manages a marked region inside a file.

It wraps `content` between two marker lines and reconciles that block on every boot, idempotently,
even when the content changes:

```yaml
seeds:
  ~/.zshenv:
    op: block
    content: "export EDITOR=nano\n"
```

The first apply appends the block and inserts the markers for you:

```text
# >>> ws-seed >>>
export EDITOR=nano
# <<< ws-seed <<<
```

Later applies find those markers and replace only the body between them, so the region never
duplicates and tracks content changes.

You never write the markers by hand.
A missing file is created; an existing file keeps its content and gains the block at the end.

`block` ignores `force`: it is safe to re-run, and rewrites the file only when the block's contents
change. Malformed markers *(a begin without an end, or markers out of order)* are a hard error that
leaves the destination unchanged.

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
`op: block`. For structured files, prefer `merge` over a marked block.

## Templating

Set `template: true` to substitute a closed variable set in the source before writing:

```yaml
seeds:
  ~/.config/app/env:
    template: true
    content: "HOME=${ws_home}\nTOKEN=${secrets.GH_TOKEN}\n"
```

The available tokens are `${ws_home}`, `${ws_user}`, `${ws_server_root}` and `${secrets.NAME}`. An
unknown `${...}` token is a hard error. There is no expression language and no escape syntax. To
emit a literal `${...}`, leave `template` unset.

## Secrets

Two secret shapes share one ciphertext format, both produced by
[`ws-cli secrets encrypt`](/settings/secrets):

- **Inline values:** live in the top-level `secrets:` map *(`NAME: <ciphertext>` or `NAME: file:<path>`)*
  and are referenced only through `${secrets.NAME}` in a `template: true` entry.
- **Whole-file secrets:** set `secret: true` on the entry. Its source *(the rhyming mirror ciphertext
  file, or an inline `content:` ciphertext)* is decrypted and written as plaintext.

A secret-bearing output is forced to mode `0600`, and its cleartext never reaches logs.
A secret that will not decrypt *(missing key, corrupt ciphertext)* is skipped with a warning and
nothing is written, never the ciphertext, never a partial.

A manifest with no secrets needs no key.

::: warning

Keep ciphertext files **outside** the mirror tree unless a manifest entry claims them.
An undeclared encrypted file in the source is copied verbatim as ciphertext, exactly like any other
bare file.

:::

::: info

Key rotation re-authors the source: re-encrypt the `secrets:` values and any `secret: true` ciphertext
with [`ws-cli secrets encrypt`](/settings/secrets) under the new key.

:::

## Ownership Boundary

Seed writes only to destinations you own, anywhere your account owns the nearest existing parent
directory: `~/.ssh`, `~/.ws/startup.d`, dotfiles, a `/opt/mine` you created. Anything else is skipped
with a warning.

There is no `sudo` and no escalation: a location you do not own simply fails the check, which is also
exactly where you could not write by hand.

::: tip

A write into `~/.ws/{startup.d,ca.d,session.d,features.d}` is allowed and emits a notice. Seeding
your own startup script is a legitimate use. Mark it executable if it needs to run.

:::

## Force and Ephemerality

The default is **write-if-absent**: an entry writes only when the destination is missing.
This re-seeds ephemeral paths every boot for free and preserves a hand-edited persistent file.
To overwrite an existing destination, set `force: true` on the entry or pass `--force` to re-apply
everything.
For `merge`, `force` gates the merge too, and without it an existing destination is left alone.

## Apply and Inspect

The boot hook runs `ws-cli seed apply` with no arguments.
Run it by hand to re-project, or scope it to specific destinations:

```sh
# Project everything
ws-cli seed apply

# Re-apply, overwriting existing destinations
ws-cli seed apply --force

# Project a single destination
ws-cli seed apply ~/.gitconfig

# List the resolved plan
ws-cli seed ls
```

A named destination matches its entry regardless of `~`, `$HOME` or absolute form.
