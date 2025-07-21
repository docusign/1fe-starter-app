export function initServiceWorker() {
  window.addEventListener('load', () => {
    const swUrl = `/sw.js`;

    window.navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.error(
          '[SW] Service Worker registration failed: ',
          registrationError,
        );
      });
  });
}
