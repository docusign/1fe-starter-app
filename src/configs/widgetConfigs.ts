/**
 * This file serves as an example using Azure App Configuration.
 *
 * Users should be able to adapt this implementation to use alternative configuration services such as:
 * - AWS AppConfig
 * - Google Cloud Secret Manager
 * - Google Cloud Storage or Firestore
 * - Firebase Remote Config
 * - Or any other configuration management service of your choice
 *
 * The core functionality of fetching widget versions can be implemented
 * using similar patterns regardless of the underlying configuration provider.
 */

import { load } from '@azure/app-configuration-provider';
import { OneFEConfigManagement } from '@1fe/server';
import { ENVIRONMENT } from './env';
const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

// TODO @sushruth - consider exporting this type directly from @1fe/server
type WidgetVersions = OneFEConfigManagement['widgetVersions'] extends
  | {
      get: () => Promise<infer T>;
    }
  | { url: string }
  ? T
  : never;

export async function getWidgetVersions(): Promise<WidgetVersions> {
  if (!connectionString) {
    console.log(
      'AZURE_APPCONFIG_CONNECTION_STRING is not set. using a static widget version list.',
    );
    // This is for local development or testing purposes.
    // In production, you should set the AZURE_APPCONFIG_CONNECTION_STRING environment variable
    // to connect to your Azure App Configuration instance.
    // The following is a mock implementation to simulate the expected output.
    return Promise.resolve([
      {
        widgetId: '@1fe/bathtub',
        version: '1.0.50',
      },
      {
        widgetId: '@1fe/sample-widget',
        version: '1.0.2',
      },
      {
        widgetId: '@1fe/sample-widget-with-auth',
        version: '1.0.4',
      },
      {
        widgetId: '@1fe/widget-starter-kit',
        version: '1.0.18',
      },
    ]);
  }

  const widgetVersions = await load(connectionString, {
    selectors: [
      {
        keyFilter: `${ENVIRONMENT}:*`,
      },
    ],
    trimKeyPrefixes: [`${ENVIRONMENT}:`],
  });

  return Array.from(widgetVersions.values());
}
