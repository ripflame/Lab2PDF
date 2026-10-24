const { execSync } = require("child_process");
const { version } = require("../package.json");

function ensureRelease() {
  const tagName = `v${version}`;
  const existing = execSync(
    `gh api --paginate repos/{owner}/{repo}/releases --jq '.[] | select(.tag_name == "${tagName}") | .id'`,
    { encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean);

  if (existing.length > 1) {
    throw new Error(
      `Found ${existing.length} releases for ${tagName}; delete the duplicates before releasing.`,
    );
  }

  if (existing.length === 1) {
    console.log(`Using existing release ${tagName}`);
    return tagName;
  }

  console.log(`Creating draft release ${tagName}...`);
  execSync(`gh release create ${tagName} --draft --title ${version} --notes ""`, {
    stdio: "inherit",
  });
  return tagName;
}

if (require.main === module) {
  try {
    ensureRelease();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = ensureRelease;
