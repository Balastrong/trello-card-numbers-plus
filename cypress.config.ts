import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.extensions.push('./build');

        return launchOptions;
      });
    },
  },
});
