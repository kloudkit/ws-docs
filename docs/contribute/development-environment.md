# Development Environment

We're really excited that you are interested in contributing to **Kloud Workspace**.
Before submitting your contribution, please make sure to take a moment and read through
the following guidelines:

- [Code of Conduct →](https://github.com/kloudkit/workspace?tab=coc-ov-file#readme)
- [Contribution Workflow *(Optional)* →](/contribute/contribution-workflow)

## Prerequisites

Before you begin, check your prerequisites meet the minimum requirements versions:

- **Python *(optional)*:** `>=3.8`
- **NodeJS *(docs)*:** `>=18`
- **Golang *(cli)*:** `>=1.21`

::: code-group

```sh [Python]
$ python --version
Python 3.9.10
```

```sh [NodeJS]
$ node --version
v20.10.0
```

```sh [Golang]
$ go version
go version go1.21.6 linux/amd64
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
git clone https://github.com/kloudkit/workspace-docs
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
This step is automatically run on all *PR*s and *commits*.
If you choose to skip this step, thats OK, we will run it for you during *CI*.
:::

### 4. Run a local development *(docs)* server

```sh
yarn run docs:dev
```
