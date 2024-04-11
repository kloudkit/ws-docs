---
see:
  - name: Signed Commits
    link: /tools/git#files
  - name: Fonts
    link: /editor/theme-and-fonts
---

# SSH

## Client

Using SSH to connect to remote servers and services is a common task for developers.
The workspace comes equipped with user-friendly and standard configurations for utilizing
SSH to connect with remote servers.
 These configurations are all located within `~/.ssh/config`.

### User Overrides

Users have the flexibility to enhance or modify the default SSH configurations by editing
the `~/.ssh/config.local` file.
Any settings defined in `~/.ssh/config.local` are prioritized and processed before the
main configuration file *(`~/.ssh/config`)*, enabling users to customize their settings
without altering the primary configuration.

This approach ensures that user-overrides or additions seamlessly take precedence.

### Key-Pair Lookup

It's recommended to use unique key-pairs for each host to enhance security.
However, managing multiple key-pairs can be challenging.
To simplify this, we've implemented a hierarchical lookup strategy that selects the
appropriate key-pair based on its location within the `~/.ssh` directory.

The strategy employs the following order for key-pair selection, with the process halting
at the first successful match:

- **User defined:** keys explicitly specified by the user in `~/.ssh/config.local`
    [see below](#user-overrides).
- **Global:** keys located directly within the `~/.ssh` directory:
  - `~/.ssh/id_ecdsa`
  - `~/.ssh/id_ed25519`
  - `~/.ssh/id_rsa`
- **Internal:** for hosts with internal IP addresses *(i.e. `10.*`, `192.168.*`, etc.)*,
    keys within the `~/.ssh/internal` subdirectory are used:
  - `~/.ssh/internal/id_ecdsa`
  - `~/.ssh/internal/id_ed25519`
  - `~/.ssh/internal/id_rsa`
- **Domain specific:** for all other hosts, keys are matched based on the DNS name of the
    host, with each DNS name corresponding to a subdirectory under `~/.ssh`.
    For example, keys for `github.com` would be located in `~/.ssh/github.com`:
  - `~/.ssh/<HOST>/id_ecdsa`
  - `~/.ssh/<HOST>/id_ed25519`
  - `~/.ssh/<HOST>/id_rsa`

This structure ensures a more organized and secure approach to managing SSH keys,
simplifying what can otherwise have been considered a complex process.

### SSH Agent

The `ssh-agent` is a background process that handles private keys used for public key
authentication with SSH.

Starting an `ssh-agent` is considered good practice because it securely stores your
passphrase and keys in memory, allowing you to use SSH keys to establish connections
without having to re-enter your passphrase each time.

An `ssh-agent` daemon is started by default when the *workspace* is first booted.

## Server

An SSH server can be configured to launch upon workspace startup.
All configurations within `/etc/ssh/sshd_config` have undergone a thorough review and
carefully tuned to strengthen security measures.
