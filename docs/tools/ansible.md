---
description: "Run Ansible playbooks in Kloud Workspace, with ansible-core, ansible-lint, community collections and an inventory for the workspace itself preinstalled."
see:
  - name: Python
    link: /tools/python
  - name: Features
    link: /editor/features
  - name: Ansible Configurations
    link: https://docs.ansible.com/ansible/latest/reference_appendices/config.html
    target: _blank
---

# Ansible

![Ansible logo](/icons/ansible.svg){.doc-image}

The workspace ships `ansible-core`, `ansible-lint`, VS Code extensions for Ansible and popular
community collections, with an inventory that targets the workspace itself.

## Run a Playbook on the Workspace

The default Ansible inventory *(`/etc/ansible/hosts`)* has a group named `workspace` that runs on
`localhost` with root privileges.
Target it to run playbooks in the current workspace environment:

```yaml
- name: Say hello to the world
  gather_facts: false
  hosts: workspace

  tasks:
    - name: Just saying hello
      ansible.builtin.debug:
        msg: Hello world! 👋
```

Save it as `hello.yaml` and run it:

```sh
ansible-playbook hello.yaml
```

Ansible reads that inventory by default, so no `-i` flag is needed.

::: danger
The workspace ships a recent `ansible-core`, which needs *Python 3.9* or later on target
machines.
:::

## Override the Defaults

Kloud Workspace includes default settings in the `/etc/ansible/ansible.cfg` file.
You can override these settings with environment variables, or with an `ansible.cfg` in the
current directory.

Prefer environment variables: a local `ansible.cfg` replaces `/etc/ansible/ansible.cfg`
entirely, including the `home` setting that points Ansible at the preinstalled collections.
