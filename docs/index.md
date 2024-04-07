---
layout: home

hero:
  name: Kloud Workspace
  text: Your kit to the cloud
  tagline: 🔋 A batteries included pre-configured development workspace

  image:
    src: /logo.png

  actions:
    - theme: brand
      text: Getting Started 🚀
      link: /pages/getting-started

    - theme: alt
      text: Documentation
      link: /pages

features:
  - icon: ⚙
    title: Foster simplicity &mdash; Embrace conventions
    details: >
      Conventions over configuration streamlines development, enhances productivity, consistency,
      and minimizes the explicit definition and configuration overhead.

  - icon: 🎨
    title: Matching Color Palette
    details: >
      Enhances visual aesthetics and improves coding efficiency by providing a cohesive and
      harmonious interface, reducing visual clutter and cognitive load for developers.

  - icon: 🛠
    title: Preinstalled Tools &amp; Extensions
    details: >
      The latest development environment with essential tools and extensions to expedite the
      onboarding process and ensures a seamless start of your coding tasks.
---

---

```sh
# TL-DR; ⚡ Power your batteries now!
docker pull ghcr.io/kloudkit/workspace:latest
```

---

Over the past decade, both companies and individual developers have increasingly embraced
cloud-based workflows for CI, deployment, testing, and staging.
Yet, the shift of actual development processes to the cloud has lagged behind.
Despite the convenience and efficiency the cloud offers, developers have largely clung to
the familiar comfort of the *desktop experience*, hesitating to move their development
tools into the cloud.

Recognizing this gap, *Kloud Workspace* was tailored to facilitate this transition.
By packaging the widely-used *VSCode* IDE as a Docker container *(powered by Coder)*,
and integrating the latest development environments along with essential tools and
extensions, we offer a seamless bridge to the cloud.

With *Kloud Workspace*, your development environment is not only isolated and safeguarded
but also becomes effortlessly portable.

Whether you opt to deploy an instance on Docker *(be it locally or remotely)*, Kubernetes,
or OpenShift, *Kloud Workspace* empowers you to elevate your development workflow to the
cloud with ease and confidence.
