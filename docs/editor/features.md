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
  ghcr.io/kloudkit/workspace:v0.0.22
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
These playbooks are located in the `/usr/share/workspace/features` directory, as
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

## Custom Features

You can create custom playbooks for specific needs.
The template below offers a starting point.
Ensure that `hosts: workspace` remains unchanged, as this targets the active workspace
session.

::: tip
It may also help to explicitly mention that the custom playbook template can be saved as
`cool.yaml` in the `/alternate` directory.
:::

::: code-group

```yaml [playbook]
# /alternate/cool.yaml
- name: Install a cool new feature
  gather_facts: false
  hosts: workspace

  tasks:
    - name: Just saying hello
      ansible.builtin.debug:
        msg: Hello world! 👋
```

```sh [install]
ws feature install custom --feature cool --root /alternate
```

:::

## Available Features

::: info
Have a feature in mind that we haven’t covered?
Feel free to suggest it or contribute directly.

For more information, visit our [contribution guide](/contribute/).
:::

| Feature       | Description                               |   Since   |
| ------------- | ----------------------------------------- | :-------: |
| `cloudflared` | Cloudflare tunnel CLI                     |           |
| `codex`       | codex CLI                                 | *v0.0.20* |
| `conan`       | Conan CLI and related tools               | *v0.0.21* |
| `continue`    | cn CLI and continue extension             |           |
| `cpp`         | C++ and related tools                     |           |
| `dagger`      | dagger.io CLI and SDK                     |           |
| `dotnet`      | .NET framework and related extensions     |           |
| `gcloud`      | Google Cloud CLI for GCP                  |           |
| `gh`          | GitHub CLI                                |           |
| `jf`          | JFrog CLI                                 |           |
| `jupyter`     | Jupyter packages and related extensions   |           |
| `php`         | PHP and related extensions                |           |
| `rclone`      | rclone CLI                                |           |
| `restic`      | Restic CLI                                |           |
| `rust`        | Rust and Cargo                            |           |
| `snyk`        | Snyk CLI and related extension            | *v0.0.20* |
| `sops`        | SOPS CLI                                  | *v0.0.21* |
| `talos`       | Talos CLI                                 |           |
| `terraform`   | Terraform packages and related extensions |           |
