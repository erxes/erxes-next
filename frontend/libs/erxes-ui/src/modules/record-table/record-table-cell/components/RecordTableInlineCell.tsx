import * as React from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Cell } from '@tanstack/react-table';

import { cn } from 'erxes-ui/lib';

import {
  RecordTableCellContext,
  useRecordTableCellContext,
} from '../contexts/RecordTableCellContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface InlineCellProps extends React.HTMLAttributes<HTMLDivElement> {
  onSave?: (value: any) => void;
  getValue?: Cell<any, any>['getValue'];
  value?: unknown;
  display?: (props: InlineCellHandlers) => React.ReactNode;
  edit?: (props: InlineCellHandlers) => React.ReactNode;
  setValue?: (value: any) => void;
}

interface InlineCellHandlers {
  isInEditMode: boolean;
  setIsInEditMode: (value: boolean) => void;
  handleSelect: (value: any) => void;
}

export function RecordTableInlineCell({
  onSave,
  getValue,
  value,
  display,
  edit,
  setValue,
  ...props
}: InlineCellProps) {
  const [isInEditMode, setIsInEditMode] = React.useState(false);

  const handleSave = () => {
    setIsInEditMode(false);
    if (value === getValue?.()) return;
    onSave?.(value);
  };

  const handleSelect = (selectedValue: any) => {
    setIsInEditMode(false);
    setValue?.(selectedValue);
    if (selectedValue === getValue?.()) return;
    onSave?.(selectedValue);
  };

  return (
    <RecordTableCellContext.Provider
      value={{
        isInEditMode,
        setIsInEditMode,
        handleSave,
        handleSelect,
      }}
    >
      <RecordTableInlineCellContainer {...props}>
        <RecordTableCellDisplayContainer readOnly={!edit}>
          {display?.({
            isInEditMode,
            setIsInEditMode,
            handleSelect,
          })}
        </RecordTableCellDisplayContainer>
        <RecordTableInlineCellEditContainer>
          {edit?.({
            isInEditMode,
            setIsInEditMode,
            handleSelect,
          })}
        </RecordTableInlineCellEditContainer>
      </RecordTableInlineCellContainer>
    </RecordTableCellContext.Provider>
  );
}

export const RecordTableInlineCellContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { isInEditMode } = useRecordTableCellContext();

  return (
    <div
      ref={ref}
      className={cn(
        'w-full flex items-stretch relative h-8 cursor-pointer box-border overflow-hidden',
        isInEditMode && 'overflow-auto items-start',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

RecordTableInlineCellContainer.displayName = 'RecordTableInlineCellContainer';

export function RecordTableCellDisplayContainer({
  className,
  readOnly,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { readOnly?: boolean }) {
  const { isInEditMode, setIsInEditMode } = useRecordTableCellContext();

  if (isInEditMode) return null;

  return (
    <div
      className={cn('w-full pl-2 flex items-center', className)}
      {...props}
      onClick={() => !readOnly && setIsInEditMode(true)}
    />
  );
}

export function RecordTableInlineCellEditContainer({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isInEditMode, handleSave } = useRecordTableCellContext();

  if (!isInEditMode) return null;

  return (
    <Popover.Root open={isInEditMode} onOpenChange={handleSave}>
      <Popover.Trigger className="w-full" />
      <Popover.Portal>
        <Popover.Content
          className={cn(
            'z-20 min-w-[var(--radix-popper-anchor-width)] bg-background p-0 shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
          sideOffset={-1}
          align="start"
          {...props}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

interface RecordTableInlineCellEditFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit?: () => void;
}

export function RecordTableInlineCellEditForm({
  children,
  onSubmit,
  ...props
}: RecordTableInlineCellEditFormProps) {
  const { handleSave } = useRecordTableCellContext();

  return (
    <form
      onSubmit={(e) => {
        if (onSubmit) onSubmit();
        e.preventDefault();
        handleSave();
      }}
      {...props}
    >
      {children}
    </form>
  );
}

export const emailSchema = z.object({
  email: z.string().trim().email('Invalid Email').or(z.literal('')).optional(),
});

export function RecordTableInlineCellEmailEditForm({
  children,
  onValueChange,
  defaultValue = '',
  ...props
}: React.HTMLAttributes<HTMLFormElement> & {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const { handleSave } = useRecordTableCellContext();

  type EmailFormData = z.infer<typeof emailSchema>;

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: {
      email: defaultValue,
    },
  });

  const emailValue = watch('email');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue('email', newValue, { shouldValidate: true });
    onValueChange?.(newValue);
  };

  const onSubmit = () => {
    handleSave();
  };
  const mapChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const nestedChildren = child.props.children
        ? mapChildren(child.props.children)
        : child.props.children;

      if (child.props.type === 'email') {
        return React.cloneElement(child, {
          ...child.props,
          value: emailValue,
          onChange: handleChange,
          error: errors.email?.message,
          className: cn(
            child.props?.className || '',
            errors.email
              ? ' focus-visible:shadow ring-destructive focus-visible:shadow-destructive focus-visible:ring-destructive/50 focus-visible:outline-none focus-visible:ring-[3px]'
              : '',
          ),
          children: nestedChildren,
        });
      }

      return React.cloneElement(child, {
        ...child.props,
        children: nestedChildren,
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      {mapChildren(children)}
    </form>
  );
}
