---
description: "Report a bug, ask a question or send a change to the public Kloud Workspace repositories."
see:
  - name: Contribution Workflow
    link: /contribute/contribution-workflow
  - name: Development Environment
    link: /contribute/development-environment
  - name: Security Advisory
    link: /contribute/security-advisory
  - name: Code of Conduct
    link: /contribute/code-of-conduct
---

# Contribute

Bug reports, ideas and fixes are welcome.
Issues and planning for every Kloud Workspace repository live in
[`kloudkit/ws-meta`](https://github.com/kloudkit/ws-meta).

## Where to Go

| You have              | Go to                                                                         |
| --------------------- | ----------------------------------------------------------------------------- |
| A bug                 | [Report a bug][bug]                                                           |
| An idea for a feature | [Request a feature][feature]                                                  |
| A gap in these docs   | [Request docs][docs]                                                          |
| A question            | [Ask in Discussions][question]                                                |
| A vulnerability       | [Report it privately](/contribute/security-advisory), never in a public issue |

## Send a Change

These repositories are public and take pull requests:

| Repository                                                         | Holds                      |
| ------------------------------------------------------------------ | -------------------------- |
| [`ws-docs`](https://github.com/kloudkit/ws-docs)                   | This documentation site    |
| [`ws-cli`](https://github.com/kloudkit/ws-cli)                     | The `ws-cli` command       |
| [`ws-feature-store`](https://github.com/kloudkit/ws-feature-store) | The offline feature store  |
| [`ws-helm`](https://github.com/kloudkit/ws-helm)                   | The Helm chart *(on hold)* |

The workspace image is built from a private repository.
To change the image, [open an issue](https://github.com/kloudkit/ws-meta/issues/new/choose) in `ws-meta`.

Read the [contribution workflow](/contribute/contribution-workflow) before you open a pull request.

## Fix a Page

Most pages have an **Edit this page on GitHub** link at the bottom.
The generated tables *(environment variables, tools, extensions, commands and the changelog)* come from other
repositories, so report a fix to them as an issue instead.

[bug]: https://github.com/kloudkit/ws-meta/issues/new?template=bug_report.yaml
[feature]: https://github.com/kloudkit/ws-meta/issues/new?template=feature_request.yaml
[docs]: https://github.com/kloudkit/ws-meta/issues/new?template=docs_request.yaml
[question]: https://github.com/kloudkit/ws-meta/discussions/new?category=q-a
