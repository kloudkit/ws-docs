---
description: "Install extra packages in Kloud Workspace at startup or by hand, add your own APT repositories and keys, and control which packages APT may install."
see:
  - name: Features
    link: /editor/features
---

# APT

![Debian logo](/icons/debian.svg){.doc-image width=200px}

Install extra packages at startup or in a running workspace, add your own repositories, and
control which packages APT may install.

## Install Packages

At startup, the workspace installs the packages listed in:

- <EnvVar group="apt" name="additional_packages" />

`WS_APT_ADDITIONAL_PACKAGES` can contain one or more space-delimited package names:

```sh{2}
docker run \
  -e WS_APT_ADDITIONAL_PACKAGES="cmake nano" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

::: tip
Some packages are already available as [**features**](/editor/features), which add setup steps
beyond the package itself.

Check the available features before you list a package here.
:::

### Install in a Running Workspace

The startup install of `WS_APT_ADDITIONAL_PACKAGES` runs the `additional-apt` feature playbook.
Call it directly to install packages after the workspace is running, or to retry a failed
startup install:

```sh
ws-cli feature install additional-apt --opt packages="vim,curl"
```

## Add Repositories

Add custom repository sources, one or more entries separated by semicolons *(`;`)*:

- <EnvVar group="apt" name="additional_repos" />

```sh{2}
docker run \
  -e WS_APT_ADDITIONAL_REPOS="deb [signed-by=/custom.gpg] https://custom.package trixie main" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

### Add Their GPG Keys

Some third-party repositories require you to trust their signing key.
Provide additional keys as one or more space-delimited `name:url` pairs:

- <EnvVar group="apt" name="additional_gpg_keys" />
- <EnvVar group="apt" name="additional_insecure_gpg_keys" />

Each key is downloaded at startup and stored in `/etc/apt/keyrings/<name>.gpg`.
Keys must be served over HTTPS; put keys served over HTTP in `WS_APT_ADDITIONAL_INSECURE_GPG_KEYS`.

```sh{2}
docker run \
  -e WS_APT_ADDITIONAL_GPG_KEYS="mycorp:https://mycorp.com/pubkey.asc extras:https://extras.test/key2.asc" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

### Update the Package Lists

Set `WS_APT_UPDATE_CACHE` to `true` to refresh the package lists at startup, after your custom
sources are added.
Package installs refresh the lists on their own, so this matters only for running `apt-get
install` by hand later.

## Disable Repositories

Besides the standard sources, Kloud Workspace is set up with a range of additional repository
sources, all signed with `gpg` keys.
To disable repository sources, set:

- <EnvVar group="apt" name="disable_repos" />

It accepts `debian`, `additional` *(every bundled third-party source)*, or `true` to disable
them all.

## Restricted Packages

The workspace runs headless, so it ships preference files that block packages with no use inside
a container.
These are grouped by category:

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
  ghcr.io/kloudkit/workspace:v0.6.0
```

Lift every restriction at once with `true` *(or `*`)*:

```sh{2}
docker run \
  -e WS_APT_DISABLE_RESTRICTIONS=true \
  ghcr.io/kloudkit/workspace:v0.6.0
```

### Override for a Single Install

To install a package blocked by a [shipped restriction](#restricted-packages) in a running
workspace, pass `override_restrictions=true`:

```sh
ws-cli feature install additional-apt \
  --opt packages=containernetworking-plugins \
  --opt override_restrictions=true
```

The restrictions are restored when the install completes *(including on failure)*.
Unlike `disable_restrictions`, the override applies only to this single install.
For the startup equivalent:

- <EnvVar group="apt" name="override_restrictions" />

## Default Configurations

The APT defaults keep the image small and leave your own files intact.
Notable defaults include:

- The `--no-install-recommends` flag is enabled by default to avoid the installation of
  recommended but unnecessary packages.
- When a package upgrade ships a new version of a config file you changed, APT keeps your
  version.
