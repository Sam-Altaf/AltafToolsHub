import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

const defaultShortcuts: KeyboardShortcut[] = [
  {
    key: 'k',
    ctrl: true,
    description: 'Open search',
    action: () => {
      const searchInput = document.querySelector('[data-testid="input-search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },
  {
    key: '/',
    description: 'Focus search',
    action: () => {
      const searchInput = document.querySelector('[data-testid="input-search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },
  {
    key: 'h',
    alt: true,
    description: 'Go to home',
    action: () => {
      window.location.href = '/';
    }
  },
  {
    key: 'p',
    alt: true,
    description: 'PDF Tools',
    action: () => {
      const pdfNav = document.querySelector('[data-testid="nav-pdf-tools"]') as HTMLElement;
      if (pdfNav) {
        pdfNav.click();
      }
    }
  },
  {
    key: 'i',
    alt: true,
    description: 'Image Tools',
    action: () => {
      const imageNav = document.querySelector('[data-testid="nav-image-tools"]') as HTMLElement;
      if (imageNav) {
        imageNav.click();
      }
    }
  }
];

export function useKeyboardShortcuts(customShortcuts: KeyboardShortcut[] = []) {
  const shortcuts = [...defaultShortcuts, ...customShortcuts];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      // Allow / for search even when in input
      if (event.key !== '/' || event.ctrlKey || event.altKey) {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}

// Show keyboard shortcuts help
export function showKeyboardShortcuts() {
  const shortcuts = defaultShortcuts;
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in';
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };

  const content = document.createElement('div');
  content.className = 'bg-background rounded-lg shadow-lg p-6 max-w-md mx-4 animate-in zoom-in-95';
  content.innerHTML = `
    <h2 class="text-lg font-semibold mb-4">Keyboard Shortcuts</h2>
    <div class="space-y-2">
      ${shortcuts.map(s => `
        <div class="flex justify-between items-center">
          <span class="text-sm text-muted-foreground">${s.description}</span>
          <kbd class="px-2 py-1 text-xs bg-muted rounded">
            ${s.ctrl ? 'Ctrl+' : ''}${s.alt ? 'Alt+' : ''}${s.shift ? 'Shift+' : ''}${s.key.toUpperCase()}
          </kbd>
        </div>
      `).join('')}
    </div>
    <button class="mt-4 w-full py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
      Close
    </button>
  `;

  content.querySelector('button')?.addEventListener('click', () => modal.remove());
  modal.appendChild(content);
  document.body.appendChild(modal);
}