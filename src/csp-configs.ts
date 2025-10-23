import { CSPPerEnvironment } from '@1fe/server';

const commonCsp = {
  scriptSrc: ["'self'", 'https://1fe-a.akamaihd.net'],
  styleSrc: ["'unsafe-inline'"],
  connectSrc: ["'self'", 'https://1fe-a.akamaihd.net'],
};

export const enforcedDefaultCsp: Record<string, CSPPerEnvironment> = {
  development: {
    ...commonCsp,
    scriptSrc: [...commonCsp.scriptSrc, "'unsafe-eval'"], // required for the playground to pass widget props
  },
  integration: {
    ...commonCsp,
    scriptSrc: [...commonCsp.scriptSrc, "'unsafe-eval'", "http://127.0.0.1:*", "http://localhost:*"], // required for the playground to pass widget props
    connectSrc: [...commonCsp.connectSrc, "http://127.0.0.1:*", "http://localhost:*"],
  },
  production: commonCsp,
};

export const reportOnlyDefaultCsp: Record<string, CSPPerEnvironment> = {
  development: {
    ...commonCsp,
    frameAncestors: ['test-domain.com'],
  },
};
