import { ENVIRONMENT } from "./env";

export const configManagement = {
  widgetVersions: {
    url: `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/widget-versions.json`,
  },
  libraryVersions: {
    url: `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/lib-versions.json`,
  },
  dynamicConfigs: {
    url: `https://1fe-a.akamaihd.net/${ENVIRONMENT}/configs/live.json`
  },
  refreshMs: 30 * 1000,
};