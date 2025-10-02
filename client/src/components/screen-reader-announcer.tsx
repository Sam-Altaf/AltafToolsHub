import { useEffect, useRef } from 'react';

interface AnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function ScreenReaderAnnouncer({ message, politeness = 'polite' }: AnnouncerProps) {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, [message]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

export function useAnnouncer() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  return { announce };
}
