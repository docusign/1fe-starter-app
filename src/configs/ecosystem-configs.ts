import { OneFEConfigManagement } from '@1fe/server';
import { ENVIRONMENT } from './env';
import { getWidgetVersions } from './widgetConfigs';

type DynamicConfigs = OneFEConfigManagement['dynamicConfigs'] extends
  | { get: () => Promise<infer T> }
  | { url: string }
  ? T
  : never;

const liveConfigUrl = `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/live.json`;

// demo.1fe.com has to load on every device. The shared live.json only lets
// through a fixed list of browser versions, so iPhones on iOS 26.1 and 26.4
// and current desktop Safari were rejected with "Unsupported Browser".
// An empty unsupportedBrowserScreen list turns that check off for this app.
// Everything else in live.json is used as published.
async function getDynamicConfigs(): Promise<DynamicConfigs> {
  const response = await fetch(liveConfigUrl);
  if (!response.ok) {
    throw new Error(`Failed to load live config: ${response.status}`);
  }
  const dynamicConfigs = (await response.json()) as DynamicConfigs;
  return {
    ...dynamicConfigs,
    platform: {
      ...dynamicConfigs.platform,
      browserslistConfig: {
        ...dynamicConfigs.platform.browserslistConfig,
        unsupportedBrowserScreen: [],
      },
    },
  };
}

export const configManagement: OneFEConfigManagement = {
  widgetVersions: {
    get: getWidgetVersions,
  },
  libraryVersions: {
    url: `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/lib-versions.json`,
  },
  dynamicConfigs: {
    get: getDynamicConfigs,
  },
  refreshMs: 30 * 1000,
};
