import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { cleanupOutdatedCaches } from 'workbox-precaching';
const DOCUMENT_ASSETS_CACHE = 'DOCUMENT_ASSETS_CACHE';
const STATIC_ASSETS_CACHE = 'STATIC_ASSETS_CACHE';

// TODO - externalize this.
// copied from @1fe/server because importing it causes sw.ts to use nodejs code somehow.
const ONEFE_ROUTES = {
  HEALTH: '/health',
  VERSION: '/version',
  WIDGET_VERSION: '/version/*',
  INDEX: '/*',
};

enum AssetType {
  DOCUMENTS = 'documents',
  STATIC_ASSETS = 'static-assets',
}

// Cache and retry only static assets
const regexToCacheAndRetry =
  /^(?!.*(127\.0\.0\.1|localhost)).*https?:\/\/.*\.(js|css|woff|woff2|json|png|svg)$/;

// non cache documents
const DOCUMENTS_TO_NOT_CACHE: string[] = [ONEFE_ROUTES.HEALTH];

// 2xx, 3xx should be considered valid responses
const isValidResponse = (responseStatus: number) => {
  return responseStatus >= 200 && responseStatus <= 399;
};

// Force Service Worker Cache bust for documents (not js/css/font assets)
const SW_CB = 'sw_cb';

// Retry twice after initial request failure
const MAX_RETRIES = 2;

const WIDGET_URL_OVERRIDES = 'widget_url_overrides';

const paramsNotToCache = [WIDGET_URL_OVERRIDES];

// Check cache first, then make request if not in cache
const cacheFirstStaticAssets = new CacheFirst({
  cacheName: STATIC_ASSETS_CACHE,
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 24 * 60 * 60 * 28,
      purgeOnQuotaError: true,
    }),
  ],
});

const staleWhileRevalidateDocumentAssets = new StaleWhileRevalidate({
  cacheName: DOCUMENT_ASSETS_CACHE,
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 5 * 60, // cache documents only for 5 minutes
      purgeOnQuotaError: true,
      maxEntries: 200,
    }),
    // Custom Plugin to cache only the first level path of the document
    // Cache only the first level path of the document
    // This is done to support MPAs where a unique document is served per pluginRoute (first level path)
    {
      cacheKeyWillBeUsed: async ({ request }) => {
        try {
          const incomingUrl = new URL(request.url);
          const pluginRoute = incomingUrl?.pathname?.split('/')?.[1] || '';
          const cacheKeyByPluginRoute = new URL(
            pluginRoute,
            incomingUrl.origin,
          );
          const pluginRequest = new Request(cacheKeyByPluginRoute.href, {
            mode: 'cors',
            credentials: 'omit',
          });
          return pluginRequest;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error creating cache key for document', error);
          return request;
        }
      },
    },
  ],
});

// Handle fetch events
self.addEventListener('fetch', (event: any) => {
  const incomingUrl = new URL(event.request.url);

  if (
    event.request.mode === 'navigate' && // only catch document requests
    !incomingUrl.searchParams.has(SW_CB) && // SW cache bust requested on this request
    !DOCUMENTS_TO_NOT_CACHE.find((url) =>
      incomingUrl.pathname.startsWith(url),
    ) && // incoming request is a document that should not be cached
    !paramsNotToCache.some((param) => incomingUrl.searchParams.get(param)) // incoming request is using param that needs server
  ) {
    // catch document requests
    event.respondWith(handleRequest(event, AssetType.DOCUMENTS));
  } else if (event.request.url.match(regexToCacheAndRetry)) {
    // catch only static assets
    event.respondWith(handleRequest(event, AssetType.STATIC_ASSETS));
  } else {
    return;
  }
});

async function handleRequest(event: any, assetType: AssetType) {
  // Need cors to look at response status, otherwise response will be opaque
  const request =
    assetType === AssetType.DOCUMENTS
      ? new Request(event.request)
      : new Request(event.request, {
          mode: 'cors',
          credentials: 'omit',
        });

  try {
    // cache.handle will throw an error if playwright simulates a timedout or aborted request
    const response = await (assetType === AssetType.DOCUMENTS
      ? staleWhileRevalidateDocumentAssets.handle({ event, request })
      : cacheFirstStaticAssets.handle({ event, request }));

    // If response is good, bubble up to main app thread
    if (response && isValidResponse(response.status)) {
      return response;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  // Else, initiate retry + fallback logic
  return handleRetry(request, assetType);
}

/**
 * When should we retry?
 * The fetch() function will automatically throw an error for network errors but not for HTTP errors such as 4xx or 5xx responses.
 * @param request
 * @returns
 */
const handleRetry = async (request: Request, assetType: AssetType) => {
  let retryCount = 0,
    response;

  while (retryCount < MAX_RETRIES) {
    try {
      response = await fetch(request);
      if (response && isValidResponse(response.status)) {
        // Request succeeded, return the response.
        return response;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      if (retryCount === MAX_RETRIES - 1 && assetType === AssetType.DOCUMENTS) {
        // If document fetch AND maximum retries reached, bubble original error
        throw error;
      }
    }

    retryCount++;
  }

  return response;
};

// Bring parity with GenerateSW configurations
clientsClaim();
cleanupOutdatedCaches();
skipWaiting();
