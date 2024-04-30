---
see:
  - name: Ansible Configurations
    link: https://docs.ansible.com/ansible/latest/reference_appendices/config.html
---

# Ansible

> Ansible is popular automation tool that simplifies IT tasks, such as configuration management,
> application deployment, and orchestration.
> It uses declarative YAML syntax to ensure systems and applications are set up consistently and
> reliably across diverse environments.

## Overview

The Kloud *workspace* comes with `ansible-core`, `ansible-lint`, VSCode extensions for Ansible,
and popular community collections, all pre-installed and configured with the necessary settings
right out of the box.

## Setting User Configurations

The *workspace* includes basic configurations in the `/etc/ansible/ansible.cfg` file.
You can completely override these settings by creating your own `ansible.cfg` in your playbook's
directory or through environment variables.

We recommend using environment variables, since their values are merged with those in the
`/etc/ansible/ansible.cfg` *(instead of completely overriding them)*.
