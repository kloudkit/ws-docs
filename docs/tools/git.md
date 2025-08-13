# Git

![Git logo](/icons/git.svg){.doc-image}

`git` is at the core of every developer's workflow, a tool that cannot be ignored.
As such, a few features are provided out-of-the-box:

- Sane defaults.
- Common and useful aliases.
- User identity injection via environment variables.
- Auto-configured signature key for signed commits.
- Automatic cloning of a remote repository on startup.

## Configuration Lookup

The configuration lookup sequence is as follows:

- **Workspace level *(`/etc/gitconfig`)*:** sane default configurations, aliases,
    and filters *(should not be overridden by the user)*.
- **User level *(`~/.gitconfig`)*:** allowing users to define their personal preferences
    and override configurations found in the *workspace level* file.

## Credential Cache

By default, Git caches your credentials in memory for one hour *(3600 seconds)* using the
built‑in credential helper:

```ini
[credential]
  helper = cache --timeout=3600
```

When authenticating with a remote that requires basic authentication *(such as over HTTPS)*,
Git will automatically reuse the cached credentials until the timeout expires.

The cached username and password are reused until the timeout expires.

Need a different duration?
Set `WS_GIT_CREDENTIAL_CACHE_TIMEOUT` *(seconds)* before launching the container.
Use `-1` to keep credentials for *one year*.

## Configuration Injection

Upon startup, the existence of both `env`s and files we will checked in order to
automatically configure user-level settings.

### Environment Variables

- **`GIT_COMMITTER_NAME`:** sets `[user.name]` in `~/.gitconfig` to the provided value.
- **`GIT_COMMITTER_EMAIL`:** sets `[user.email]` in `~/.gitconfig` to the provided value.
- <EnvVar group="git" name="credential_cache_timeout" />
- <EnvVar group="git" name="clone_repo" />

### Files

- **`~/.ssh/signingkey.pub`:** when this file is present, it activates the automatic
    setting of `[commit.gpgsign]` and `[commit.tag]` configurations to `true`.
- **`~/.ssh/signingkey`:** this is the private counterpart to `~/.ssh/signingkey.pub`,
    used in the signing process.

## Automated Workspace Cloning

In various scenarios, a *workspace* instance may need to automatically clone a remote
repository during startup.
Common use cases include *CI*, short-lived instances used during integration testing, or
environments in the cloud where persistent volumes are costly or impractical.

To facilitate this, you can provide the environment variable `WS_GIT_CLONE_REPO`.
If specified, the *workspace* will clone the repository into `WS_ROOT`
*(default: `/workspace`)* if the directory is empty.

::: info
If the repository requires authentication, ensure the necessary credentials are already
configured within the container before startup *(using other autoload scripts)*.
:::

## Aliases

Aliases can be directly utilized via the `git <alias>` command.
For instance, `git lg` will display a customized commit graph.

The list is a compilation of useful aliases:

- **`amend`:** Reapplies the last commit without modifying its commit message.
- **`clean-gone`:** Removes local branches that no longer have a corresponding remote.
- **`lg`:** Displays a beautiful graphical representation of the commit history.
- **`nah`:** Hard resets the changes and removes untracked files and directories.
- **`pull-theirs`:** Executes a forceful `pull`, and resolve conflicts by favoring remote
    changes over local ones.
- **`uncommit`:** Soft resets the `HEAD` to the previous commit.
- **`wip`:** Stages all changes and creates a new commit with a `"WIP"` message.

To display aliases set for the session in `zsh`, execute the command below:

```sh
alias | grep git
```
