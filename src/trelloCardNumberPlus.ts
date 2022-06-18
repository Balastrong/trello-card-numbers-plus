import {
  CARD_SHORT_ID_SELECTOR,
  CARD_TITLE_SELECTOR,
  TCNP_NUMBER_CLASS,
  TCNP_NUMBER_CLASS_BOLD,
  TCNP_NUMBER_CLASS_SELECTOR,
} from './shared/const';
import { Configs } from './shared/models';
import { isCard, isDialogClosed, isDroppedCard } from './shared/mutationHelpers';
import { configStorage } from './shared/storage';
import './trelloCardNumberPlus.css';

window.addEventListener('load', () => {
  configStorage.listen((configs: Configs) => {
    setupNumbers({ configs });
  });

  setupNumbers();
  setupDialogNumber();
  setupObserver();
});

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
    const cardNumber = getCurrentlyOpenCardNumber();

    if (title) {
      title.parentElement.style.display = 'flex';
      const numberSpan = document.createElement('h2');
      numberSpan.innerHTML = '#' + cardNumber;
      numberSpan.classList.add(TCNP_NUMBER_CLASS, 'quiet');
      title.parentElement?.prepend(numberSpan);
    }
  }
}

function setupNumbers(options?: { parent?: Element; configs?: Configs }): void {
  function innerSetupNumbers(parent: Element, configs: Configs) {
    parent.querySelectorAll(CARD_SHORT_ID_SELECTOR).forEach((element) => {
      if (element) {
        element.classList.toggle(TCNP_NUMBER_CLASS, configs.cardNumbersActive);
        element.classList.toggle(TCNP_NUMBER_CLASS_BOLD, configs.cardNumbersBold);
      }
    });
  }

  const parent = options?.parent || document.body;

  // Avoid reading configs again if passed in input
  if (options?.configs) {
    innerSetupNumbers(parent, options.configs);
  } else {
    configStorage.get((configs) => {
      innerSetupNumbers(parent, configs);
    });
  }
}

function getCurrentlyOpenCardNumber(): string | undefined {
  const cardTitle = window.location.pathname.split('/').pop();
  return cardTitle?.substring(0, cardTitle.indexOf('-'));
}
