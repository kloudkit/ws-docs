# Development Environment

We're really excited that you are interested in contributing to **Kloud Workspace**.
Before submitting your contribution, please make sure to take a moment and read through
the following guidelines:

- [Code of Conduct →](/contribute/code-of-conduct)
- [Contribution Workflow *(Optional)* →](/contribute/contribution-workflow)

## Prerequisites

Before you begin, check your prerequisites meet the minimum requirements versions:

- **Python *(optional)*:** `>=3.8`
- **NodeJS *(docs)*:** `>=18`
- **Golang *(cli)*:** `>=1.21`

::: code-group

```sh [Python]
$ python --version
Python 3.11.2
```

```sh [NodeJS]
$ node --version
v22.11.0
```

```sh [Golang]
$ go version
go version go1.24.0 linux/amd64
```

:::

## Setup

You can clone the repository and run it locally:

### 1. Clone the repository

::: code-group

```sh [Workspace]
git clone https://github.com/kloudkit/workspace
```

```sh [Documentation]
git clone https://github.com/kloudkit/ws-docs
```

```sh [CLI]
git clone https://github.com/kloudkit/ws-cli
```

:::

### 2. Install dependencies

::: code-group

```sh [Linting (optional)]
pip install pre-commit
```

```sh [Documentation]
yarn install
```

```sh [CLI]
go install
```

:::

### 3. Linting *(Optional)*

```sh
pre-commit run --all-files
pre-commit install
```

::: tip
This step is automatically run on all pull requests and commits.
If you choose to skip this step, that's OK, we will run it for you during *CI*.
:::

### 4. Run a local development *(docs)* server

```sh
yarn run docs:dev
```

## Testing

Ensure your local environment meets the minimum requirements before running tests:

- **Python:** `>=3.11`
- **Docker:** `>=25`

### 1. Install Test Dependencies

Install the required Python packages for testing:

```sh
pip install -r tests/requirements.txt
```

### 2. Run Tests

When executing tests for the first time, the test suite will build a Docker testing
image *(`ghcr.io/kloudkit/workspace:tests`)* automatically.

```sh
pytest
```

### 3. Optional Execution Flags

- **Custom Docker Tag:** Use the `--ws-tag` flag to specify a custom Docker image tag.

  ```sh
  pytest --ws-tag=my-custom-tag
  ```

- **Force Image Rebuild:** Add the `--ws-rebuild` flag to rebuild the Docker image.

  ```sh
  pytest --ws-rebuild
  ```
