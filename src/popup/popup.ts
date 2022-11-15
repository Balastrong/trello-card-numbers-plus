import './popup.css';
import '../trelloCardNumberPlus.css';
import { Configs, configStorage } from '../shared/storage';
import { formatNumber, getCurrentBoardId, isBlacklisted } from '../shared/utils';
import { TCNP_NUMBER_CLASS_BOLD } from '../shared/const';
import Huebee from 'huebee';

new Huebee('#number-color', {
  saturations: 1,
  customColors: [
    '#ff0000',
    '#ff7f00',
    '#ffff00',
    '#7fff00',
    '#00ff00',
    '#00ff7f',
    '#00ffff',
    '#007fff',
    '#0000ff',
    '#7f00ff',
    '#ff00ff',
    '#ff0088',
  ],
  staticOpen: true,
}).on('change', () => {
  updatePreview();
});

//#region Configs logic
function loadConfigs() {
  configStorage.get((configs) => {
    getInput(Controls.CardNumbersActive).checked = configs.cardNumbersActive;
    getInput(Controls.CardNumbersBold).checked = configs.cardNumbersBold;
    getInput(Controls.NumberFormat).value = configs.numberFormat;
    getInput(Controls.NumberColor).value = configs.numberColor;
    getInput(Controls.Blacklist).value = configs.blacklist;
    updatePreview();
  });
}

function saveConfig(): void {
  const configs = new Configs();
  configs.cardNumbersActive = getInput(Controls.CardNumbersActive).checked;
  configs.cardNumbersBold = getInput(Controls.CardNumbersBold).checked;
  configs.numberFormat = getInput(Controls.NumberFormat).value;
  configs.numberColor = getInput(Controls.NumberColor).value;
  configs.blacklist = getInput(Controls.Blacklist).value;

  configStorage.set(configs);
}
//#endregion

//#region DOM Utilities
enum Controls {
  CardNumbersActive = 'card-numbers-active',
  CardNumbersBold = 'card-numbers-bold',
  NumberFormat = 'number-format',
  NumberColor = 'number-color',
  Blacklist = 'blacklist',
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
  preview.style.color = getInput(Controls.NumberColor).value;
  preview.classList.toggle(TCNP_NUMBER_CLASS_BOLD, getInput(Controls.CardNumbersBold).checked);
}
//#endregion

function toggleCurrentBoardBlacklist(): void {
  const currentBoard = getCurrentBoardId();
  const blacklist = getInput(Controls.Blacklist).value;

  if (isBlacklisted(blacklist, currentBoard)) {
    const filteredBlacklist = blacklist
      .split(';')
      .filter((boardId) => boardId.trim() === currentBoard)
      .join(';');
    getInput(Controls.Blacklist).value = filteredBlacklist;
  } else {
    getInput(Controls.Blacklist).value = `${currentBoard};${blacklist}`;
  }
}

//#region Listeners
document.addEventListener('DOMContentLoaded', loadConfigs);
document.getElementById('save-button')?.addEventListener('click', saveConfig);
document.getElementById('close-button')?.addEventListener('click', () => window.close());
[getInput(Controls.NumberFormat), getInput(Controls.CardNumbersBold)].forEach((el) =>
  el.addEventListener('input', updatePreview)
);
document.getElementById('blacklist-toggle-btn')?.addEventListener('click', toggleCurrentBoardBlacklist);
//#endregion
