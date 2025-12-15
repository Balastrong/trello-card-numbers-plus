import { TCNP_NUMBER_FORMAT_PLACEHOLDER } from './const';

export function isDialogClosed(element: Element, mutation: MutationRecord): boolean {
  return mutation.removedNodes.length > 0 && element.classList.contains('js-fill-card-detail-desc');
}

export function isDialogOpened(element: Element): boolean {
  return element.classList.contains('card-detail-window');
}

export function isCardLinkUpdated(mutation: MutationRecord): boolean {
  if (mutation.type !== 'attributes') return false;
  if (mutation.attributeName !== 'href') return false;
  if (!(mutation.target instanceof HTMLAnchorElement)) return false;

  return !!mutation.target.querySelector('[data-testid=card-name]');
}

export function isRemovedCard(mutation: MutationRecord): boolean {
  return mutation.target.nodeName === 'OL' && mutation.removedNodes[0]?.nodeName === 'LI';
}

export function isCardListItemAdded(mutation: MutationRecord): boolean {
  if (mutation.type !== 'childList') return false;
  if (mutation.target.nodeName !== 'OL') return false;

  return Array.from(mutation.addedNodes).some((node) => node.nodeName === 'LI');
}

export function formatNumber(cardNumber: number, numberFormat: string): string {
  if (isNaN(cardNumber)) return '';

  return numberFormat.replace(TCNP_NUMBER_FORMAT_PLACEHOLDER, cardNumber.toString());
}

export function getCardNumberFromURL(url: string): number {
  const cardTitle = url.split('/').pop();
  return parseInt(cardTitle?.substring(0, cardTitle.indexOf('-')) ?? '');
}

export function getCardNumberFromParent(element: Element): number {
  const url = element.closest('a')?.href ?? '';
  return getCardNumberFromURL(url);
}

export function isBoardExcluded(excludedBoards: string, boardId: string) {
  const excludedBoardsedBoards = excludedBoards.split(';').map((ids) => ids.trim());
  return excludedBoardsedBoards.includes(boardId);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: unknown, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
