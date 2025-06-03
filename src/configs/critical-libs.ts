import { ENVIRONMENT, isLocal, isProduction } from "./env";

const shellBundleUrl =
  isLocal ? `http://localhost:3001/js/bundle.js` : `https://1fe-a.akamaihd.net/${ENVIRONMENT}/shell/bundle.js`;

const importMapOverrideUrl = isProduction ? `https://1fe-a.akamaihd.net/${ENVIRONMENT}/libs/@1fe/import-map-overrides/3.1.1/dist/import-map-overrides-api.js` : `https://1fe-a.akamaihd.net/${ENVIRONMENT}/libs/@1fe/import-map-overrides/3.1.1/dist/import-map-overrides.js`

export const criticalLibUrls = {
  importMapOverride: importMapOverrideUrl,
  systemJS: `https://1fe-a.akamaihd.net/${ENVIRONMENT}/libs/systemjs/6.14.0/dist/system.min.js`,
  systemJSAmd: `https://1fe-a.akamaihd.net/${ENVIRONMENT}/libs/systemjs/6.14.0/dist/extras/amd.min.js`,
  shellBundleUrl,
};