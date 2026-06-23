---
description: "Kloud Workspace's custom APT setup delivers flexible, efficient package management that avoids unnecessary installs and protects user files."
see:
  - name: APT
    link: /editor/features
---

# APT Manager

![Debian logo](/icons/debian.svg){.doc-image width=200px}

**Kloud Workspace** comes pre-configured with a custom APT setup to provide robust and
efficient package management.

These configurations are designed to enhance flexibility, reduce unnecessary
installations, and prevent the overwriting of user-defined files.

## Repository Sources

By default, Kloud Workspace is set up with a range of additional repository sources
alongside the standard ones.
All additional sources are signed with `gpg` keys to ensure secure and verified package
installations.

### Disabling Sources

If you need to disable any of the repository sources, set the following environment
variable:

- <EnvVar group="apt" name="disable_repos" />

### Custom Sources

Add custom repository sources with `WS_APT_ADDITIONAL_REPOS`.
Supply one or more entries separated by semicolons *(`;`)*.

```sh{2}
docker run \
  -e WS_APT_ADDITIONAL_REPOS="deb [signed-by=/custom.gpg] https://custom.package bookworm main" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

### Update Repository Cache

You can optionally trigger a package cache update by setting the `WS_APT_UPDATE_CACHE`
environment variable to a either `1` or `true`.

Update will occur after adding custom sources to ensures that any newly added
repositories are immediately available for package installations.

## Default Configurations

The *workspace* is configured with several default settings to ensure optimal performance.
The primary goals of these configurations are to minimize the image size and maintain the
integrity of user-defined files.

Notable configurations include:

- The `--no-install-recommends` flag is enabled by default to avoid the installation of
  recommended but unnecessary packages.
- APT will avoid overwriting existing files during package installations.
  This ensures that user-defined settings and files are retained without interruption
  during updates or installs.

## Restricted Packages

The *workspace* runs headless, so it ships preference files that block packages with no
use inside a container. These are grouped by category:

- `x11`: X11 server, GTK/Qt toolkits, Mesa
- `desktop`: Bluetooth, Avahi, NetworkManager, wireless daemons
- `mail`: Postfix, Exim, Sendmail, mail clients
- `printing`: CUPS, printer drivers
- `daemons`: `systemd-timesyncd`, NTP, Chrony
- `cni`: `containernetworking-plugins` *(podman defaults to `netavark`)*
- `language-pack`: locale packages
- `obsolete`: `anacron`, `at`

If you need to install a package that pulls in a restricted dependency, opt out with:

- <EnvVar group="apt" name="disable_restrictions" />

Lift a single category, useful for installing X11 client libraries while leaving
mail and printing blocked:

```sh{2}
docker run \
  -e WS_APT_DISABLE_RESTRICTIONS="x11" \
  -e WS_APT_ADDITIONAL_PACKAGES="libx11-6" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

Lift every restriction at once with `true` *(or `*`)*:

```sh{2}
docker run \
  -e WS_APT_DISABLE_RESTRICTIONS=true \
  ghcr.io/kloudkit/workspace:v0.3.0
```

## Additional Packages

Upon *workspace* startup, we evaluate the value of `WS_APT_ADDITIONAL_PACKAGES`
environment variable to automate the installation of additional *user-defined* packages.

`WS_APT_ADDITIONAL_PACKAGES` can contain one or more space-delimited package names as
demonstrated below:

```sh{2}
docker run \
  -e WS_APT_ADDITIONAL_PACKAGES="cmake nano" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

::: tip
Some packages are already available as [**features**](/editor/features), which include
additional setup steps that enhance their usage and functionality.

We recommend reviewing the available features before opting for manual package installation.
:::

## Manual Installation

The boot-time `WS_APT_ADDITIONAL_PACKAGES` install delegates to a feature
playbook. Call it directly to install packages after the workspace is running
or to retry a failed startup install:

```sh
ws-cli feature install additional-apt --opt packages="vim,curl"
```

### Overriding Restrictions

To install a package blocked by a [shipped restriction](#restricted-packages),
pass `override_restrictions=true`:

```sh
ws-cli feature install additional-apt \
  --opt packages=containernetworking-plugins \
  --opt override_restrictions=true
```

Matching `99-deny-*` files are disabled before the install and restored when
it completes *(including on failure)*. Unlike `disable_restrictions`, the
override applies only to this single install. For the boot-time equivalent:

- <EnvVar group="apt" name="override_restrictions" />

## Additional GPG Keys

Some third-party repositories require you to trust their signing key.
Provide additional keys with **`WS_APT_ADDITIONAL_GPG_KEYS`** as one or more
space-delimited `name:url` pairs.

Each key is downloaded at startup and stored in `/etc/apt/keyrings/<name>.gpg`.

```sh{2}
docker run \
  -e WS_APT_ADDITIONAL_GPG_KEYS="mycorp:https://mycorp.com/pubkey.asc extras:http://extras.test/key2.asc" \
  ghcr.io/kloudkit/workspace:v0.3.0
```
