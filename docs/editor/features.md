---
description: "Opt-in features let you install and configure extra packages and tooling in Kloud Workspace on demand, keeping the base image lean."
see:
  - name: Ansible
    link: /tools/ansible
  - name: APT
    link: /tools/apt
---

# Features

Features add optional tools to the workspace when you need them, so the base image stays lean.
Each feature is an *Ansible playbook* that `ws-cli` runs to install and configure the tool.

## Available Features

::: info
To suggest a feature or contribute one, see the [contribution guide](/contribute/).
:::

| Feature                                     | Description                                |   Since   | Store |
| ------------------------------------------- | ------------------------------------------ | :-------: | :---: |
| [**`additional-apt →`**](/tools/apt)        | Extra APT packages by name                 | *v0.4.0*  |       |
| `bun`                                       | Bun JavaScript runtime and package manager | *v0.2.0*  |   ✅   |
| [**`cloudflared →`**](/tools/cloudflared)   | Cloudflare tunnel CLI                      |           |   ✅   |
| `codex`                                     | codex CLI                                  | *v0.0.20* |       |
| `conan`                                     | Conan CLI and related tools                |           |       |
| `continue`                                  | cn CLI and continue extension              | *v0.0.21* |       |
| [**`cpp →`**](/tools/cpp)                   | C++ and related tools                      |           |   ✅   |
| `dagger`                                    | dagger.io CLI and SDK                      |           |       |
| `doctl`                                     | DigitalOcean CLI                           | *v0.2.0*  |       |
| [**`dotnet →`**](/tools/dotnet)             | .NET SDK, runtime, and ASP.NET Core        |           |   ✅   |
| `gcloud`                                    | Google Cloud CLI for GCP                   |           |   ✅   |
| `gh`                                        | GitHub CLI                                 |           |   ✅   |
| `glab`                                      | GitLab CLI                                 | *v0.2.0*  |   ✅   |
| `helm-extras`                               | Helm plugins and related extensions        | *v0.2.0*  |   ✅   |
| [**`image-extras →`**](/tools/image-extras) | syft, grype, dive, osv-scanner             | *v0.3.0*  |       |
| `jf`                                        | JFrog CLI                                  |           |   ✅   |
| `jupyter`                                   | Jupyter packages and related extensions    |           |       |
| `oc`                                        | OpenShift CLI                              | *v0.2.0*  |   ✅   |
| `opencode`                                  | OpenCode CLI and related extension         | *v0.1.1*  |       |
| `php`                                       | PHP and related extensions                 |           |   ✅   |
| `rclone`                                    | rclone CLI                                 |           |   ✅   |
| `restic`                                    | Restic CLI                                 |           |   ✅   |
| [**`rust →`**](/tools/rust)                 | Rust and Cargo                             |           |       |
| `snyk`                                      | Snyk CLI and related extension             | *v0.0.20* |       |
| `sops`                                      | SOPS CLI                                   | *v0.0.21* |   ✅   |
| `talos`                                     | Talos CLI                                  |           |   ✅   |
| `terraform`                                 | Terraform packages and related extensions  |           |   ✅   |
| `tshark`                                    | Wireshark terminal CLI                     | *v0.3.0*  |   ✅   |

## Installing Features

Install a feature when a container first starts, or by hand in a running workspace.

### Install at Boot

When a container first starts, Kloud Workspace installs the *features* listed in:

- <EnvVar group="features" name="additional_features" />

```sh{2}
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="dotnet jupyter" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

### Manual Installation

To install a feature by hand, run `ws-cli feature install`:

```sh
# Help information
ws-cli feature install -h

# Example: installing PHP
ws-cli feature install php
```

The built-in playbooks are in the `/usr/share/workspace/features.d` directory.

### Optional Variables

Some playbooks accept variables for customization.
Pass them with the `--opt` flag *(equivalent to Ansible's `--extra-vars`)*, zero or more times:

```sh
ws-cli feature install dagger --opt version=0.13.3
```

### Skipping Sections

Beyond the core tool, a playbook may also install VS Code extensions, configure shell completion, or
enable a vendor APT repository.
Skip any of these with the matching flag; the tool itself still installs:

```sh
ws-cli feature install bun --skip-extensions --skip-completion
```

| Flag                | Skips                            |
| ------------------- | -------------------------------- |
| `--skip-extensions` | VS Code extension installs       |
| `--skip-completion` | Shell completion setup           |
| `--skip-repository` | Vendor APT repository enablement |

The same skips apply at boot through the per-feature `WS_FEATURES_<NAME>_OPTS`
variable, set to one or more `skip_<section>=true` pairs joined with `;`:

```sh{2}
docker run \
  -e WS_FEATURES_BUN_OPTS="skip_extensions=true;skip_completion=true" \
  -e WS_FEATURES_ADDITIONAL_FEATURES="bun" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

