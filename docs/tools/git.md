---
description: "Git in Kloud Workspace comes with sane defaults and aliases, sets your identity and signing key at startup, and can clone a repository for you."
see:
  - name: SSH
    link: /tools/ssh
  - name: Autoload Scripts
    link: /settings/autoload-scripts
---

# Git

![Git logo](/icons/git.svg){.doc-image}

Git comes set up in the workspace, with:

- Sane defaults.
- Common and useful aliases.
- User identity from environment variables.
- An automatically configured signing key for signed commits.
- Automatic cloning of a remote repository on startup.

## Startup Configuration

When a new container starts,
the workspace checks for the environment variables and files below to configure your user-level settings.
For example, set your commit identity:

```sh{2,3}
docker run \
  -e GIT_COMMITTER_NAME="Alice" \
  -e GIT_COMMITTER_EMAIL="alice@example.com" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

### Environment Variables

- **`GIT_COMMITTER_NAME`:** sets `[user.name]` in `~/.gitconfig` to the provided value.
- **`GIT_COMMITTER_EMAIL`:** sets `[user.email]` in `~/.gitconfig` to the provided value.
- <EnvVar group="git" name="credential_cache_timeout" />
- <EnvVar group="git" name="clone_repo" />

### Files

- **`~/.ssh/signingkey.pub`:** when this file is present, `[commit.gpgsign]` and `[tag.gpgsign]` are set to `true`,
  signing with SSH keys.
- **`~/.ssh/signingkey`:** the private counterpart to `~/.ssh/signingkey.pub`, used in the signing process.

## Credential Cache

By default, Git caches your credentials in memory for one hour *(3600 seconds)* with the built-in credential helper:

```ini
[credential]
  helper = cache --timeout=3600
```

When a remote requires basic authentication *(such as over HTTPS)*,
Git reuses the cached username and password until the timeout expires.

For a different duration, set `WS_GIT_CREDENTIAL_CACHE_TIMEOUT` *(seconds)* before you start the container.
Use `-1` to keep credentials for *one year*.

## Automated Workspace Cloning

To clone a remote repository when a new container starts, set `WS_GIT_CLONE_REPO`.
The workspace clones it into `WS_SERVER_ROOT` *(default: `/workspace`)* if the directory is empty.
This suits *CI*, short-lived instances used during integration testing,
and cloud environments where persistent volumes are costly or impractical.

::: info
If the repository requires authentication, provide the credentials before the container starts:
mount `~/.ssh`, [seed](/settings/seed) them, or import them from 1Password.
Your own autoload scripts run after the clone, so they are too late.
:::

## Aliases

Run each alias as `git <alias>`.
For example, `git lg` shows a customized commit graph.

- **`amend`:** Amends the last commit without changing its commit message.
- **`clean-gone`:** Removes local branches that no longer have a corresponding remote.
- **`lg`:** Shows the commit history as a graph.
- **`nah`:** Hard resets the changes and removes untracked files and directories.
- **`pull-theirs`:** Pulls with `--force` and resolves conflicts by favoring remote changes over local ones.
- **`uncommit`:** Soft resets the `HEAD` to the previous commit.
- **`wip`:** Stages every change under the current directory and commits it with the message `🚧 WIP`.

To list these aliases, run:

```sh
git config --get-regexp '^alias\.'
```

The *oh-my-zsh* `git` plugin adds its own shell shortcuts *(such as `g` for `git`)*;
`alias | grep git` lists those.

## Configuration Lookup

Git looks up its configuration in this order:

- **Workspace level *(`/etc/gitconfig`)*:** the default configuration, aliases, and filters
  *(leave this file as it is)*.
- **User level *(`~/.gitconfig`)*:** your personal preferences, which override the configuration in the
  *workspace level* file.
