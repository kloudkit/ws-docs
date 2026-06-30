---
description: "The secrets vault has been removed. Secrets are now declared in the seed manifest and projected by the ws-cli seed engine."
see:
  - name: Seed
    link: /tools/seed
  - name: Secrets
    link: /settings/secrets
---

# Vault

::: danger

The secrets vault has been removed. The `ws-cli secrets vault` subcommand, the
`~/.ws/vault/secrets.yaml` manifest, and the standalone autoload step no longer exist.

:::

Secrets now live in the [seed manifest](/tools/seed), projected by the unified `ws-cli seed` engine.
There is no automatic migration — re-author your secrets into `<seed.source>/.seed.yaml`:

- **Inline values** *(the old `type: env` exports)* go in the top-level `secrets:` map and render
  through `${secrets.NAME}` in a `template: true` entry.
- **Whole-file secrets** *(the old `type: ssh`, `kubeconfig`, `generic`, `dockerconfigjson`)* become
  `secret: true` entries keyed by their destination.

The [`ws-cli secrets`](/settings/secrets) encryption primitives — `encrypt`, `decrypt` and
`generate` — are unchanged.

## Next Steps

- [Seed](/tools/seed): declare and project secrets in the unified manifest.
- [Secrets](/settings/secrets): encrypt and decrypt values with `ws-cli secrets`.
