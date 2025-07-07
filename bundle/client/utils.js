const { DefinePlugin } = require('webpack');
const { urls, getEnvironment } = require('../../src/configs/config-urls');

const BUILD_BUILDID = process.env.BUILD_BUILDID;
const DEBUG_BUILD = process.env.DEBUG_BUILD === 'true';
const IS_TEST_RUN = process.env.IS_TEST_RUN;
const IS_AUTOMATION_RUN = process.env.IS_AUTOMATION_RUN;

const showDevtoolBasedOnEnvironment = process.env.NODE_ENV === 'development' || DEBUG_BUILD;

// Use the shared environment function from config-urls.js
const ENVIRONMENT = getEnvironment();

const commonPlugins = [
  new DefinePlugin({
    // We use isProductionEnvironment because we allow the devtool on stage
    __SHOW_DEVTOOL__: JSON.stringify(showDevtoolBasedOnEnvironment),
    __ENABLE_SERVICE_WORKER__: JSON.stringify(
      process.env.ENABLE_SERVICE_WORKER,
    ),
  }),
];

/**
 * Fetches the dynamic configuration for the specified environment
 * @returns {Promise<Object>} The dynamic configuration object
 */
async function fetchDynamicConfig() {
  try {
    // Use the shared URL configuration with the common environment function
    const url = urls.dynamicConfig();
    console.log(`Fetching dynamic config from: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch dynamic config:', error);
    return null;
  }
}

/**
 * Gets the browserslist target configuration from dynamic config
 * @returns {Promise<string[]>} Array of browserslist targets
 * @throws {Error} If the required configuration is not found
 */
async function getBrowserslistTargets() {
  let dynamicConfig = await fetchDynamicConfig();

  if (Array.isArray(dynamicConfig?.platform?.browserslistConfig?.buildTarget) && 
      dynamicConfig.platform.browserslistConfig.buildTarget.length) {
    return dynamicConfig.platform.browserslistConfig.buildTarget;
  }

  const errorMsg = 'Required browserslist configuration not found in dynamic config.';
  throw new Error(`${errorMsg}\nReceived the following dynamic config:\n${JSON.stringify(dynamicConfig, null, 2)}`);
}

module.exports = {
  commonPlugins,
  BUILD_BUILDID,
  DEBUG_BUILD,
  IS_TEST_RUN,
  IS_AUTOMATION_RUN,
  getBrowserslistTargets
};