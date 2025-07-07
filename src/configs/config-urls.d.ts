/**
 * Type declarations for config-urls.js
 */

/**
 * Get the environment based on NODE_ENV
 * @returns 'integration' for development, otherwise NODE_ENV or 'production'
 */
export function getEnvironment(): string;

/**
 * Get the base URL for configuration endpoints
 */
export function getConfigBaseUrl(env?: string): string;

/**
 * URL endpoints for different configuration types
 */
export const urls: {
  dynamicConfig: (env?: string) => string;
  widgetVersions: (env?: string) => string;
  libraryVersions: (env?: string) => string;
};
