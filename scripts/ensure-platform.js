const os = require("os");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const platform = os.platform();
const arch = os.arch();

if (platform !== "darwin" && platform !== "win32") {
  console.log(`Unsupported platform "${platform}" - skipping sharp platform check.`);
  process.exit(0);
}

const requiredPackage = `@img/sharp-${platform}-${arch}`;
const requiredPackagePath = path.join(__dirname, "..", "node_modules", requiredPackage);

let needsReinstall = true; // Default to reinstalling if we can't determine

try {
  if (fs.existsSync(requiredPackagePath)) {
    console.log(`Platform package needed: ${requiredPackage}`);

    try {
      execSync('node -e "require(\'sharp\')"', {
        cwd: path.join(__dirname, ".."),
        stdio: "pipe",
      });
      needsReinstall = false;
    } catch (requireError) {
      console.log(`Found ${requiredPackage} but "require('sharp')" still fails, reinstalling.`);
      needsReinstall = true;
    }
  } else {
    console.log(`Platform package needed: ${requiredPackage} (not found)`);
    needsReinstall = true;
  }

  console.log(`Need to reinstall: ${needsReinstall}`);
} catch (error) {
  console.error("Error checking Sharp installation:", error);
  needsReinstall = true;
}

if (needsReinstall) {
  console.log(`Reinstalling Sharp for ${platform}/${arch}...`);
  execSync(`node ${path.join(__dirname, "reinstall-native-sharp.js")} ${platform} ${arch}`, {
    stdio: "inherit",
  });
} else {
  console.log(`Sharp is already installed correctly for ${platform}/${arch}.`);
}
