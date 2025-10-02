import { useEffect, useState } from 'react';

export function SkipLink() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleBlur = () => {
      setTimeout(() => setIsVisible(false), 100);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className={`
        fixed top-4 left-4 z-[9999] 
        px-4 py-2 
        bg-primary text-primary-foreground 
        rounded-md font-medium
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        transition-transform duration-200
        ${isVisible ? 'translate-y-0' : '-translate-y-20'}
      `}
      data-testid="skip-to-content"
    >
      Skip to main content
    </a>
  );
}
