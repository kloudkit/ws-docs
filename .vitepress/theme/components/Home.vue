<template>
  <div class="vp-doc container">
    <div class="language-sh">
      <button title="Copy Code" class="copy"></button>
      <span class="lang">sh</span>
      <pre
        class="shiki catppuccin-frappe vp-code"><code><span class="line"><span style="color:#737994;font-style:italic;"># TL;DR: pull the workspace image</span></span>
<span class="line"></span><span class="line"><span style="color:#8CAAEE;font-style:italic;">docker</span><span style="color:#A6D189;"> pull</span><span style="color:#A6D189;"> ghcr.io/kloudkit/workspace:v0.6.0</span></span></code></pre>
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
          <li>Deploy with <a href="/pages/getting-started#installation">Helm →</a></li>
          <li>Extend with <a href="/editor/features">features →</a></li>
          <li>Manage everything from the <a href="/tools/ws-cli">CLI →</a></li>
        </ul>
      </div>

      <div class="d-grid">
        <img width="200px" src="/icons/bolt.svg">
        <img width="150px" src="/icons/helm.svg">
        <img width="175px" src="/icons/box.svg">
      </div>
    </div>
  </div>

  <div class="HomeRow">
    <div class="container">

      <img src="/home/tools.png">

      <div class="vp-doc">
        <h3>Preinstalled Tools & Extensions</h3>

        <p class="lead">
          <em>Kloud Workspace</em> favors convention over configuration,
          so you define and configure less.
        </p>

        <p class="lead">
          The tools and VS Code extensions you need come preinstalled,
          so you can start coding without setting up a machine.
        </p>

        <a href="/tools/overview">More →</a>

        <h3>Languages</h3>

        <p class="lead">
          These languages come preinstalled, with their package managers.
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
          The editor theme, the terminal prompt and tools such as bat,
          k9s and vim share one palette, Catppuccin Frappé.
        </p>

        <a href="/editor/theme-and-fonts#theme">More →</a>

        <h3>Hand-Picked Fonts</h3>

        <p class="lead">
          The workspace serves its fonts to your browser, so there is
          nothing to install on your machine.
        </p>

        <p class="lead">
          The editor, the terminal and code comments each have their own font.
        </p>

        <ul>
          <li>FiraCode in the editor</li>
          <li>MesloLGS in the terminal</li>
          <li>Victor Mono for comments</li>
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
          With <em>Kloud Workspace</em>, your development environment runs in
          a container: isolated from the host, and the same on every machine
          that runs the image.
        </p>

        <p class="lead">
          Run <em>Kloud Workspace</em> on the infrastructure or cloud provider
          you already use, and move your development work to the cloud.
        </p>

        <p class="lead">
          Deploy it on any platform that runs containers.
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