::: warning

`--skip-repository` skips enabling the vendor APT repository the package install
then reads from.

Use it only when the package is already present or mirrored through a [feature store](#feature-store).

:::

## Custom Features

Save your own playbooks under `~/.ws/features.d/` and install them by name, exactly like the
built-in features, with no `--root` needed.

The directory is searched alongside the built-in features; if a name exists in both, your copy wins,
so you can override a shipped feature by dropping a same-named playbook there.

Scaffold a starting playbook with `ws-cli feature new` and redirect it into place.
Keep `hosts: workspace` and `gather_facts: false` unchanged, then extend the
`tasks:` block.

::: code-group

```sh [Scaffold]
ws-cli feature new redis > ~/.ws/features.d/redis.yaml
```

```yaml [Playbook]
---
- name: Install redis
  gather_facts: false
  hosts: workspace

  tasks:
    - name: Say hello
      ansible.builtin.debug:
        msg: Hello world! 👋
```

```sh [Install]
ws-cli feature install redis
```

:::

To install a playbook from a different directory instead, point `--root` at it.
Any directory you have access to works, and only that directory is searched.
This command looks for a playbook at `/alternate/php.yaml`:

```sh
ws-cli feature install php --root /alternate
```

## Feature Store

Some features require packages from third-party APT repositories
*(e.g. `dotnet`, `gcloud`, `php`)* or binary artifacts *(e.g. `gh`, `sops`, `terraform`)*.
By default, Kloud Workspace enables the individual vendor repositories and artifacts at install
time.

When this variable is set, packages and artifacts are fetched from the
[ws-feature-store](https://github.com/kloudkit/ws-feature-store) instead of from individual vendor
repositories:

- <EnvVar group="features" name="store_url" />

### Use Cases

- **Air-gapped environments:** run the feature store on a local network with no internet access.
- **High-latency on-prem:** avoid slow connections to upstream vendor CDNs by serving
  packages locally.
- **Quick caching:** reduce startup time by fetching from a nearby mirror instead of
  multiple remote sources.

### Self-Hosting

The feature store is a static-asset server; run it as follows:

```sh{2}
docker run -p 8081:80 \
  ghcr.io/kloudkit/ws-feature-store:v2026.11
```

The container listens on port `80`.
Browse `/manifest.json` to confirm the store is live.

The feature store image is available at `ghcr.io/kloudkit/ws-feature-store`.
Tags are released monthly with the latest package updates and follow a
`:v{YYYY}.{MM}` convention *(e.g. `:v2026.11`)*.
Features installed as static binaries need a store image that ships their artifacts,
so update older store images before pointing a newer Kloud Workspace at them.

### Quick Start

Point the workspace at a running feature store instance:

```sh{2-4}
docker run \
  -e WS_APT_DISABLE_REPOS="*" \
  -e WS_FEATURES_STORE_URL="http://feature-store.local" \
  -e WS_FEATURES_ADDITIONAL_FEATURES="gh terraform" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

::: tip

Combine with `WS_APT_DISABLE_REPOS` set to `*`, as above, so APT installs nothing from outside
the store:

- <EnvVar group="apt" name="disable_repos" />

Extensions, npm and pip packages and other downloads still use the network; pass
`--skip-extensions` to leave extensions out.

:::

### Drift Resolution

When the workspace image and the feature store are built at different times, their Debian
package versions can differ.
At install time the workspace pins or upgrades packages to close the gap where it can; when it
cannot, the install fails.
When the store is older than the image or cannot satisfy it, set this variable to `true` to turn a
disabled `debian.sources` back on for that install:

- <EnvVar group="features" name="store_allow_fallback" />

::: details Feature Store Inventory

<!--@include: ../partials/fs-manifest.md -->

:::
