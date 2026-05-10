---
see:
  - name: Features
    link: /editor/features
---

# C/C++

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
  ghcr.io/kloudkit/workspace:v0.2.1
```

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
- **Makefile Tools (`ms-vscode.makefile-tools`)*:** IntelliSense and build support for Makefile.
- **CMake (`twxs.cmake`)*:** CMake language support with syntax highlighting and auto-completion.
- **Native Debug (`webfreak.debug`)*:** GDB and LLDB debugger integration.
