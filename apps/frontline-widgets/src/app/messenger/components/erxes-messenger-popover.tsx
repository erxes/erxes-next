import {
  createContext,
  useContext,
  useRef,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  forwardRef,
  HTMLAttributes,
} from 'react';

interface PopoverContextValue {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

interface PopoverRootProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

interface PopoverTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface PopoverSectionProps {
  children: ReactNode;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx)
    throw new Error('Popover component must be used within Popover.Root');
  return ctx;
}

function Root({ open, onOpenChange, children }: PopoverRootProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <PopoverContext.Provider value={{ open, onOpenChange, triggerRef, contentRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

const Trigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function Trigger({ children, ...props }, ref) {
    const { open, onOpenChange, triggerRef } = usePopoverContext();
    return (
      <button
        ref={(node) => {
          if (node) {
            try {
              // @ts-ignore
              triggerRef.current = node;
            } catch {}
          }
          if (typeof ref === 'function') ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
              node;
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="erxes-messenger-popover-content"
        className="fixed bottom-5 right-5 bg-white shadow-[0_0_2px_1px_#0000000D] rounded-full size-12 flex items-center justify-center transition-colors hover:bg-gray-100 focus:outline-none z-50"
        onClick={() => onOpenChange((prev) => !prev)}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  },
);

const Content = forwardRef<HTMLDivElement, PopoverContentProps>(
  function Content({ children, className = '', ...props }, ref) {
    const { open, onOpenChange, triggerRef, contentRef } = usePopoverContext();

    useEffect(() => {
      if (!open) return;

      function handleClick(event: MouseEvent) {
        const target = event.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          onOpenChange(false);
        }
      }

      document.addEventListener('mousedown', handleClick);
      document.addEventListener('touchstart', handleClick as EventListener);

      return () => {
        document.removeEventListener('mousedown', handleClick);
        document.removeEventListener('touchstart', handleClick as EventListener);
      };
    }, [open, onOpenChange, triggerRef, contentRef]);

    if (!open) return null;
    return (
      <div
        ref={(node) => {
          // @ts-ignore
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        id="erxes-messenger-popover-content"
        role="dialog"
        aria-modal="true"
        data-state={open ? 'open' : 'closed'}
        className={`fixed bottom-20 right-5 z-50 max-w-md w-96 rounded-xl bg-zinc-50 overflow-hidden shadow-[0_0_0_1px_#0000000D] animate-in fade-in-0 slide-in-from-bottom-2 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

function Header({ children }: PopoverSectionProps) {
  return (
    <div className="flex flex-col gap-2 p-4 border-b border-zinc-100 bg-white">
      {children}
    </div>
  );
}

function Footer({ children }: PopoverSectionProps) {
  return <div className="flex p-4">{children}</div>;
}

export const ErxesMessengerPopover = {
  Root,
  Trigger,
  Content,
  Header,
  Footer,
};
