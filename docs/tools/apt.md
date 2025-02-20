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

- **`WS_APT_DISABLE_DEBIAN_REPO`:**: Disables the default Debian repository.
- **`WS_APT_DISABLE_EXTRAS_REPO`:**: Disables the additional extra *(3rd-party)* repository.

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
