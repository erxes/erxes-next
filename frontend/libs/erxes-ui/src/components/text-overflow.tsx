import { useRef, useState, useEffect } from 'react';
import { Tooltip } from './tooltip';

interface TextOverflowTooltipProps {
  text: string;
  className?: string;
}

export function TextOverflowTooltip({
  text,
  className,
}: TextOverflowTooltipProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(
          textRef.current.scrollWidth > textRef.current.clientWidth,
        );
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <div ref={textRef} className={`truncate w-full ${className}`}>
          {text}
        </div>
      </Tooltip.Trigger>
      {isOverflowing && (
        <Tooltip.Content>
          <span>{text}</span>
        </Tooltip.Content>
      )}
    </Tooltip>
  );
}
