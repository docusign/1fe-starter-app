import { CSPPerEnvironment } from '@1fe/server';

const commonCsp = {
  scriptSrc: [
    "'self'",
    'https://1fe-a.akamaihd.net',
  ],
  styleSrc: ["'unsafe-inline'"],
  connectSrc: [
    "'self'",
    'https://1fe-a.akamaihd.net',
  ],
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
