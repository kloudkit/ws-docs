<template>
  <div class="vp-doc container">
    <div class="language-sh">
      <button title="Copy Code" class="copy"></button>
      <span class="lang">sh</span>
      <pre
        class="shiki catppuccin-frappe vp-code"><code><span class="line"><span style="color:#737994;font-style:italic;"># TL-DR; ⚡ Power your batteries now!</span></span>
<span class="line"></span><span class="line"><span style="color:#8CAAEE;font-style:italic;">docker</span><span style="color:#A6D189;"> pull</span><span style="color:#A6D189;"> ghcr.io/kloudkit/workspace:v0.1.2</span></span></code></pre>
    </div>
  </div>

  <div class="HomeRow odd">
    <div class="container">
      <div class="vp-doc">
        <h3>More Than a Container</h3>

        <p class="lead">
          <em>Kloud Workspace</em> is an ecosystem of tools designed
          to work together.
        </p>

        <ul>
          <li>Deploy with <a href="/pages/getting-started#basic">Helm →</a></li>
          <li>Extend with the <a href="/editor/features#feature-store">Feature Store →</a></li>
          <li>Manage everything from the <a href="/tools/ws-cli">CLI →</a></li>
        </ul>
      </div>

      <div class="d-grid">
        <img width="120px" src="/icons/bolt.svg">
        <img width="120px" src="/icons/helm.svg">
        <img width="120px" src="/icons/box.svg">
      </div>
    </div>
  </div>

  <div class="HomeRow">
    <div class="container">

      <img src="/home/tools.png">

      <div class="vp-doc">
        <h3>Preinstalled Tools &amp; Extensions</h3>

        <p class="lead">
          <em>Kloud Workspace</em> fosters simplicity &mdash; and embrace
          conventions over configuration to enhance productivity,
          consistency, and minimizes the explicit definitions and
          configuration overhead.
        </p>

        <p class="lead">
          The latest development environment with essential tools and
          extensions to expedite the onboarding process and ensures a
          seamless start of your coding tasks.
        </p>

        <a href="/tools/overview">More →</a>

        <h3>Languages</h3>

        <p class="lead">
          We've got you covered with the top three programming languages.
        </p>

        <div class="d-grid">
          <img width="120px" src="/icons/nodejs.svg">
          <img width="130px" src="/icons/python.svg">
          <img width="150px" src="/icons/golang.svg">
        </div>
      </div>
    </div>
  </div>

  <div class="HomeRow odd">
    <div class="container">

      <div class="vp-doc">
        <h3>Matching Color Palette</h3>

        <p class="lead">
          Enhances visual aesthetics and improves coding efficiency by
          providing a cohesive and harmonious interface, reducing visual
          clutter and cognitive load for developers.
        </p>

        <a href="/editor/theme-and-fonts#theme">More →</a>

        <h3>Hand Picked Fonts</h3>

        <p class="lead">
          All typography was carefully selected according to its intended
          context and place of use.
        </p>

        <p class="lead">
          Dedicated fonts are available for use in the terminal, editor,
          or for comments.
        </p>

        <ul>
          <li>Fira Code</li>
          <li>Meslo LGS</li>
          <li>Victor Mono</li>
        </ul>

        <a href="/editor/theme-and-fonts#fonts">More →</a>
      </div>

      <img src="/home/design.png">
    </div>
  </div>

  <div class="HomeRow">
    <div class="container">

      <img src="/home/deploy.png">

      <div class="vp-doc">
        <h3>Deploy Anywhere</h3>

        <p class="lead">
          With <em>Kloud Workspace</em>, your development environment is not
          only isolated and safeguarded but also becomes effortlessly
          portable.
        </p>

        <p class="lead">
          Use your existing deployment infrastructure or cloud provider,
          and <em>Kloud Workspace</em> will empower you to elevate your
          development workflow to the cloud with ease and confidence.
        </p>

        <p class="lead">
          Deployable on any platform.
        </p>

        <div class="d-grid">
          <img width="150px" src="/icons/docker.svg">
          <img width="130px" src="/icons/k8s.svg">
          <img width="150px" src="/icons/gcp.svg">

          <img width="175px" src="/icons/openshift.svg">
          <img width="150px" src="/icons/aws.svg">
          <img width="135px" src="/icons/azure.svg">
        </div>

      </div>
    </div>
  </div>

</template>


<style scoped>
.vp-doc.container .language-sh {
  margin: 3em auto;
  width: 625px;
  font-size: 130%;
}

.vp-doc p {
  text-align: left;
}

.d-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-items: center;
}

.HomeRow {
  padding: 2em 0;
}

.HomeRow.odd {
  background: #292c3c;
}

.HomeRow .container {
  display: grid;
  gap: 32px;
  grid-template-columns: 1fr 1fr;
  max-width: 1152px;
  margin: 0 auto;
}

.HomeRow img {
  border-radius: 12px;
}

</style>
