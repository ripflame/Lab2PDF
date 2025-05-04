const fs = require("fs");
const path = require("path");

class ConfigLoader {
  constructor(configDirectory) {
    this.configDirectory = configDirectory;
    this.configs = {};
  }

  async getTestDisplayNames(testId) {
    try {
      const displayNamesPath = path.join(this.configDirectory, "test_display_names.json");
      const data = await fs.promises.readFile(displayNamesPath, "utf8");
      const displayNames = JSON.parse(data);

      return displayNames[testId];
    } catch (error) {
      throw new Error("Central mapping file not found");
    }
  }
  async getAllTests() {
    const testsPath = path.join(this.configDirectory, "tests");
    try {
      const items = await fs.promises.readdir(testsPath, { withFileTypes: true });
      const tests = items.filter((item) => item.isDirectory()).map((dir) => {
        return this.getTestDisplayNames(dir.name);
      });
      return tests;
    } catch (error) {
      throw new Error("Path for tests folder not found");
    }
  }
  async getProvidersForTest(test) {
    const providersPath = path.join(this.configDirectory, "tests", test, "providers");
    try {
      const items = await fs.promises.readdir(providersPath, { withFileTypes: true });
      const providers = items.filter((item) => item.isDirectory()).map((dir) => dir.name);
      return providers;
    } catch (error) {
      throw new Error(`No providers found for test "${test}"`);
    }
  }
  async getSpeciesForTestAndProvider(test, provider) {
    const speciesPath = path.join(this.configDirectory, "tests", test, "providers", provider);
    try {
      const items = await fs.promises.readdir(speciesPath, { withFileTypes: true });
      const species = items.filter((item) => item.isFile()).map((file) => file.name.split(".")[0]);
      return species;
    } catch (error) {
      throw new Error(`Provider "${provider}" not found for test "${test}"`);
    }
  }

  getConfigForTestProviderAndSpecies(testType, provider, species) {
    const cacheKey = `${testType}_${provider}_${species}`;
    if (this.configs[cacheKey]) {
      return this.configs[cacheKey];
    }

    const configPath = path.join(
      this.configDirectory,
      "tests",
      testType,
      "providers",
      provider,
      `${species}.js`,
    );
    try {
      this.configs[cacheKey] = require(configPath);
      return this.configs[cacheKey];
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND") {
        throw new Error(
          `Config not found for test type: ${testType}, provider: ${provider}, species: ${species}`,
        );
      }

      throw error;
    }
  }

  //DELETE THIS AFTER
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
