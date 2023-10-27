import {
  CARD_COUNTER_SELECTOR,
  CARD_SHORT_ID_SELECTOR,
  CARD_TITLE_SELECTOR,
  TCNP_NUMBER_CLASS,
  TCNP_NUMBER_CLASS_BOLD,
  TCNP_NUMBER_CLASS_SELECTOR,
} from './shared/const';
import { Configs, configStorage } from './shared/storage';
import {
  formatNumber,
  getCardNumberFromParent,
  getCardNumberFromURL,
  isAddedCard,
  isBoardExcluded,
  isDialogClosed,
  isDialogOpened,
} from './shared/utils';
import './trelloCardNumberPlus.css';

let configs: Configs = new Configs();
let isCurrentBoardExcluded = false;

configStorage.get(refresh);
configStorage.listen(refresh);
setupObserver();

setTimeout(() => {
  refresh();
}, 2000);

function getCurrentBoardId() {
  return window.location.pathname.split('/')[2];
}

function refresh(updatedConfigs?: Configs): void {
  if (updatedConfigs) {
    configs = updatedConfigs;
  }
  isCurrentBoardExcluded = isBoardExcluded(configs.excludedBoards, getCurrentBoardId());

  setupCounters();
  setupNumbers();
  setupDialogNumber();
}

function setupObserver(): void {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      const element = mutation.target as HTMLElement;

      // Board has been changed
      if (element.id === 'board') {
        //refresh();
      }

      if (!element?.classList?.length) return;

      if (isDialogClosed(element, mutation) || isAddedCard(mutation)) {
        setupCounters();
        setupNumbers();
      }

      if (isDialogOpened(element)) {
        setupDialogNumber();
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
  });
}

function setupDialogNumber(): void {
  const title = document.querySelector(CARD_TITLE_SELECTOR);
  if (title && title.parentElement?.querySelector(TCNP_NUMBER_CLASS_SELECTOR) === null) {
    title.parentElement.style.display = 'flex';

    const cardNumber = getCardNumberFromURL(window.location.pathname);
    const numberSpan = document.createElement('h2');
    numberSpan.innerHTML = formatNumber(cardNumber, configs.numberFormat);
    numberSpan.style.color = configs.numberColor;
    numberSpan.classList.add(TCNP_NUMBER_CLASS, 'quiet');

    title.parentElement?.prepend(numberSpan);
  }
}

function setupNumbers(): void {
  document.querySelectorAll(CARD_SHORT_ID_SELECTOR).forEach((cardParent) => {
    if (!cardParent) return;

    const existingElement = cardParent.querySelector('.' + TCNP_NUMBER_CLASS) as HTMLElement;

    const htmlElement = existingElement ?? document.createElement('div');

    htmlElement.innerHTML = formatNumber(getCardNumberFromParent(cardParent), configs.numberFormat);
    htmlElement.style.color = configs.numberColor;
    htmlElement.classList.add(TCNP_NUMBER_CLASS);
    htmlElement.classList.toggle('tcnp-hidden', !configs.cardNumbersActive || isCurrentBoardExcluded);
    htmlElement.classList.toggle(TCNP_NUMBER_CLASS_BOLD, configs.cardNumbersBold);

    if (existingElement) return;

    cardParent.prepend(htmlElement);
  });
}

// TODO: Rewrite as the selector is no longer valid, we need to count the cards in the list
function setupCounters(): void {
  document.querySelectorAll(CARD_COUNTER_SELECTOR).forEach((element) => {
    const htmlElement = element as HTMLElement;
    if (!htmlElement) return;

    htmlElement.classList.toggle('hide', !configs.cardCountersActive);
  });
}
