const { execSync } = require("child_process");
const { dependencies } = require("../package.json");

const [platform, arch] = process.argv.slice(2);

if (!platform || !arch) {
  console.error("Usage: node reinstall-native-sharp.js <platform> <arch>");
  process.exit(1);
}

const version = dependencies.sharp.replace(/^[\^~]/, "");

console.log(`Reinstalling sharp@${version} for ${platform}/${arch} (node_modules only)...`);
execSync("npm uninstall sharp --no-save", { stdio: "inherit" });
execSync(`npm install sharp@${version} --no-save --os=${platform} --cpu=${arch}`, {
  stdio: "inherit",
});
console.log("Done.");
