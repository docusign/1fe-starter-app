import { CSPPerEnvironment } from '@1fe/server';

const commonCsp = {
  scriptSrc: ['*'],
  styleSrc: ["'unsafe-inline'"],
  connectSrc: ['*'], // this is required for the service worker to fetch resources
};

export const enforcedDefaultCsp: Record<string, CSPPerEnvironment> = {
  development: commonCsp,
  integration: commonCsp,
  production: commonCsp,
};

export const reportOnlyDefaultCsp: Record<string, CSPPerEnvironment> = {
  development: {
    ...commonCsp,
    frameAncestors: ['test-domain.com'],
  },
};
