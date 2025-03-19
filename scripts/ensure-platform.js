const os = require("os");
const { execSync } = require("child_process");
const fs = require("fs");

//Get the current platform
const platform = os.platform();
const platformFlag = platform === "darwin" ? "darwin" : "win32";

//Check if Sharp is installed with the correct platform
let needsReinstall = false;

try {
  // Try to check Sharp's platform from package-lock.json or node_modules
  const packageLockPath = "./package-lock.json";
  if (fs.existsSync(packageLockPath)) {
    const packageLock = JSON.parse(fs.readFileSync(packageLockPath, "utf8"));
    const sharpDependency = packageLock.packages["node_modules/sharp"];

    if (sharpDependency && !sharpDependency.os.includes(platformFlag)) {
      needsReinstall = true;
    }
  } else {
    // If package-lock.json doesn't exists, assume we need to need to need to reinstall
    needsReinstall = true;
  }
} catch (error) {
  // If there's any error in the check, assume we need to reinstall
  needsReinstall = true;
}

if (needsReinstall) {
  console.log(`Reinstalling Sharp for ${platformFlag}...`);
  execSync("npm uninstall sharp", { stdio: "inherit" });
  execSync(`npm install sharp --platform=${platformFlag}`, { stdio: "inherit" });
  console.log("Sharp reinstalled successfully.");
} else {
  console.log(`Sharp is already installed correctly for ${platformFlag}.`);
}
