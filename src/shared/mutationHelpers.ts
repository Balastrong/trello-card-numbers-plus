export function isCard(element: Element): boolean {
  return element.classList.contains('list-card');
}

export function isDroppedCard(element: Element, mutation: MutationRecord): boolean {
  return (!element.classList.contains('ui-droppable') && mutation.oldValue?.includes('ui-droppable')) || false;
}

export function isDialogClosed(element: Element, mutation: MutationRecord): boolean {
  return element.classList.contains('window-wrapper') && mutation.removedNodes.length > 0;
}
