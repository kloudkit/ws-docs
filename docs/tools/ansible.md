---
description: "Ansible comes ready in Kloud Workspace for automating configuration management, deployment, and orchestration with declarative YAML."
see:
  - name: Python
    link: /tools/python
  - name: Ansible Configurations
    link: https://docs.ansible.com/ansible/latest/reference_appendices/config.html
    target: _blank
---

# Ansible

![Ansible logo](/icons/ansible.svg){.doc-image}

> Ansible is a popular automation tool that simplifies IT tasks, such as configuration
> management, application deployment, and orchestration.
>
> It uses a declarative YAML syntax to ensure consistent and reliable setup of systems
> and applications across diverse environments.

## Overview

Kloud Workspace is pre-configured with `ansible-core`, `ansible-lint`, VS Code extensions
for Ansible, and popular community collections, all ready to use right out of the box.

::: danger
The workspace ships a recent `ansible-core`, which needs *Python 3.9* or later on target
machines.
:::

## Setting User Configurations

Kloud Workspace includes default settings in the `/etc/ansible/ansible.cfg` file.
You can override these settings with environment variables, or with an `ansible.cfg` in the
current directory.

Prefer environment variables: a local `ansible.cfg` replaces `/etc/ansible/ansible.cfg`
entirely, including the `home` setting that points Ansible at the preinstalled collections.

## Triggering Playbooks for Kloud Workspace

Kloud Workspace includes a default Ansible inventory file *(`/etc/ansible/hosts`)* with a
group named `workspace` that runs on `localhost` with root privileges.
This can be used to trigger playbooks in the current workspace environment.

```yaml
- name: Say hello to the world
  gather_facts: false
  hosts: workspace

  tasks:
    - name: Just saying hello
      ansible.builtin.debug:
        msg: Hello world! 👋
```
