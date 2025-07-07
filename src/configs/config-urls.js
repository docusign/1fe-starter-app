/**
 * Common configuration URLs shared between CommonJS and TypeScript modules
 */

// Replicating the environment logic for compatibility with both environments
const getEnvironment = () => process.env.NODE_ENV === 'development' ? 'integration' : (process.env.NODE_ENV || 'production');

/**
 * Base URL for configuration endpoints
 */
const getConfigBaseUrl = (env = getEnvironment()) => `https://1fe-a.akamaihd.net/${env}/configs`;

/**
 * URL endpoints for different configuration types
 */
const urls = {
  dynamicConfig: (env = getEnvironment()) => `${getConfigBaseUrl(env)}/live.json`,
  widgetVersions: (env = getEnvironment()) => `${getConfigBaseUrl(env)}/widget-versions.json`,
  libraryVersions: (env = getEnvironment()) => `${getConfigBaseUrl(env)}/lib-versions.json`,
};

module.exports = {
  getConfigBaseUrl,
  getEnvironment,
  urls,
};
