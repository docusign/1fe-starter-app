const { DefinePlugin } = require('webpack');

const BUILD_BUILDID = process.env.BUILD_BUILDID;
const DEBUG_BUILD = process.env.DEBUG_BUILD === 'true';
const IS_TEST_RUN = process.env.IS_TEST_RUN;
const IS_AUTOMATION_RUN = process.env.IS_AUTOMATION_RUN;

const showDevtoolBasedOnEnvironment = process.env.NODE_ENV === 'development' || DEBUG_BUILD;

// Define ENVIRONMENT directly matching the logic in src/configs/env.ts
const ENVIRONMENT = process.env.NODE_ENV === 'development' ? 'integration' : (process.env.NODE_ENV || 'production');

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
    // Construct the URL directly since we can't import the TypeScript file
    const url = `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/live.json`;
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