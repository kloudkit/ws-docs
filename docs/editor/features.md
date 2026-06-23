---
see:
  - name: Ansible
    link: /tools/ansible
  - name: APT
    link: /tools/apt
---

# Additional Features

Pre-installing and configuring every possible package would compromise a flexible
*workspace* footprint.
Instead, we developed an *opt-in* method to seamlessly install and configure features at
your discretion.

Behind the scenes, we are simply running an *Ansible playbook* to install the desired
feature.

## Installing Features

We provide two methods for installing additional features in the Kloud Workspace.
You can choose the method that best fits your needs.

### Install at Boot

Kloud Workspace evaluates the `WS_FEATURES_ADDITIONAL_FEATURES` environment variable at
startup to determine which *features* to install automatically.

```sh{2}
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="dotnet jupyter" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

### Manual Installation

To manually install a feature, run the following command:

```sh
# Help information
ws feature install -h

# Example: installing PHP
ws feature install php
```

As previously mentioned, all features are powered by Ansible playbooks.
These playbooks are located in the `/usr/share/workspace/features.d` directory, as
specified by the [`WS_FEATURES_DIR`](/settings/configuration#ws-features-dir) environment
variable *(which is not intended to be overridden)*.

The directory location can be overridden with the `--root` flag when installing.
In the example below, we use `/alternate`, but any directory you have access to will work.
The command will look for a playbook at `/alternate/php.yaml`:

```sh
ws feature install php --root /alternate
```

### Optional Variables

As mentioned above, features are installed using playbooks.
Certain playbooks support additional variables for customization.

To do this, use the `--opt` flag *(equivalent to Ansible's `--extra-vars`)*, zero or more
times, as shown in the example below:

```sh
ws feature install dagger --opt dagger_version=0.13.3
```

### Skipping Sections

Beyond the core tool, a playbook may also install VSCode extensions, configure shell completion, or
enable a vendor APT repository.
Skip any of these with the matching flag, the tool itself still installs:

```sh
ws feature install bun --skip-extensions --skip-completion
```

| Flag                | Skips                            |
| ------------------- | -------------------------------- |
| `--skip-extensions` | VSCode extension installs        |
| `--skip-completion` | Shell completion setup           |
| `--skip-repository` | Vendor APT repository enablement |

The same skips apply at boot through the per-feature `WS_FEATURES_<NAME>_OPTS`
variable, set to one or more `skip_<section>=true` pairs joined with `;`:

```sh{2}
docker run \
  -e WS_FEATURES_BUN_OPTS="skip_extensions=true;skip_completion=true" \
  -e WS_FEATURES_ADDITIONAL_FEATURES="bun" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

::: warning

`--skip-repository` skips enabling the vendor APT repository the package install
then reads from.

Use it only when the package is already present or mirrored through a [feature store](#feature-store).

:::

## Custom Features

Save your own playbooks under `~/.ws/features.d/` and install them by name, exactly like the
built-in features — no `--root` needed.

The directory is searched alongside the built-in features; if a name exists in both, your copy wins,
so you can override a shipped feature by dropping a same-named playbook there.

Scaffold a starting playbook with `feature new` and redirect it into place.
Keep `hosts: workspace` and `gather_facts: false` unchanged, then extend the
`tasks:` block.

::: code-group

```sh [scaffold]
ws feature new redis > ~/.ws/features.d/redis.yaml
```

```yaml [playbook]
---
- name: Install redis
  gather_facts: false
  hosts: workspace

  tasks:
    - name: Say hello
      ansible.builtin.debug:
        msg: Hello world! 👋
```

```sh [install]
ws feature install redis
```

:::

To install a playbook from a different directory instead, point `--root` at it:

```sh
ws feature install cool --root /alternate
```

## Feature Store

Some features require packages from third-party APT repositories
*(i.e. `cloudflared`, `gcloud`, `gh`, etc.)* or binary artifacts *(i.e. `sops`, `composer`, etc.)*.

By default, Kloud Workspace enables the individual vendor repositories and artifacts at install
time.

When the [`WS_FEATURES_STORE_URL`](/settings/configuration#ws-features-store-url)
environment variable is set, packages and artifacts are fetched from the
[ws-feature-store](https://github.com/kloudkit/ws-feature-store) instead of from
individual vendor repositories.

### Use Cases

- **Airgapped *(offline)* environments:** run the feature store on a local network
  with no internet access.
- **High-latency on-prem:** avoid slow connections to upstream vendor CDNs by serving
  packages locally.
- **Quick caching:** reduce startup time by fetching from a nearby mirror instead of
  multiple remote sources.

### Self-Hosting

The feature store is a static-asset server, run it as follows:

```sh{2}
docker run -p 8081:80 \
  ghcr.io/kloudkit/ws-feature-store:v2026.02
```

The container listens on port `80`.
Browse `/manifest.json` to confirm the store is live.

### Quick Start

Point the workspace at a running feature store instance:

```sh{2-4}
docker run \
  -e WS_APT_DISABLE_REPOS="*" \
  -e WS_FEATURES_STORE_URL="http://feature-store.local" \
  -e WS_FEATURES_ADDITIONAL_FEATURES="gh terraform" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

The feature store image is available at `ghcr.io/kloudkit/ws-feature-store`.
Tags are released monthly with the latest package updates and follow a
`:v{YYYY}.{MM}` convention *(e.g. `:v2026.02`)*.

::: tip

Combine with [`WS_APT_DISABLE_REPOS`](/settings/configuration#ws-apt-disable-repos) set
to `*` to ensure no traffic leaves the local network.

:::

### Drift Resolution

When the workspace image and the feature store rebuild on different cadences, their
Debian package sets can drift across point releases.

At feature-install time, the workspace detects this and resolves it transparently, the
install always succeeds.

Set [`WS_FEATURES_STORE_ALLOW_FALLBACK`](/settings/configuration#ws-features-store-allow-fallback)
to `true` to temporarily re-enable `debian.sources` on older-drift detection.

## Available Features

::: info
Have a feature in mind that we haven’t covered?
Feel free to suggest it or contribute directly.

For more information, visit our [contribution guide](/contribute/).
:::

| Feature                                     | Description                                |   Since   | Store |
| ------------------------------------------- | ------------------------------------------ | :-------: | :---: |
| `bun`                                       | Bun JavaScript runtime and package manager | *v0.2.0*  |   ✅   |
| `cloudflared`                               | Cloudflare tunnel CLI                      |           |   ✅   |
| `codex`                                     | codex CLI                                  | *v0.0.20* |       |
| `conan`                                     | Conan CLI and related tools                | *v0.0.21* |       |
| `continue`                                  | cn CLI and continue extension              |           |       |
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

::: details Feature Store Inventory

<!--@include: ../partials/fs-manifest.md -->

:::
