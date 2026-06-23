import { execSync } from "node:child_process"

execSync("node ./scripts/generate-dependencies.mjs", { stdio: "inherit" })
execSync("node ./scripts/generate-deprecated-variables.mjs", { stdio: "inherit" })
execSync("node ./scripts/generate-environment-variables.mjs", { stdio: "inherit" })
execSync("node ./scripts/generate-extensions.mjs", { stdio: "inherit" })
execSync("node ./scripts/generate-fonts.mjs", { stdio: "inherit" })
execSync("node ./scripts/generate-fs-manifest.mjs", { stdio: "inherit" })
execSync("node ./scripts/generate-changelog.mjs", { stdio: "inherit" })
