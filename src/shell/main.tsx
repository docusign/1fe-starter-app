import renderOneFEShell, { OneFEErrorComponentProps } from '@1fe/shell';
import React from 'react';

import { Loader } from './components/Loader';
import { Error } from './components/Error';
import { shellLogger } from './logger';
import { CustomExampleUtils } from './types/utils';
import { initServiceWorker } from './utils/init-service-worker';

const exampleCustomUtils: CustomExampleUtils = {
  initializeLogger: (widgetId: string) => ({
    logger: {
      log: (message: string) => {
        console.log(`[${widgetId}]`, message);
      },
      error: (message: string) => {
        console.error(`[${widgetId}]`, message);
      },
    },
  }),
};

const setup = () => {
  renderOneFEShell({
    hooks: {
      onBeforeRenderShell: () => {
        // This is a good place to initialize global state, register service workers, etc.
        initServiceWorker();
      },
    },
    utils: exampleCustomUtils,
    auth: {
      isAuthedCallback: (widgetId: string): boolean => {
        console.log(widgetId, ' is authenticated.');
        return false;
      },
      unauthedCallback: (widgetId: string) => {
        console.log(widgetId, ' is not authenticated.');
      },
    },
    shellLogger: {
      ...shellLogger,
      logPlatformUtilUsage: true,
      redactSensitiveData: true,
    },
    components: {
      getLoader: () => <Loader />,
      getError: (props?: OneFEErrorComponentProps) => <Error {...props} />,
    },
    routes: {
      defaultRoute: '/widget-starter-kit',
    },
  });
};

setup();
