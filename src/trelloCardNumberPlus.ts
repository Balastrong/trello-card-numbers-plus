import {
  CARD_SHORT_ID_SELECTOR,
  CARD_TITLE_SELECTOR,
  TCNP_NUMBER_CLASS,
  TCNP_NUMBER_CLASS_BOLD,
  TCNP_NUMBER_CLASS_SELECTOR,
} from './shared/const';
import {
  formatNumber,
  getCardNumberFromParent,
  getCardNumberFromURL,
  isCard,
  isDialogClosed,
  isDroppedCard,
} from './shared/utils';
import { Configs, configStorage } from './shared/storage';
import './trelloCardNumberPlus.css';

let configs: Configs = new Configs();

window.addEventListener('load', () => {
  configStorage.get(refresh);
  configStorage.listen(refresh);

  setupObserver();
});

function refresh(updatedConfigs: Configs): void {
  configs = updatedConfigs;
  setupNumbers();
  setupDialogNumber();
}

function setupObserver(): void {
  var observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      const element = mutation.target as HTMLElement;
      if (!element?.classList?.length) return;

      if (
        (isCard(element) && (mutation.addedNodes.length > 0 || isDroppedCard(element, mutation))) ||
        isDialogClosed(element, mutation)
      ) {
        setupNumbers();
      }

      if (element.classList.contains('card-detail-window')) {
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
    numberSpan.classList.add(TCNP_NUMBER_CLASS, 'quiet');

    title.parentElement?.prepend(numberSpan);
  }
}

function setupNumbers(): void {
  document.querySelectorAll(CARD_SHORT_ID_SELECTOR).forEach((element) => {
    if (element) {
      element.innerHTML = formatNumber(getCardNumberFromParent(element), configs.numberFormat);
      element.classList.toggle(TCNP_NUMBER_CLASS, configs.cardNumbersActive);
      element.classList.toggle(TCNP_NUMBER_CLASS_BOLD, configs.cardNumbersBold);
    }
  });
}
