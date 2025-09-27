import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

interface ReducedMotionContextType {
  reducedMotion: boolean;
  setUserPreference: (preference: boolean | null) => void;
  userPreference: boolean | null;
}

const ReducedMotionContext = createContext<ReducedMotionContextType | undefined>(undefined);

const STORAGE_KEY = 'altaf-tools-reduced-motion';

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(false);
  const [userPreference, setUserPreference] = useState<boolean | null>(null);

  // Check system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load user preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setUserPreference(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load reduced motion preference:', error);
    }
  }, []);

  // Save user preference when it changes
  useEffect(() => {
    try {
      if (userPreference !== null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userPreference));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to save reduced motion preference:', error);
    }
  }, [userPreference]);

  // User preference takes priority over system preference
  const reducedMotion = userPreference !== null ? userPreference : systemReducedMotion;

  // Update document attribute for CSS rules
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.reducedMotion = String(reducedMotion);
    }
  }, [reducedMotion]);

  const setUserPreferenceHandler = (preference: boolean | null) => {
    setUserPreference(preference);
  };

  return (
    <ReducedMotionContext.Provider 
      value={{ 
        reducedMotion, 
        setUserPreference: setUserPreferenceHandler, 
        userPreference 
      }}
    >
      <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
        {children}
      </MotionConfig>
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionContext() {
  const context = useContext(ReducedMotionContext);
  if (context === undefined) {
    throw new Error('useReducedMotionContext must be used within a ReducedMotionProvider');
  }
  return context;
}