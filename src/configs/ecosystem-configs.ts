import { OneFEConfigManagement } from '@1fe/server';
import { ENVIRONMENT } from './env';
import { getWidgetVersions } from './widgetConfigs';

export const configManagement: OneFEConfigManagement = {
  widgetVersions: {
    get: getWidgetVersions,
  },
  libraryVersions: {
    url: `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/lib-versions.json`,
  },
  dynamicConfigs: {
    url: `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/live.json`,
  },
  refreshMs: 30 * 1000,
};
