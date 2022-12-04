import './popup.css';
import '../trelloCardNumberPlus.css';
import { Configs, configStorage } from '../shared/storage';
import { formatNumber, isBoardExcluded } from '../shared/utils';
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
    getInput(Controls.ExcludedBoards).value = configs.excludedBoards;
    updatePreview();
    updateExcludedBoardsButtonText();
  });
}

function saveConfig(): void {
  const configs = new Configs();
  configs.cardNumbersActive = getInput(Controls.CardNumbersActive).checked;
  configs.cardNumbersBold = getInput(Controls.CardNumbersBold).checked;
  configs.numberFormat = getInput(Controls.NumberFormat).value;
  configs.numberColor = getInput(Controls.NumberColor).value;
  configs.excludedBoards = getInput(Controls.ExcludedBoards).value;

  configStorage.set(configs);
}
//#endregion

//#region DOM Utilities
enum Controls {
  CardNumbersActive = 'card-numbers-active',
  CardNumbersBold = 'card-numbers-bold',
  NumberFormat = 'number-format',
  NumberColor = 'number-color',
  ExcludedBoards = 'excludedBoards',
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

async function getCurrentBoardId() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);

  return tab.url?.split('/b/')[1].split('/')[0] ?? 'not-found';
}

async function toggleCurrentBoardExcludedBoards() {
  const currentBoard = await getCurrentBoardId();
  const excludedBoards = getInput(Controls.ExcludedBoards).value;

  if (isBoardExcluded(excludedBoards, currentBoard)) {
    const filteredExcludedBoards = excludedBoards
      .split(';')
      .filter((boardId) => boardId.trim() !== currentBoard)
      .join(';');
    getInput(Controls.ExcludedBoards).value = filteredExcludedBoards;
  } else {
    getInput(Controls.ExcludedBoards).value = `${currentBoard};${excludedBoards}`;
  }

  updateExcludedBoardsButtonText();
}

function updateExcludedBoardsButtonText() {
  const excludedBoardsButton = document.getElementById('excludedBoards-toggle-btn');

  if (excludedBoardsButton) {
    getCurrentBoardId().then((currentBoard) => {
      const excludedBoards = getInput(Controls.ExcludedBoards).value;
      excludedBoardsButton.innerText = isBoardExcluded(excludedBoards, currentBoard) ? '(-)' : '(+)';
    });
  }
}

//#region Listeners
document.addEventListener('DOMContentLoaded', loadConfigs);
document.getElementById('save-button')?.addEventListener('click', saveConfig);
document.getElementById('close-button')?.addEventListener('click', () => window.close());
[getInput(Controls.NumberFormat), getInput(Controls.CardNumbersBold)].forEach((el) =>
  el.addEventListener('input', updatePreview)
);
document.getElementById('excludedBoards-toggle-btn')?.addEventListener('click', toggleCurrentBoardExcludedBoards);
//#endregion
