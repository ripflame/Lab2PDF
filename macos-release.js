// macos-release.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { version } = require("./package.json");

async function main() {
  try {
    // 1. Uninstall and reinstall Sharp
    console.log("Setting up Sharp for macOS...");
    execSync("npm uninstall sharp && npm install sharp", { stdio: "inherit" });

    // 2. Build the macOS app
    console.log("Building macOS app...");
    execSync("electron-builder --mac", { stdio: "inherit" });

    // 3. Get the file paths from the dist directory
    const distDir = path.join(__dirname, "dist");
    const dmgFile = path.join(distDir, `Lab2PDF-${version}.dmg`);
    const ymlFile = path.join(distDir, "latest-mac.yml");

    if (!fs.existsSync(dmgFile) || !fs.existsSync(ymlFile)) {
      throw new Error("Build files not found. Check the build process.");
    }

    // 4. Get the tag name for the current version
    const tagName = `v${version}`;

    // 5. Upload to GitHub release using gh CLI
    console.log(`Uploading to GitHub release ${tagName}...`);
    execSync(`gh release upload ${tagName} "${dmgFile}" "${ymlFile}" --clobber`, {
      stdio: "inherit",
    });

    console.log("macOS files uploaded successfully!");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
