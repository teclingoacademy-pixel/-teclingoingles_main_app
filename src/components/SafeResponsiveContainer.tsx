/**
 * SafeResponsiveContainer - Wraps recharts ResponsiveContainer
 * to prevent width/height -1 warnings when parent is hidden or not yet laid out.
 */
import { useRef, useState, useEffect, ReactNode } from 'react';
import { ResponsiveContainer, ResponsiveContainerProps } from 'recharts';

interface SafeResponsiveContainerProps extends Omit<ResponsiveContainerProps, 'children'> {
  children: ReactNode;
  fallback?: ReactNode;
}

const _origWarn = console.warn.bind(console);

let suppressed = false;

function suppressRechartsWarnings() {
  if (suppressed) return;
  suppressed = true;
  console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.includes('chart should be greater than 0')) return;
    _origWarn(...args);
  };
}

export function SafeResponsiveContainer({ children, fallback, width = '100%', height = '100%', ...props }: SafeResponsiveContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    suppressRechartsWarnings();

    if (!containerRef.current) return;

    let obs: ResizeObserver | null = null;
    let raf = 0;

    const check = () => {
      if (!containerRef.current) return false;
      const { width: w, height: h } = containerRef.current.getBoundingClientRect();
      if (w > 0 && h > 0) { setReady(true); return true; }
      return false;
    };

    if (!check()) {
      obs = new ResizeObserver(() => { check(); });
      obs.observe(containerRef.current);
      raf = requestAnimationFrame(check);
    }

    return () => { obs?.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  if (!ready) {
    return (
      <div ref={containerRef} style={{ width, height, minHeight: 1, minWidth: 1 }}>
        {fallback || null}
      </div>
    );
  }

  return (
    <ResponsiveContainer width={width} height={height} {...props}>
      {children}
    </ResponsiveContainer>
  );
}
