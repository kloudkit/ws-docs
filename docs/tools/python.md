---
description: "Kloud Workspace ships Python 3.13 with pip, uv, pixi, ruff, the Pyrefly language server, and automatic venv activation."
see:
  - name: Features
    link: /editor/features
  - name: Settings
    link: /editor/settings
  - name: ws-cli Templates
    link: /tools/ws-cli#ws-cli-template
---

# Python

![Python logo](/icons/python.svg){.doc-image width=250px}

Kloud Workspace ships a Python toolchain that is ready to use:

- **Python 3.13** runtime.
- Both `pip` and the `uv` package manager.
- The `pixi` package manager for conda and PyPI environments.
- Automatic virtual environment activation when you `cd` into a project directory.
- Linting and formatting with `ruff` and its VS Code extension.
- Code intelligence from Meta's **Pyrefly** language server.
- An `IPython` profile in the Kloud Workspace colors *(IPython itself is not preinstalled)*.

## Additional Packages & Tools

When a new container starts, the workspace installs the Python packages and CLI tools listed in two variables:

- <EnvVar group="pip" name="additional_packages" />
- <EnvVar group="uv" name="additional_tools" />

Both accept a **space-delimited** list.
Use `pip` to install importable libraries into the user site, and `uv` to install global CLI tools.

```sh{2,3}
docker run \
  -e WS_PIP_ADDITIONAL_PACKAGES="httpx==0.27.0 rich" \
  -e WS_UV_ADDITIONAL_TOOLS="poetry==1.8.0 cookiecutter" \
  ghcr.io/kloudkit/workspace:v0.6.0
```

## Package Management with `uv`

Use `uv` for day-to-day dependency work.
It resolves dependencies fast, installs reproducibly from a lock file,
and works with `requirements.txt` and `pyproject.toml`.

## Automatic `venv` Activation

When you `cd` into a directory that contains a `.venv` or `venv` folder,
the **auto-venv** plugin activates its virtual environment, and leaving the project deactivates it.
It checks only the directory you `cd` into:
a terminal opened inside a project, or a `cd` straight into a subdirectory, activates nothing.
It works with environments created by `uv venv` or `python -m venv`.

To activate a new environment right away, create it at the project root and run `cd .`:

```sh
uv venv
cd .
```

## Conda Environments with `pixi` <Badge type="info" text="since v0.6.0" />

`pixi` manages per-project conda and PyPI environments from a `pixi.toml` or `pyproject.toml`.
Tools you install with `pixi global install` land in `~/.local/pixi/bin`, which is on `PATH`.
For settings every user shares, such as a channel mirror, add `/etc/pixi/config.toml`.

## Linting & Formatting with `ruff`

Kloud Workspace bundles **Ruff** and its VS Code extension, for feedback as you type.
The default configuration is opinionated:

- A cache in `~/.cache/ruff`.
- Fixes applied automatically.
- An indent width of 2 and a maximum line length of 80.
- *Python 3.13* as the target version.
- A ruleset that selects and ignores specific error codes from several linting plugins.
- Formatting with `lf` line endings, including code in docstrings.
- Rules for import sorting and type-checking blocks.
- Per-file overrides that turn off the docstring rules in test directories.

### Configuration Lookup

The default Ruff configuration lives at `~/.config/ruff/ruff.toml` and suits most projects.
For custom linting rules, add a `ruff.toml` or `.ruff.toml` file at your project's root:
it replaces the default configuration instead of extending it.

To start from the default, copy it into the project as `.ruff.toml`:

```bash
ws-cli template apply ruff
```

## Language Server

Meta's **Pyrefly** is the Python language server, with strict type checking on by default.
It honors the standard Pyrefly configuration.

For a lighter language server, override the editor settings with `WS_EDITOR_SETTINGS_MERGE`:
turn off `python.pyrefly.*` and select the language server you prefer.

## Optional Interactive Shell

For a richer *REPL*, install `IPython`:

```sh
pip install ipython
```

Kloud Workspace already includes an IPython profile *(`/etc/ipython/ipython_config.py`)*
whose prompt colors and syntax highlighting match the workspace theme.

IPython installed with `pip` outside a virtual environment picks up these settings.
Inside a virtual environment, also install `catppuccin[pygments]`, which the profile's colors need.
