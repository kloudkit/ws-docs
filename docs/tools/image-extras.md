---
see:
  - name: Features
    link: /editor/features
---

# Image Extras <Badge type="tip" text="installable feature" />

<!--@include: ../partials/feature-not-included.md -->

A bundle of four image-investigation tools.
Generate an SBOM, scan container images for known vulnerabilities, and inspect image
layers.

## Installation

Install the bundle using the [features](/editor/features) system:

```sh
# Manual installation
ws feature install image-extras

# Or at boot time
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="image-extras" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

## What's Included

The `image-extras` feature installs four CLIs to `/usr/local/bin`:

- **[`syft`](https://github.com/anchore/syft):** Generate a Software Bill of
  Materials *(SBOM)* for a container image, directory, or filesystem.
- **[`grype`](https://github.com/anchore/grype):** Vulnerability scanner.
  Reads an SBOM from `syft` *(or scans an image directly)*.
- **[`dive`](https://github.com/wagoodman/dive):** Interactive TUI for exploring a container
   image's layers and discovering bloat.
- **[`osv-scanner`](https://github.com/google/osv-scanner):** Layer-aware vulnerability
  scanner from Google.

## Typical Workflow

```sh
# Generate an SBOM for an image (cacheable)
syft ghcr.io/kloudkit/workspace:dev -o json > sbom.json

# Scan the SBOM against current CVE feeds
grype sbom:sbom.json --only-fixed

# Second opinion with layer attribution
osv-scanner --sbom sbom.json

# Inspect image layers interactively
dive ghcr.io/kloudkit/workspace:dev
```
