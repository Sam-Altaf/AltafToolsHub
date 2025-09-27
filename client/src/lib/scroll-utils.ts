/**
 * Utility functions for scroll behavior in tool pages
 * Used to ensure users see the right content at the right time
 */

/**
 * Scrolls to an element with a smooth animation after a delay
 * @param elementId - The ID of the element to scroll to
 * @param delay - Delay in milliseconds before scrolling (default: 100ms)
 */
export const scrollToElement = (elementId: string, delay: number = 100) => {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, delay);
};

/**
 * Scrolls to an element using a query selector after a delay
 * @param selector - CSS selector for the element
 * @param delay - Delay in milliseconds before scrolling (default: 100ms)
 */
export const scrollToSelector = (selector: string, delay: number = 100) => {
  setTimeout(() => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, delay);
};

/**
 * Scrolls to the download section when a file is ready
 * @param delay - Delay in milliseconds before scrolling (default: 100ms)
 */
export const scrollToDownload = (delay: number = 100) => {
  scrollToSelector('[data-testid="button-download"]', delay);
};

/**
 * Scrolls to the processing/results section
 * @param delay - Delay in milliseconds before scrolling (default: 100ms)
 */
export const scrollToResults = (delay: number = 100) => {
  scrollToElement('results-section', delay);
};

/**
 * Scrolls to the file upload section
 * @param delay - Delay in milliseconds before scrolling (default: 100ms)
 */
export const scrollToUpload = (delay: number = 100) => {
  scrollToSelector('[data-testid="file-upload"]', delay);
};

/**
 * Scrolls down by a specific number of pixels
 * @param pixels - Number of pixels to scroll
 * @param delay - Delay in milliseconds before scrolling (default: 100ms)
 */
export const scrollBy = (pixels: number, delay: number = 100) => {
  setTimeout(() => {
    window.scrollBy({
      top: pixels,
      behavior: 'smooth'
    });
  }, delay);
};