---
description: "Project files from a durable seed directory onto the workspace filesystem on every boot, within hard security boundaries."
see:
  - name: Git
    link: /tools/git
  - name: Ansible
    link: /tools/ansible
  - name: Autoload Scripts
    link: /settings/autoload-scripts
---

# Seed

Seeding projects files from a durable source directory onto the filesystem on
every container boot. Fill the source once and it re-projects each restart — no
hand-run setup scripts.

There are two tiers in a single source tree:

- **Bare files** — an FS-rooted mirror of the target filesystem.
- **A `.seed.yaml` manifest** — an Ansible tasks-list run through a hardened
  wrapper play.

## At a Glance

- **Source:** <EnvVar group="seed" name="source" /> *(default `~/.ws/seed.d`)*.
  An empty or absent directory is a clean no-op.
- **Runs:** on every boot, before the workspace's own configuration steps.
- **Writes:** only under `$HOME` and `${WS_SERVER_ROOT}`, minus a fixed
  deny-set. System directories require an explicit opt-in.

## Bare Files — FS-Rooted Mirror

Plain files mirror the target filesystem tree. The path under the source maps
directly onto the root filesystem:

```text
~/.ws/seed.d/home/kloud/.gitconfig   →  ~/.gitconfig
~/.ws/seed.d/etc/workspace/x         →  /etc/workspace/x
```

A home file therefore lives at `seed.d/home/kloud/<path>`, not at the source
root. Each file is written with a fixed mode *(644 for files, 755 for new
directories)* and owned by `kloud`. Bare files reconcile every boot —
overwrite-if-changed.

## Task Tier — `.seed.yaml`

A single hidden `.seed.yaml` at the source root is an Ansible **tasks-list**
*(not a full play)*. It is excluded from the bare mirror and never copied
verbatim. The workspace generates the play it controls — `localhost`, local
connection, no fact-gathering, `become: false` — and runs it with the plugin
path emptied from a clean temporary directory.

Supported modules: `copy`, `template`, `file`, `blockinfile`, `lineinfile` and
`set_fact` *(for `combine` ergonomics)*. Inline `content:` may template over a
closed set of variables — `ws_home`, `ws_user` and `ws_server_root` — and the
`combine` filter performs YAML/JSON deep-merge.

```yaml
- name: Write a merged config
  copy:
    dest: "{{ ws_home }}/.config/app/config.json"
    content: "{{ {'theme': 'dark'} | combine({'telemetry': false}) | to_nice_json }}"

- name: Append a shell line once
  lineinfile:
    path: "{{ ws_home }}/.bashrc"
    line: export EDITOR=nano
```

### Propagation

Task entries inherit Ansible's native `force: true` — reconcile every boot. Set
`force: false` per entry for "seed-once, then let the destination drift". There
is no global mode switch.

::: info
`force: false` only applies to `copy` and `template`. `file`, `blockinfile` and
`lineinfile` have no `force` and reconcile every boot — a `lineinfile` with a
non-matching `regexp` appends a duplicate line across boots.
:::

## Security Boundaries

Three boundaries constrain the seed. They hold in every mode and are never
governed by `force`.

### Deny-Set

Any path a later startup script or shell-init autoloads, executes, or feeds to a
root-capable process is rejected — the seed can never plant code or trust that a
less-hardened consumer later runs. A rejected entry is skipped with a warning;
the boot continues.

Rejected destinations include `~/.ws/{startup.d,session.d,ca.d,features.d,extensions}`,
`~/.ws/{vault,state,history}`, `~/.ssh`, `~/.kube`, `~/.zshenv`, any
`.git/` directory, and system paths such as `/etc/sudoers.d`, `/etc/ssh`,
`/etc/ansible`, `/etc/profile.d`, `/usr`, `/bin` and `/sbin`.

### System-Tier Gate

The `.seed.yaml` task tier never writes system paths. System seeding is
bare-file plain-copy only, gated by two opt-ins:

- <EnvVar group="seed" name="allow_system" /> set to `true`, **and**
- password-less `sudo` available *(`WS_AUTH_DISABLE_SUDO=false`)*.

The system deny-set is rejected even when `allow_system` is on.

### Hardened Mode

When `WS_AUTH_DISABLE_SUDO=true`, the seed runs the bare-file copy tier into
user-space only — no Ansible interpreter is invoked at all, and `seed.allow_system`
is ignored. A system-path bare file is a clean skip, never a half-write.

## Edit the Source, Not the Projection

The seed is **reconcile**: edit `~/.ws/seed.d`, not the live projection. A
change made directly to a seeded destination on a persistent volume reverts on
the next boot. Reconcile is also **additive** — removing a file from the source
does **not** delete its earlier projection; the projection survives the next
boot.

::: warning
The seed is a **base layer, not the source of truth.** Because it runs before
the workspace's own configuration steps, the files those steps manage —
`~/.claude/settings.json`, the editor `settings.json`, shell configuration and
server configuration — are overridden by the workspace on every boot. Seeding
wins for everything else; it loses for the files the workspace configures.
:::

::: warning
`combine` merges inline and seeded fragments only. It **cannot** read an
existing on-disk file to patch an override into it — reading for merge is not
available to the task tier.
:::

::: danger
Seeding into `${WS_SERVER_ROOT}` trips the clone guard and **suppresses**
`WS_GIT_CLONE_REPO`. If the server root is a persistent volume, reconcile
reverts live edits on every boot. A whole repository cannot be planted — any
`.git/` path is denied.
:::

## Next Steps

- [Git](/tools/git) — automated repository cloning into `${WS_SERVER_ROOT}`.
- [Ansible](/tools/ansible) — the engine behind the `.seed.yaml` task tier.
- [Autoload Scripts](/settings/autoload-scripts) — the `~/.ws/*.d` drop-in convention.
