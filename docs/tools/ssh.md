---
description: "Kloud Workspace ships an SSH client configuration in /etc/ssh/ssh_config that picks a key pair for each host from ~/.ssh."
see:
  - name: Signed Commits
    link: /tools/git#files
  - name: Fonts
    link: /editor/theme-and-fonts
  - name: Docker
    link: /tools/docker
---

# SSH

## Client

Kloud Workspace ships an SSH client configuration for connecting to remote servers, in `/etc/ssh/ssh_config`.

### User Overrides

To add or change settings, edit `~/.ssh/config`.
SSH processes it before the main configuration file *(`/etc/ssh/ssh_config`)*,
so your settings take precedence and the main configuration stays unchanged.

### Key-Pair Lookup

A unique key pair for each host improves security, but many key pairs are harder to manage.
The workspace selects the key pair by its location in the `~/.ssh` directory.

SSH offers the keys in this order and stops at the first one the server accepts:

- **User-defined:** keys you specify in `~/.ssh/config` *(see [User Overrides](#user-overrides))*.
- **Global:** keys located directly in `~/.ssh`:
  - `~/.ssh/id_ecdsa`
  - `~/.ssh/id_ed25519`
  - `~/.ssh/id_rsa`
- **Internal:** when you connect by a private IP address *(`10.*`, `172.16.*` to `172.31.*`, `192.168.*`)*,
    keys in `~/.ssh/internal` are used, and host keys are not checked:
  - `~/.ssh/internal/id_ecdsa`
  - `~/.ssh/internal/id_ed25519`
  - `~/.ssh/internal/id_rsa`
- **Domain specific:** for every host, keys in a subdirectory of `~/.ssh` named after the host
    as you typed it *(no DNS lookup)*.
    For example, keys for `github.com` go in `~/.ssh/github.com`:
  - `~/.ssh/<HOST>/id_ecdsa`
  - `~/.ssh/<HOST>/id_ed25519`
  - `~/.ssh/<HOST>/id_rsa`

With this layout, a key for a new host only needs a new directory, with no entry in `~/.ssh/config`.

#### Example File Structure

```text
├── /etc/ssh/ssh_config   // Workspace defined configurations
└── ~/.ssh
    ├── config            // User-defined overrides
    ├── internal          // Internal IP range keys
    │   └── id_rsa
    ├── github.com        // Keys for github.com only
    │   └── id_ecdsa
    ├── kloudkit.com      // Keys for kloudkit.com only
    │   └── id_ed25519
    ├── signingkey        // Private key for signing `git` commits
    └── signingkey.pub    // Public key for signing `git` commits
```

### SSH Agent

The *oh-my-zsh* `ssh-agent` plugin starts an agent with your first shell and loads your `~/.ssh/id_*` keys,
so you do not have to re-enter your passphrase for each connection.

## Server

An SSH server can be configured to launch upon workspace startup.
All configurations within `/etc/ssh/sshd_config` have undergone a thorough review and
carefully tuned to strengthen security measures.

For security purposes, the server is published on the non-default port `2222`.
