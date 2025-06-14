const fs = require("fs");
const path = require("path");

class ConfigLoader {
  constructor(configDirectory) {
    this.configDirectory = configDirectory;
    this.configs = {};
  }

  async getAllTests() {
    try {
      const testsDisplayNamesPath = path.join(
        this.configDirectory,
        "tests",
        "tests_display_names.json",
      );
      const testsDisplaysNamesFile = await fs.promises.readFile(testsDisplayNamesPath, "utf8");
      const testsDisplayNames = JSON.parse(testsDisplaysNamesFile);
      testsDisplayNames.sort((a, b) => {
        return a.id.localeCompare(b.id);
      });
      return testsDisplayNames;
    } catch (error) {
      throw new Error(`Tests display names not found: ${error.message}`);
    }
  }
  async getProvidersByTest(testType) {
    try {
      const providersPath = path.join(
        this.configDirectory,
        "tests",
        testType,
        "providers",
        "providers_display_names.json",
      );
      const providersFile = await fs.promises.readFile(providersPath, "utf8");
      const providers = JSON.parse(providersFile);
      providers.sort((a, b) => {
        return a.id.localeCompare(b.id);
      });
      return providers;
    } catch (error) {
      throw new Error(`No providers found for test "${testType}"`);
    }
  }
  async getSpeciesByTestAndProvider(test, provider) {
    const speciesPath = path.join(this.configDirectory, "tests", test, "providers", provider);
    try {
      const items = await fs.promises.readdir(speciesPath, { withFileTypes: true });
      const species = items
        .filter((item) => item.isFile() && !item.name.startsWith("."))
        .map((file) => file.name.split(".")[0]);
      species.sort((a, b) => {
        return a.localeCompare(b);
      });
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
}

module.exports = new ConfigLoader(path.join(__dirname));
