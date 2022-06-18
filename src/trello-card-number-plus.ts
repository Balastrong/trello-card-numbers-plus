import {
  CARD_SHORT_ID_SELECTOR,
  CARD_TITLE_SELECTOR,
  TCNP_NUMBER_CLASS,
  TCNP_NUMBER_CLASS_SELECTOR,
} from './const'
import './trello-card-number-plus.css'

window.addEventListener('load', () => {
  setupNumbers()
  setupDialogNumber()

  setupObserver()
})

function setupObserver(): void {
  var observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((n) => {
        const element = n as HTMLElement

        // Every change involving an element without classes is ignored
        if (!element?.classList?.length) return

        const { classList } = element

        if (classList.contains('card-detail-window')) {
          setupDialogNumber()
        }

        // Setup card number
        if (
          classList.contains('list-card') ||
          classList.contains('list-card-details')
        ) {
          setupNumbers(element)
        }
      })
    })
  })

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
  })
}

function setupDialogNumber(): void {
  const title = document.querySelector(CARD_TITLE_SELECTOR)
  if (
    title &&
    title.parentElement?.querySelector(TCNP_NUMBER_CLASS_SELECTOR) === null
  ) {
    const cardNumber = getCurrentlyOpenCardNumber()

    if (title) {
      title.parentElement.style.display = 'flex'
      const numberSpan = document.createElement('h2')
      numberSpan.innerHTML = '#' + cardNumber
      numberSpan.classList.add(TCNP_NUMBER_CLASS, 'quiet')
      title.parentElement?.prepend(numberSpan)
    }
  }
}

function setupNumbers(parent: Element = document.body): void {
  parent?.querySelectorAll(CARD_SHORT_ID_SELECTOR).forEach((element) => {
    if (element) {
      element.classList?.add(TCNP_NUMBER_CLASS)

      chrome.storage.sync.get((config) => {
        // TODO apply extra options
      })
    }
  })
}

function getCurrentlyOpenCardNumber(): string | undefined {
  const cardTitle = window.location.pathname.split('/').pop()
  return cardTitle?.substring(0, cardTitle.indexOf('-'))
}
