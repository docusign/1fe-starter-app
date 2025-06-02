import { PlatformPropsType } from '@1fe/shell';

export type CustomExampleUtils = {
  initializeLogger: (widgetId: string) => {
    logger: {
      log: (message: string) => void;
      error: (message: string) => void;
    };
  };
};

export type PlatformPropsWithCustomUtils = PlatformPropsType<CustomExampleUtils>;