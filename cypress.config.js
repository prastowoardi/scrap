const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 1024,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    "trashAssetsBeforeRuns": true,
    specPattern: "cypress/e2e/**/*.js",
    "baseUrl": "https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops"
  },
});
