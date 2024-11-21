# Git

![Git logo](/tools/git.svg 'class=doc-image')

`git` is at the core of every developer's workflow, at tool that cannot be ignored.
As such, a few features are provided out-of-the-box:

- Sane defaults.
- Common and useful aliases.
- User identity injection via environment variables.
- Auto-configured signature key for signed commits.

## Configured Lookup

The configuration lookup sequence is as follows:

- **Workspace level *(`/etc/gitconfig`)*:** sane default configurations, aliases,
    and filters *(should not be overridden by the user)*.
- **User level *(`~/.gitconfig`)*:** allowing users to define their personal preferences
    and override configurations found in the *workspace level* file.

## Configuration Injection

Upon startup, the existence of both `env`s and files we will checked in order to
automatically configure user-level settings.

### Environment Variables

- **`GIT_COMMITTER_NAME`:** sets `[user.name]` in `~/.gitconfig` to the provided value.
- **`GIT_COMMITTER_EMAIL`:** sets `[user.email]` in `~/.gitconfig` to the provided value.

### Files

- **`~/.ssh/signingkey.pub`:** when this file is present, it activates the automatic
    setting of `[commit.gpgsign]` and `[commit.tag]` configurations to `true`.
- **`~/.ssh/signingkey`:** this is the private counterpart to `~/.ssh/signingkey.pub`,
    used in the signing process.

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
