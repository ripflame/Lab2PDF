const fs = require("fs");
const path = require("path");

class ConfigLoader {
  constructor(configDirectory) {
    this.configDirectory = configDirectory;
    this.configs = {};
  }

  getTemplateConfig(provider, testType, species) {
    const cacheKey = `${provider}_${testType}_${species}`;

    if (this.configs[cacheKey]) {
      return this.configs[cacheKey];
    }

    const configPath = path.join(
      this.configDirectory,
      "templates",
      provider,
      testType,
      `${species}.js`,
    );

    if (!fs.existsSync(configPath)) {
      throw new Error(
        `Config not found for provider: ${provider}, test type: ${testType}, species: ${species}`,
      );
    }

    this.configs[cacheKey] = require(configPath);
    return this.configs[cacheKey];
  }
}

module.exports = new ConfigLoader(path.join(__dirname));
