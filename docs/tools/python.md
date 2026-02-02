# Python

![Python logo](/icons/python.svg){.doc-image width=250px}

Python is central to countless development workflows, and Kloud Workspace ships with a
finely‑tuned Python toolchain to keep you productive.

Key features provided *out‑of‑the‑box*:

- **Python 3.11** runtime, ready for immediate use.
- Both `pip` and the lightning‑fast `uv` package manager.
- Automatic virtual environment activation when navigating into project directories.
- Opinionated linting & formatting with `ruff` its IDE extension.
- Language‑intelligence powered by *Jedi* *(Pylance is unavailable in non‑official VS Code builds)*.
- Pre‑generated `IPython` *(itself, not pre‑installed)* profile that matches the Kloud Workspace
    color palette.

## Package Management with `uv`

For day‑to‑day dependency work, we recommend `uv`, which offers:

- Near instant dependency resolution.
- Deterministic, lock‑file–friendly installs.
- Seamless compatibility with `requirements.txt` and `pyproject.toml`.

## Automatic `venv` Activation

Kloud Workspace includes an **auto-venv** plugin that automatically activates Python
virtual environments when you navigate into a project directory.

When you `cd` into a directory containing a `.venv` or `venv` folder, the virtual
environment is activated automatically.

When you leave the project directory, it deactivates.

This works seamlessly with `uv venv` or `python -m venv`:

## Linting & Formatting with `ruff`

Kloud Workspace bundles **Ruff** and its VSCode extension for real‑time feedback.
Our default configuration is *deep and opinionated*:

- Custom caching and line formatting behavior.
- Auto-fixing capabilities enabled by default.
- Fine-tuned rules for indentation width and maximum line length.
- Targeting *Python 3.11* for compatibility alignment.
- A carefully selected ruleset that includes and excludes specific error codes from multiple
    linting plugins.
- Context-aware formatting such as consistent line endings and formatting of docstring code.
- Special rules for import sorting and type-checking blocks.
- Per-file rule overrides to reduce noise in test directories.

### Configuration Lookup

Kloud Workspace ships with a default Ruff configuration at `~/.config/ruff/ruff.toml` that
suits most projects.
If you need custom linting rules, add a `ruff.toml` file at your project’s root.

You can also copy the default configuration with:

```bash
ws-cli template apply ruff
```

For more details, refer to the [`ws-cli` documentation](/tools/ws-cli#configurations-ws-config).

## IDE Compatibility & Language Server

Kloud Workspace aims to provide the best Python development experience.
However, due to licensing constraints, limitations exist in language server integrations.

Kloud Workspace is *not* an official Microsoft build of VSCode, and therefore, the proprietary
[Pylance][] extension and language server is not available.

Instead, Kloud Workspace ship the open-source [Jedi Language Server][], offering robust language
server features such as:

- Blazing‑fast code completion.
- Go‑to‑definition & symbol search.
- Basic refactorings.

## Optional Interactive Shell

For an enhanced *REPL* experience you can install `IPython`:

```sh
pip install ipython
# or: uv pip install ipython
```

Kloud Workspace already includes a custom IPython profile *(`/etc/ipython/ipython_config`)* whose
prompt colors and syntax‑highlighting align with the Kloud Workspace's overall theme.

Once IPython is installed it will pick up these settings automatically—no additional
configuration required.

[Pylance]: https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance
[Jedi Language Server]: https://github.com/pappasam/jedi-language-server
