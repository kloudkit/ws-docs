# Contribution Workflow & Style Guides

::: tip
This project and everyone participating in it is governed by the
[KloudKIT's Code of Conduct](/contribute/code-of-conduct).
By participating, you are expected to uphold this code.

**Please report unacceptable behavior to <info@kloud.email>.**
:::

## We Develop with GitHub

![Github](/icons/github.svg){.doc-image width=200px}

We utilize GitHub's services at the core of our development:

- To host code.
- To track issues and feature requests.
- Accept and review pull requests.
- Build and deploy artifacts and documentation

## Workflow

### Branching Scheme

The **Forking Workflow** is fundamentally different than other popular Git workflows.
Instead of using a single server-side repository to act as the *central* codebase, it
gives every developer their own server-side repository.

The main advantage of the **Forking Workflow** is that contributions can be integrated
without the need for everybody to push to a single central repository.
Developers push to their own server-side repositories, and only the project maintainer can
push to the official repository.
This allows the maintainer to accept commits from any developer without giving them write
access to the official codebase.

The workflow typically follows a branching model based on the
[Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).
This means that complete feature branches will be purposed for merge into the original
project maintainer's repository.

![Gitflow](/contribute/contribution-workflow/gitflow.png)

In this model, a repository has two main branches:

1. **Main:** This is a highly stable branch that is always production-ready and contains
    the latest release version of the published package.

2. **Develop:** Derived from the master branch, the development branch serves as a branch
    for integrating different features planned for an upcoming release.
    This branch may or may not be as stable as the master branch.
    It is where developers collaborate and merge feature branches.
    It contains a version that is due to be released in an upcoming version.

::: warning
The previous two branches are the starting points for any project.
They are very important and should be protected against accidental deletion and merging.
Only authorized contributors or project owners should be given the responsibility to merge
changes from other branches &mdash; such as the feature branch, which we’ll discuss later &mdash;
to the `develop` or `main` branches.
:::

Apart from the two abovementioned primary branches, there are other branches in the workflow:

1. **Feature:** The feature branch splits from the develop branch and merges back to the
    develop branch after a feature is complete.
    The conventional naming of this branch starts with `feature/*` in lower-kebab-case
    *(i.e. `feature/some-new-super-cool-feature`)*.

    This branch is mostly created and used by developers collaborating with teams.
    The purpose of the feature branch is to develop small modules of a feature in a
    project.

    The lifetime of a feature branch ends once it merges with the develop branch.
    Features are generally not published to the remote repository, unless multiple
    developers or teams are working on the same feature.

2. **Hotfix:** The hotfix branch is derived from the master branch and merged back after
    completion to the develop and master branches.

    By convention, the name of this branch starts with `hotfix/*` in lower-kebab-case
    *(i.e. `hotfix/oops-we-found-a-not-so-cool-bug`)*.
    This branch is created and used after a particular version of product is released to
    provide critical bug fixes for the production version.

#### Step-by-Step

::: tip
The section below was extracted from an online tutorial, for a more in-depth explanation,
have a look at the
[original tutorial](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow).
:::

The following is a step-by-step example of this workflow:

1. Developer creates a [*fork*](https://github.com/kloudkit/workspace/fork) of **Kloud Workspace**.
2. Cloned to their local system.
3. A Git remote path for the *official* repository is added to the local clone.
4. A new local feature branch is created *(usually a `feature/*` branch)*.
5. The developer makes changes on the new branch.
6. New commits are created for the changes.
7. The branch gets pushed to the developer's fork.
8. The developer opens a pull request from the new branch to the *official* repository.
9. The pull request gets approved for merge and is merged into the original server-side repository.

## Style Guides

### Git Commit Messages

- Start all commit messages with a capital letter *(and an emoji, `"🚚 Move configs to root"`)*.
- Use the present tense *(i.e. `"Add feature..." not "Added feature..."`)*.
- Use the imperative mood *(i.e. `"Move cursor to..."` not `"Moves cursor to..."`)*.
- Limit the first line to 72 characters or less.
- Reference issues and pull requests at the end of the first line following a `,`
    *(i.e. `"Add feature log, closes #44"`)*.

### Documentation Style Guide

- **TBD**

### File Conventions

The project structure is split into various folder for organizational purposes.
The trees below displays the main files and folders and their intended use.

::: code-group

```text [Workspace]
.
├── .github         # Workflows, issue/pr templates, and other GitHub related assets
├── .gitignore      # Files to not track in `git`
├── renovate.json   # Track dependency versions
├── src             # The main directory for image assets and build steps
│   ├── build       # Helper scripts and dependency definitions
│   ├── home        # Directory mapped to `~` in the container
│   ├── ipc-server  # IPC server extension for Kloud Workspace
│   └── rootfs      # Directory mapped to `/` in the container
└── tests           # Test bench
    ├── browser     # Browser tests using playwright
    ├── helpers     # Fixtures, consts, utilities, and test bootstrapping
    ├── integration # Integration tests using Docker
    ├── scripts     # Helper scripts
    └── stubs       # Stub *(dummy)* data used for tests
```

```text [Docs]
.
├── .github         # Workflows, pr templates, and other GitHub related assets
├── .gitignore      # Files to not track in `git`
├── .vitepress      # Configuration and theme for the website
├── docs            # Resource root
│   ├── *.md        # Actual documentation files
│   ├── index.md    # Documentation entrypoint
│   └── public
│       └── *       # Static assets
├── node_modules    # Node packages (git-ignored)
├── nginx.conf      # nginx configurations
├── package.json    # Node package dependencies (should be changed using `npm`)
├── scripts         # Helper scripts
└── yarn.lock       # Current status of installed npm modules (should not be edited)
```

```text [CLI]
.
├── .github         # Workflows, pr templates, and other GitHub related assets
├── .gitignore      # Files to not track in `git`
├── cmd             # Source for command helpers
│   └── *
├── internals       # Service classes to be used by commands
│   └── *
├── go.mod          # Golang package dependencies (should be changed using `go`)
├── go.sum          # Current status of installed golang modules (should not be edited)
└── main.go         # CLI entrypoint
```

:::
