import { useRef, useState, useEffect, forwardRef } from 'react';
import { Tooltip } from './tooltip';
import { cn } from 'erxes-ui/lib';

interface TextOverflowTooltipProps {
  value?: string;
  className?: string;
}

export const TextOverflowTooltip = forwardRef<
  HTMLSpanElement,
  TextOverflowTooltipProps
>(({ value, className }, forwardedRef) => {
  const innerRef = useRef<HTMLSpanElement>(null);
  const textRef = forwardedRef || innerRef;
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const element = 'current' in textRef ? textRef.current : null;
      if (element) {
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [value, textRef]);

  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <span ref={textRef} className={cn('truncate w-full', className)}>
            {value}
          </span>
        </Tooltip.Trigger>
        {isOverflowing && (
          <Tooltip.Content>
            <span>{value}</span>
          </Tooltip.Content>
        )}
      </Tooltip>
    </Tooltip.Provider>
  );
});

TextOverflowTooltip.displayName = 'TextOverflowTooltip';
