---
see:
  - name: APT
    link: /editor/features
---

# APT Manager

![Debian logo](/icons/debian.svg){.doc-image width=200px}

The Kloud *workspace* comes pre-configured with a custom APT setup to provide robust and
efficient package management.

These configurations are designed to enhance flexibility, reduce unnecessary
installations, and prevent the overwriting of user-defined files.

## Repository Sources

By default, the *workspace* is set up with a range of additional repository sources
alongside the standard ones.
All extra sources are signed with `gpg` keys to ensure secure and verified package
installations.

### Disabling Sources

If you need to disable any of the repository sources, you can do so by setting the
following environment variables:

- **`WS_APT_DISABLE_DEBIAN_REPO`:** Disables the default Debian repository.
- **`WS_APT_DISABLE_EXTRAS_REPO`:** Disables the additional extra *(3rd-party)* repository.

### Custom Sources

Users can add custom repository sources by setting the `WS_APT_EXTRA_DEBIAN_REPOS`
environment variable.
The variable can contain one or more repositories, separated by semicolons *(`;`)*.

```sh{2}
docker run \
  -e WS_APT_EXTRA_DEBIAN_REPOS="deb [signed-by=/custom.gpg] https://custom.package bookworm main" \
  ghcr.io/kloudkit/workspace:latest
```

### Update Repository Cache

You can optionally trigger a package cache update by setting the `WS_APT_UPDATE_REPOS`
environment variable to a *truthy* value *(either `1` or `true`)*.

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

## Extra Packages

Upon *workspace* startup, we evaluate the value of `WS_APT_EXTRA_PACKAGES` environment
variable to automate the installation of additional *user-defined* packages.

The `WS_APT_EXTRA_PACKAGES` variable can contain one or more space-delimited package
names as demonstrated below:

```sh{2}
docker run \
  -e WS_APT_EXTRA_PACKAGES="cmake nano" \
  ghcr.io/kloudkit/workspace:latest
```

::: tip
Some packages are already available as [**features**](/editor/features), which include
additional setup steps that enhance their usage and functionality.

We recommend reviewing the available features before opting for manual package installation.
:::
