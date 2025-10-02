export function getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
  const focusableSelectors = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
  ).filter(el => {
    // Check if element is visible and not hidden
    const style = window.getComputedStyle(el);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      el.offsetParent !== null
    );
  });
}

export function trapFocus(container: HTMLElement, initialFocus?: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Focus initial element or first focusable element
  (initialFocus || firstElement).focus();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (forward)
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

export function restoreFocus(element: HTMLElement | null) {
  if (element && document.body.contains(element)) {
    element.focus();
  }
}

export function createFocusTrap(containerSelector: string) {
  const container = document.querySelector<HTMLElement>(containerSelector);
  if (!container) return () => {};

  const previouslyFocused = document.activeElement as HTMLElement;
  const cleanup = trapFocus(container);

  return () => {
    cleanup?.();
    restoreFocus(previouslyFocused);
  };
}
