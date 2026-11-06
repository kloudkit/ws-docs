---
description: "How a change reaches Kloud Workspace: branches, pull requests, commit messages and checks."
see:
  - name: Contribute
    link: /contribute/
  - name: Development Environment
    link: /contribute/development-environment
  - name: Code of Conduct
    link: /contribute/code-of-conduct
---

# Contribution Workflow

Send a change as a pull request from a `feature/<name>` branch to `main`.

::: tip
Everyone taking part follows the [Code of Conduct](/contribute/code-of-conduct).
Report unacceptable behavior to <info@kloud.email>.
:::

## Branches and Pull Requests

Every repository has one long-lived branch, `main`, and every pull request targets it.
Releases are tags cut from `main`.

1. Fork the repository, or create the branch directly if you have write access.
2. Create a branch named `feature/<name>` from `main`.
   `<name>` is the thing you add or change, in lowercase kebab case *(`feature/tshark`, not `feature/add-tshark`)*.
3. Commit your change and push the branch.
4. Open a pull request against `main`.
5. A maintainer reviews it and squash-merges it, so the pull request title becomes the commit on `main`.

## Commit Messages and Titles

Start with a [gitmoji](https://gitmoji.dev), then a capitalized imperative, in at most 72 characters:

```text
✨ Add the tshark feature
🐛 Fix the proxy redirect for paths with a query
📝 Document the feature store tags
```

- Pick the emoji that matches the change: `✨` for a new feature or tool, `🐛` for a fix, `📝` for docs,
  `➕` to add a dependency and `⬆️` to upgrade one.
- The pull request title follows the same rule, since it becomes the commit on `main`.
- Reference an issue at the end of the title by its full name, because issues live in `ws-meta`:
  `closes kloudkit/ws-meta#44`.
- Leave the pull request number out; GitHub appends it on merge.

## Checks

Run the linters before you push:

```sh
pre-commit run --all-files
```

CI runs the same lint and build on every pull request, including pull requests from forks.

Keep each pull request small and focused on one change.
