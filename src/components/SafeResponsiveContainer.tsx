/**
 * SafeResponsiveContainer - Wraps recharts ResponsiveContainer
 * to prevent width/height -1 warnings when parent is hidden.
 */
import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { ResponsiveContainer, ResponsiveContainerProps } from 'recharts';

interface SafeResponsiveContainerProps extends Omit<ResponsiveContainerProps, 'children'> {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SafeResponsiveContainer({ children, fallback, ...props }: SafeResponsiveContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasDimensions, setHasDimensions] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setHasDimensions(true);
        }
      }
    });

    observer.observe(containerRef.current);

    // Also check immediately
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setHasDimensions(true);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {hasDimensions ? (
        <ResponsiveContainer {...props}>{children}</ResponsiveContainer>
      ) : (
        fallback || null
      )}
    </div>
  );
}