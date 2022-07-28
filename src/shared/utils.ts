import { TCNP_NUMBER_FORMAT_PLACEHOLDER } from './const';

export function isCard(element: Element): boolean {
  return element.classList.contains('list-card');
}

export function isDroppedCard(element: Element, mutation: MutationRecord): boolean {
  return (!element.classList.contains('ui-droppable') && mutation.oldValue?.includes('ui-droppable')) || false;
}

export function isDialogClosed(element: Element, mutation: MutationRecord): boolean {
  return element.classList.contains('window-wrapper') && mutation.removedNodes.length > 0;
}

export function isAddedCard(element: Element, mutation: MutationRecord): boolean {
  return mutation.removedNodes?.length > 0 && element.classList.contains('js-menu-action-list');
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
