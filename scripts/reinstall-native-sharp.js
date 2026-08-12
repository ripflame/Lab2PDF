const { execSync } = require("child_process");
const os = require("os");
const { dependencies } = require("../package.json");

const [argPlatform, argArch] = process.argv.slice(2);
const platform = argPlatform || os.platform();
const arch = argArch || os.arch();

if (!argPlatform || !argArch) {
  console.log(`No platform/arch given, defaulting to host: ${platform}/${arch}`);
}

const version = dependencies.sharp.replace(/^[\^~]/, "");

console.log(`Reinstalling sharp@${version} for ${platform}/${arch} (node_modules only)...`);
execSync("npm uninstall sharp --no-save", { stdio: "inherit" });
execSync(`npm install sharp@${version} --no-save --os=${platform} --cpu=${arch}`, {
  stdio: "inherit",
});
console.log("Done.");
