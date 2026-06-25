---
description: "Install the .NET SDK, runtime, and ASP.NET Core runtime in Kloud Workspace with the opt-in dotnet feature for cross-platform C# development."
see:
  - name: Features
    link: /editor/features
---

# .NET <Badge type="tip" text="installable feature" />

<!--@include: ../partials/feature-not-included.md -->

![.NET logo](/icons/dotnet.svg){.doc-image width=150px}

.NET is a free, cross-platform, open-source developer platform for building many
kinds of applications — web, cloud, desktop, and services — primarily with C#.

The `dotnet` feature installs the .NET SDK, runtime, and ASP.NET Core runtime.

## Installation

Install .NET using the [features](/editor/features) system:

```sh
# Manual installation
ws feature install dotnet

# Or at boot time
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="dotnet" \
  ghcr.io/kloudkit/workspace:v0.4.0
```

## Selecting a .NET Version

By default the `dotnet` feature installs **.NET 10.0**.
Choose a different band with the [`version` opt](/editor/features#optional-variables):

```sh
# Manual installation
ws feature install dotnet --opt version=9.0

# Or at boot time
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="dotnet" \
  -e WS_FEATURES_DOTNET_OPTS="version=9.0" \
  ghcr.io/kloudkit/workspace:v0.4.0
```

> Supported versions: **8.0**, **9.0**, and **10.0** *(default)*.

Each band installs side-by-side, so you can select several by installing the
feature more than once. List the installed SDKs with `dotnet --list-sdks`.

::: warning

The Microsoft trixie feed publishes **8.0** and **9.0** for `amd64` only —
on `arm64` the feature supports **10.0** only. Requesting `version=8.0` or
`version=9.0` on an `arm64` workspace fails fast with a clear message.

:::

## What's Included

Each version band installs:

- **`dotnet-sdk-<version>`:** The .NET SDK — everything needed to build and run
  .NET apps *(includes the runtime)*.
- **`dotnet-runtime-<version>`:** The .NET runtime for running console and
  library apps.
- **`aspnetcore-runtime-<version>`:** The ASP.NET Core runtime for running web
  apps and services.

## Configuration

The workspace sets sensible global defaults *(in the shell environment)*:

- **Telemetry is opted out** *(`DOTNET_CLI_TELEMETRY_OPTOUT`)* and the first-run
  banner is suppressed *(`DOTNET_NOLOGO`)*.
- The ASP.NET Core development certificate is **not** generated on first run
  *(`DOTNET_GENERATE_ASPNET_CERTIFICATE`)*.
- User state is kept out of `$HOME`: the .NET CLI home is relocated under
  `~/.local` *(`DOTNET_CLI_HOME`)* and the NuGet package cache under `~/.cache`
  *(`NUGET_PACKAGES`)*. Global tools *(`dotnet tool install -g`)* install to
  `~/.local/.dotnet/tools`, which is on the `PATH`.
