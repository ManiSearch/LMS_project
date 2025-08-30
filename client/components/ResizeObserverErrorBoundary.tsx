import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary specifically designed to catch and handle ResizeObserver-related errors.
 * This prevents the entire application from crashing due to benign ResizeObserver loops.
 */
class ResizeObserverErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if this is a ResizeObserver error
    const isResizeObserverError = 
      error.message && 
      (error.message.includes('ResizeObserver loop completed with undelivered notifications') ||
       error.message.includes('ResizeObserver loop limit exceeded'));

    if (isResizeObserverError) {
      // For ResizeObserver errors, we can safely ignore them
      console.warn('ResizeObserver error caught and handled:', error.message);
      return { hasError: false };
    }

    // For other errors, let them bubble up
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log ResizeObserver errors as warnings, not errors
    if (error.message && 
        (error.message.includes('ResizeObserver loop completed with undelivered notifications') ||
         error.message.includes('ResizeObserver loop limit exceeded'))) {
      console.warn('ResizeObserver error boundary caught:', error, errorInfo);
      return;
    }

    // Log other errors normally
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <p className="text-red-500">Something went wrong rendering this component.</p>
          <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ResizeObserverErrorBoundary;
