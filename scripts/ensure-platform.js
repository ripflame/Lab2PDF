const os = require("os");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Get the current platform
const platform = os.platform();
const platformFlag = platform === "darwin" ? "darwin" : "win32";

// Define the platform-specific package names to look for
const platformPackages = {
  darwin: ["@img/sharp-darwin-arm64", "@img/sharp-darwin-x64"],
  win32: ["@img/sharp-win32-x64", "@img/sharp-win32-ia32"],
};

// Check if Sharp is installed with the correct platform
let needsReinstall = true; // Default to reinstalling if we can't determine

try {
  // Check if the correct platform-specific packages exist in node_modules
  const sharpModulePath = path.join(__dirname, "..", "node_modules", "sharp");

  if (fs.existsSync(sharpModulePath)) {
    const packageJsonPath = path.join(sharpModulePath, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      const sharpPackage = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      // Check if any of the platform-specific packages for the current platform are present
      const requiredPackages = platformPackages[platformFlag];

      // Look through node_modules to see if the platform-specific packages are installed
      needsReinstall = !requiredPackages.some((pkg) => {
        return fs.existsSync(path.join(__dirname, "..", "node_modules", pkg));
      });

      console.log(`Platform packages needed: ${requiredPackages.join(", ")}`);
      console.log(`Need to reinstall: ${needsReinstall}`);
    }
  }
} catch (error) {
  console.error("Error checking Sharp installation:", error);
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
