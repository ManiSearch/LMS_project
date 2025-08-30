/**
 * Utility to handle ResizeObserver errors that commonly occur in React applications
 * with chart libraries and responsive containers.
 * 
 * This suppresses the "ResizeObserver loop completed with undelivered notifications"
 * error which is typically harmless but noisy in development.
 */

// Store original error handler
const originalConsoleError = console.error;

// Flag to control error suppression
let suppressResizeObserverErrors = true;

export const initializeResizeObserverErrorHandler = () => {
  // Override console.error to filter out ResizeObserver errors
  console.error = (...args: any[]) => {
    if (suppressResizeObserverErrors) {
      // Check if this is a ResizeObserver error
      const errorMessage = args[0];
      if (
        typeof errorMessage === 'string' &&
        errorMessage.includes('ResizeObserver loop completed with undelivered notifications')
      ) {
        // Suppress this specific error
        return;
      }
    }
    
    // Call original console.error for all other errors
    originalConsoleError.apply(console, args);
  };

  // Also handle uncaught promise rejections that might be ResizeObserver related
  window.addEventListener('unhandledrejection', (event) => {
    if (suppressResizeObserverErrors) {
      const error = event.reason;
      if (
        error &&
        typeof error.message === 'string' &&
        error.message.includes('ResizeObserver loop completed with undelivered notifications')
      ) {
        event.preventDefault();
        return;
      }
    }
  });

  // Handle window errors
  window.addEventListener('error', (event) => {
    if (suppressResizeObserverErrors) {
      if (
        event.message &&
        event.message.includes('ResizeObserver loop completed with undelivered notifications')
      ) {
        event.preventDefault();
        return;
      }
    }
  });
};

export const enableResizeObserverErrorSuppression = () => {
  suppressResizeObserverErrors = true;
};

export const disableResizeObserverErrorSuppression = () => {
  suppressResizeObserverErrors = false;
};

/**
 * Utility wrapper for ResizeObserver that includes error handling
 */
export const createSafeResizeObserver = (
  callback: ResizeObserverCallback
): ResizeObserver | null => {
  if (typeof ResizeObserver === 'undefined') {
    console.warn('ResizeObserver is not supported in this environment');
    return null;
  }

  try {
    return new ResizeObserver((entries, observer) => {
      try {
        callback(entries, observer);
      } catch (error) {
        // Silently handle callback errors to prevent loops
        if (
          error instanceof Error &&
          !error.message.includes('ResizeObserver loop completed with undelivered notifications')
        ) {
          console.warn('ResizeObserver callback error:', error);
        }
      }
    });
  } catch (error) {
    console.warn('Failed to create ResizeObserver:', error);
    return null;
  }
};
