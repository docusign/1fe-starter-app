export const ExampleHostedEnvironments = {
  integration: 'integration',
  production: 'production',
};

export const ENVIRONMENT: string = process.env.NODE_ENV === 'development' ? ExampleHostedEnvironments.integration : (process.env.NODE_ENV || ExampleHostedEnvironments.production);
export const isLocal = process.env.NODE_ENV === 'development';
export const isProduction = ExampleHostedEnvironments.production === ENVIRONMENT;
export const SERVER_BUILD_NUMBER = process.env.BUILD_NUMBER || 'local';