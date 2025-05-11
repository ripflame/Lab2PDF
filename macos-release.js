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
    const dmgBlockmapFile = path.join(distDir, `Lab2PDF-${version}.dmg.blockmap`);
    const zipFile = path.join(distDir, `Lab2PDF-${version}-mac.zip`);
    const zipBlockmapFile = path.join(distDir, `Lab2PDF-${version}-mac.zip.blockmap`);
    const ymlFile = path.join(distDir, "latest-mac.yml");

    // Check if all required files exist
    const requiredFiles = [dmgFile, dmgBlockmapFile, ymlFile, zipFile, zipBlockmapFile];
    const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

    if (missingFiles.length > 0) {
      console.warn(
        "Warning: Some files don't exist:",
        missingFiles.map((f) => path.basename(f)).join(", "),
      );
      console.warn("Will continue with available files...");
    }

    // Filter only existing files for upload
    const filesToUpload = requiredFiles.filter((file) => fs.existsSync(file));

    if (filesToUpload.length === 0) {
      throw new Error("No build files found to upload. Check the build process.");
    }

    // 4. Get the tag name for the current version
    const tagName = `v${version}`;

    // 5. Upload to GitHub release using gh CLI
    console.log(`Uploading to GitHub release ${tagName}...`);
    const filesArg = filesToUpload.map((file) => `"${file}"`).join(" ");
    execSync(`gh release upload ${tagName} ${filesArg} --clobber`, {
      stdio: "inherit",
    });

    console.log("macOS files uploaded successfully!");
    console.log("Uploaded files:");
    filesToUpload.forEach((file) => console.log(`- ${path.basename(file)}`));
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
