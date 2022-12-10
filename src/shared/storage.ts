export class Configs {
  cardCountersActive = true;
  cardNumbersActive = true;
  cardNumbersBold = true;
  numberFormat = '#%0';
  numberColor = '#000';
  excludedBoards = '';
}

export const configStorage = {
  get: (callback: (configs: Configs) => void) => {
    chrome.storage.sync.get({ configs: new Configs() }, (storage) => {
      callback(storage.configs);
    });
  },
  set: (configs: Configs, callback?: () => void) => {
    chrome.storage.sync.set({ configs }, () => {
      callback?.();
    });
  },
  listen: (callback: (configs: Configs) => void) => {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.configs) {
        callback(changes.configs.newValue);
      }
    });
  },
};
