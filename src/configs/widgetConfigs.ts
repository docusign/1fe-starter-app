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

// TODO - consider exporting this directly from @1fe/server
type WidgetVersions = OneFEConfigManagement['widgetVersions'] extends
  | {
      get: () => Promise<infer T>;
    }
  | { url: string }
  ? T
  : never;

export async function getWidgetVersions() {
  if (!connectionString) {
    console.log(
      'AZURE_APPCONFIG_CONNECTION_STRING is not set. using an empty widget version list.',
    );
    return [];
  }

  const settings = await load(connectionString);
  const widgetVersions: WidgetVersions = [];

  for (const [widgetKey, widgetVersion] of settings.entries()) {
    if (widgetKey.startsWith(ENVIRONMENT) && widgetVersion) {
      widgetVersions.push(widgetVersion);
    }
  }

  return widgetVersions;
}
