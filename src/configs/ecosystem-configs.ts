// Use require for CommonJS module
const { urls } = require("./config-urls");

export const configManagement = {
  widgetVersions: {
    url: urls.widgetVersions(),
  },
  libraryVersions: {
    url: urls.libraryVersions(),
  },
  dynamicConfigs: {
    url: urls.dynamicConfig()
  },
  refreshMs: 30 * 1000,
};