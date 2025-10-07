import { Button } from './button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ScrollToTopProps {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
  threshold?: number;
}

export function ScrollToTop({ targetRef, className, threshold = 100 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollTop = element.scrollTop;
      setIsVisible(scrollTop > threshold);
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [targetRef, threshold]);

  const scrollToTop = () => {
    if (targetRef.current) {
      targetRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      variant="secondary"
      className={cn(
        'fixed bottom-20 right-4 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200',
        'bg-white border border-gray-200 hover:bg-gray-50',
        'w-10 h-10 p-0',
        className
      )}
      aria-label="Scroll to top"
    >
      <svg
        className="w-5 h-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </Button>
  );
}
