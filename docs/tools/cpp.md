---
description: "Add a full C and C++ compile-debug-build toolchain to Kloud Workspace with the opt-in cpp feature for performance-critical work."
see:
  - name: Features
    link: /editor/features
---

# C/C++ <Badge type="tip" text="installable feature" />

<!--@include: ../partials/feature-not-included.md -->

![C/C++ logo](/icons/cpp.svg){.doc-image width=150px}

C and C++ are foundational systems programming languages used for performance-critical
software, embedded systems, game engines, and operating systems.

The `cpp` feature brings a full compile-debug-build toolchain into the workspace.

## Installation

Install the C/C++ toolchain using the [features](/editor/features) system:

```sh
# Manual installation
ws feature install cpp

# Or at boot time
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="cpp" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

## Selecting a Compiler Version

By default the `cpp` feature installs `gcc-14` and `g++-14`.
Choose a different major with the [`version` opt](/editor/features#optional-variables):

```sh
# Manual installation
ws feature install cpp --opt version=13

# Or at boot time
docker run \
  -e WS_FEATURES_ADDITIONAL_FEATURES="cpp" \
  -e WS_FEATURES_CPP_OPTS="version=13" \
  ghcr.io/kloudkit/workspace:v0.3.0
```

> Supported versions: **13** and **14** *(default)*.

::: warning

With `version=13`, the unversioned `gcc` and `g++` commands still resolve to
gcc-14 *(the Debian trixie default)*.

Invoke `gcc-13` and `g++-13` directly.

:::

## What's Included

The `cpp` feature installs:

- **cmake:** Cross-platform build system generator, used for configuring C/C++ projects.
- **gcc:** The GNU C compiler.
- **g++:** The GNU C++ compiler front-end *(required for C++ compilation and linking)*.
- **gdb:** The GNU debugger for stepping through and inspecting running programs.
- **gdbserver:** Remote debugging server, useful for debugging programs running in
  separate processes or containers.
- **make:** Classic build automation tool that drives Makefile-based builds.
- **ninja-build:** A fast, minimal build system often used as a CMake backend.

## VS Code Integration

The following extensions are installed automatically:

- **CMake Tools *(`ms-vscode.cmake-tools`)*:** Full CMake workflow integration.
- **Makefile Tools *(`ms-vscode.makefile-tools`)*:** IntelliSense and build support for Makefile.
- **CMake *(`twxs.cmake`)*:** CMake language support with syntax highlighting and auto-completion.
- **Native Debug *(`webfreak.debug`)*:** GDB and LLDB debugger integration.
