import './popup.css';
import { Configs } from './shared/models';
import { configStorage } from './shared/storage';

//#region Configs logic

function loadConfigs() {
  configStorage.get((configs) => {
    getCheckbox(Controls.CardNumbersActive).checked = configs.cardNumbersActive;
    getCheckbox(Controls.CardNumbersBold).checked = configs.cardNumbersBold;
    getCheckbox(Controls.CloseOnSave).checked = configs.closeOnSave;
  });
}

function saveConfig(): void {
  const configs = new Configs();
  configs.cardNumbersActive = getCheckbox(Controls.CardNumbersActive).checked;
  configs.cardNumbersBold = getCheckbox(Controls.CardNumbersBold).checked;
  configs.closeOnSave = getCheckbox(Controls.CloseOnSave).checked;

  configStorage.set(configs, () => {
    if (configs.closeOnSave) {
      window.close();
    }
  });
}
//#endregion

//#region DOM Utilities
enum Controls {
  CardNumbersActive = 'card-numbers-active',
  CardNumbersBold = 'card-numbers-bold',
  CloseOnSave = 'close-on-save',
}

function getCheckbox(control: Controls) {
  return getControl<HTMLInputElement>(control);
}

function getControl<T extends HTMLElement>(control: Controls): T {
  return document.getElementById(control) as T;
}
//#endregion

document.addEventListener('DOMContentLoaded', () => loadConfigs());
document.getElementById('save-button')?.addEventListener('click', () => saveConfig());
document.getElementById('cancel-button')?.addEventListener('click', () => window.close());
