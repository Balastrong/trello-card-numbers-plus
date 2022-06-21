import './popup.css';
import '../trelloCardNumberPlus.css';
import { Configs, configStorage } from '../shared/storage';
import { formatNumber } from '../shared/utils';
import { TCNP_NUMBER_CLASS_BOLD } from '../shared/const';

//#region Configs logic
function loadConfigs() {
  configStorage.get((configs) => {
    getInput(Controls.CardNumbersActive).checked = configs.cardNumbersActive;
    getInput(Controls.CardNumbersBold).checked = configs.cardNumbersBold;
    getInput(Controls.NumberFormat).value = configs.numberFormat;
    updatePreview();
  });
}

function saveConfig(): void {
  const configs = new Configs();
  configs.cardNumbersActive = getInput(Controls.CardNumbersActive).checked;
  configs.cardNumbersBold = getInput(Controls.CardNumbersBold).checked;
  configs.numberFormat = getInput(Controls.NumberFormat).value;

  configStorage.set(configs);
}
//#endregion

//#region DOM Utilities
enum Controls {
  CardNumbersActive = 'card-numbers-active',
  CardNumbersBold = 'card-numbers-bold',
  NumberFormat = 'number-format',
}

function getInput(control: Controls) {
  return getControl<HTMLInputElement>(control);
}

function getControl<T extends HTMLElement>(control: Controls): T {
  return document.getElementById(control) as T;
}

function updatePreview(): void {
  const numberFormat = getInput(Controls.NumberFormat).value;
  const preview = document.getElementById('number-format-preview') as HTMLSpanElement;
  preview.innerText = formatNumber(619, numberFormat);
  preview.classList.toggle(TCNP_NUMBER_CLASS_BOLD, getInput(Controls.CardNumbersBold).checked);
}
//#endregion

//#region Listeners
document.addEventListener('DOMContentLoaded', loadConfigs);
document.getElementById('save-button')?.addEventListener('click', saveConfig);
document.getElementById('close-button')?.addEventListener('click', () => window.close());
[getInput(Controls.NumberFormat), getInput(Controls.CardNumbersBold)].forEach((el) =>
  el.addEventListener('input', updatePreview)
);
//#endregion
