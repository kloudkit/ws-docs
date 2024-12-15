---
see:
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

The Kloud *workspace* comes pre-configured with `ansible-core`, `ansible-lint`, VSCode
extensions for Ansible, and popular community collections, all ready to use right out of
the box.

::: danger
The workspace includes the latest versions of Ansible preinstalled, which no longer
supports *Python 3.6* on target machines.
To proceed, you must upgrade the target to *Python 3.7* or later.
:::

## Setting User Configurations

The *workspace* includes default settings in the `/etc/ansible/ansible.cfg` file.
You can override these configurations by creating your own `ansible.cfg` in your
playbook's directory or by using environment variables.

We recommend using environment variables, as their values are merged with those in the
`/etc/ansible/ansible.cfg` *(instead of fully replacing them)*.

## Triggering Playbooks for the Workspace

The *workspace* includes a default inventory file *(`/etc/ansible/hosts`)* with a group
named `workspace` that runs on `localhost` with root privileges.
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
