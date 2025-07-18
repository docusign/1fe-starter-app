import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import oneFEServer from '@1fe/server';
import favicon from 'serve-favicon';

import router from './lib/router';
import { enforcedDefaultCsp, reportOnlyDefaultCsp } from './csp-configs';
import errorMiddleware from './server/middlewares/error.middleware';
import { ENVIRONMENT, ExampleHostedEnvironments, isLocal, isProduction } from './configs/env';
import { criticalLibUrls } from './configs/critical-libs';
import { configManagement } from './configs/ecosystem-configs';

dotenv.config();

const { PORT = 3001 } = process.env;

const options = {
  environment: isLocal ? ExampleHostedEnvironments.integration : ENVIRONMENT,
  isProduction,
  orgName: '1FE Starter App',
  configManagement,
  criticalLibUrls,
  csp: {
    defaultCSP: {
      enforced: enforcedDefaultCsp[ENVIRONMENT],
      reportOnly: reportOnlyDefaultCsp[ENVIRONMENT],
    }
  },
};

async function startServer() {
  const app = await oneFEServer(options);

  // Middleware that parses json and looks at requests where the Content-Type header matches the type option.
  app.use(express.json());

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

  // Serve API requests from the router
  app.use('/api', router);

  app.use(errorMiddleware);

  // Set EJS as the view engine
  app.set('view engine', 'ejs');

  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

startServer();
