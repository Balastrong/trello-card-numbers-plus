import { TCNP_NUMBER_FORMAT_PLACEHOLDER } from './const';

export function isDialogClosed(element: Element, mutation: MutationRecord): boolean {
  return mutation.removedNodes.length > 0 && element.classList.contains('js-fill-card-detail-desc');
}

export function isDialogOpened(element: Element): boolean {
  return element.classList.contains('card-detail-window');
}

export function isAddedCard(mutation: MutationRecord): boolean {
  return mutation.target.nodeName === 'OL' && mutation.addedNodes[0]?.nodeName === 'LI';
}

export function isRemovedCard(mutation: MutationRecord): boolean {
  return mutation.target.nodeName === 'OL' && mutation.removedNodes[0]?.nodeName === 'LI';
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
