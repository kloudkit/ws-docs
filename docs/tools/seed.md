---
description: Project files and secrets from a durable seed directory onto the workspace filesystem on every boot, within an ownership boundary.
see:
  - name: Secrets
    link: /settings/secrets
  - name: Git
    link: /tools/git
  - name: Autoload Scripts
    link: /settings/autoload-scripts
---

# Seed

Seeding projects files and secrets from a durable source directory onto the filesystem on every
container boot. Fill the source once and it re-projects each restart, with no hand-run setup scripts.

The engine lives in `ws-cli`. One source tree carries two tiers, resolved into a single plan and
written once per destination:

- **Bare files** mirror the target filesystem and are copied verbatim.
- **A `.seed.yaml` manifest** overlays declarative behaviors — merge, templating, secrets — onto
  that mirror.

## At a Glance

- **Source:** <EnvVar group="seed" name="source" /> *(default `~/.ws/seed.d`)*. An empty or absent
  directory is a clean no-op.
- **Manifest:** a single `<source>/.seed.yaml` at the source root, excluded from the bare mirror.
- **Runs:** on every boot, before the workspace's own configuration steps.
- **Writes:** only where you own the destination — anywhere your account owns the nearest existing
  parent directory.

## Bare Files: FS-Rooted Mirror

Plain files mirror the target filesystem tree. The path under the source maps directly onto the root
filesystem:

```text
~/.ws/seed.d/home/kloud/.gitconfig   →  ~/.gitconfig
~/.ws/seed.d/etc/workspace/x         →  /etc/workspace/x
```

A home file therefore lives at `seed.d/home/kloud/<path>`, not at the source root. Bare files copy
verbatim with mode `644` *(new directories `755`)* and never write if the destination already
exists, unless forced.

## The Manifest

A single hidden `.seed.yaml` at the source root declares behaviors. It opens with a `version` key and
two maps:

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
    content: "export EDITOR=nano\n"
```

The `seeds:` map is **keyed by destination** — `~`, `${ws_home}`, `${ws_server_root}` and
`${ws_user}` expand. The source for each entry is implied by that key: the **rhyming mirror file**
*(`<source>/<dest-without-leading-slash>`)*, or an inline `content:` literal. There is no `file:`
pointer inside `seeds:`.

Each entry must carry at least one behavior — `secret`, `mode`, a non-`copy` `op`, or `template`. A
plain copy belongs in the mirror tier, so a copy-only manifest entry is a parse error. When a
destination is produced by both a bare file and a manifest entry, the manifest entry wins.

## Operations

`op` is one of `copy` *(default)*, `merge`, `append` or `prepend`.

`merge` deep-merges structured data, with the format inferred from the destination extension
*(`.json`, `.yaml`, `.toml`)*. Maps merge recursively, scalars override, and **lists replace**
wholesale. A scalar-versus-map conflict at a key is a hard error that leaves the destination
byte-unchanged.

```yaml
seeds:
  ~/.config/app/config.json:
    op: merge
    content: '{"telemetry": false}'
```

`append` and `prepend` concatenate `content` onto the existing destination.

::: warning

`append` and `prepend` are **not idempotent** — they add their content every time they run. They are
safe on ephemeral destinations rebuilt each boot *(such as `~/.zshenv`)*; on a persistent destination
they accumulate duplicates across boots. Ephemerality is a deployment assumption, not an image
guarantee.

:::

::: info

JSON `merge` normalizes numbers through `float64`, so integers larger than 2⁵³ lose precision. YAML
and TOML decode native integers and are unaffected.

:::

## Templating

Set `template: true` to substitute a closed variable set in the source before writing:

```yaml
seeds:
  ~/.config/app/env:
    template: true
    content: "HOME=${ws_home}\nTOKEN=${secrets.GH_TOKEN}\n"
```

The available tokens are `${ws_home}`, `${ws_user}`, `${ws_server_root}` and `${secrets.NAME}`. An
unknown `${...}` token is a hard error — there is no expression language and no escape syntax. To
emit a literal `${...}`, leave `template` unset.

## Secrets

Two secret shapes share one ciphertext format, both produced by
[`ws-cli secrets encrypt`](/settings/secrets):

- **Inline values** live in the top-level `secrets:` map *(`NAME: <ciphertext>` or
  `NAME: file:<path>`)* and are referenced only through `${secrets.NAME}` in a `template: true`
  entry.
- **Whole-file secrets** set `secret: true` on the entry. The engine decrypts the implied source —
  the rhyming mirror ciphertext file or an inline `content:` ciphertext — and writes the plaintext
  verbatim.

A secret-bearing output is forced to mode `0600`, and its cleartext never reaches logs. A secret that
will not decrypt *(missing key, corrupt ciphertext)* is skipped with a warning and nothing is
written — never the ciphertext, never a partial. A manifest with no secrets needs no key.

::: warning

Keep ciphertext files **outside** the mirror tree unless a manifest entry claims them. An undeclared
encrypted file in the source is copied verbatim as ciphertext, exactly like any other bare file.

:::

::: info

Key rotation re-authors the source: re-encrypt the `secrets:` values and any `secret: true` ciphertext
with [`ws-cli secrets encrypt`](/settings/secrets) under the new key. There is no `seed rotate`
command yet.

:::

## Ownership Boundary

The engine writes only where you own the destination. It stats the nearest existing parent directory
of the resolved path and compares its owner to your account *(`st_uid == geteuid()`)*: owner-owned
directories are allowed — `~/.ssh`, `~/.ws/startup.d`, dotfiles, a `/opt/mine` you created — and
anything else is skipped with a warning. There is no system gate and no `sudo`: a root-owned parent
simply fails the check, which is also exactly where your account cannot write.

Every write is anchored and TOCTOU-safe: paths resolve through `os.Root`, a component that escapes the
anchor is refused, and a final-component symlink is refused outright rather than followed.

::: tip

A write into `~/.ws/{startup.d,ca.d,session.d,features.d}` is allowed and emits a notice — seeding
your own startup script is a legitimate use. Mark it executable if it needs to run.

:::

## Force and Ephemerality

The default is **write-if-absent**: an entry writes only when the destination is missing. This
re-seeds ephemeral paths every boot for free and preserves a hand-edited persistent file. To
overwrite an existing destination, set `force: true` on the entry or pass `--force` to re-apply
everything. For `merge`, `force` gates the merge too — without it, an existing destination is left
alone.

## Apply and Inspect

The boot hook runs `ws-cli seed apply` with no arguments. Run it by hand to re-project, or scope it to
specific destinations:

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

## Next Steps

- [Secrets](/settings/secrets): the `ws-cli secrets` encryption primitives behind seeded secrets.
- [Git](/tools/git): automated repository cloning into `${WS_SERVER_ROOT}`.
- [Autoload Scripts](/settings/autoload-scripts): the `~/.ws/*.d` drop-in convention.
