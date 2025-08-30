import React, { useEffect, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';
import { createSafeResizeObserver } from '@/utils/resizeObserverErrorHandler';

interface SafeResponsiveContainerProps {
  width?: string | number;
  height?: string | number;
  children: React.ReactNode;
  className?: string;
  debounce?: number;
}

/**
 * A safer wrapper around Recharts ResponsiveContainer that includes
 * error handling and debouncing to prevent ResizeObserver loops.
 */
export const SafeResponsiveContainer: React.FC<SafeResponsiveContainerProps> = ({
  width = "100%",
  height = 300,
  children,
  className,
  debounce = 50,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    // Create a debounced resize handler
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        // Force a re-render after resize to prevent loops
        if (containerRef.current) {
          const event = new Event('resize', { bubbles: true });
          window.dispatchEvent(event);
        }
      }, debounce);
    };

    // Create safe ResizeObserver
    resizeObserverRef.current = createSafeResizeObserver(() => {
      handleResize();
    });

    if (resizeObserverRef.current && containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debounce]);

  return (
    <div ref={containerRef} className={className}>
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export default SafeResponsiveContainer;
