import { Button, ButtonProps, Input, Popover } from 'erxes-ui/components';

import React, { useEffect, useState } from 'react';
import { cn } from 'erxes-ui/lib';
import { PopoverContent, PopoverPortal } from '@radix-ui/react-popover';
import { usePreviousHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/usePreviousHotkeyScope';
import { useCustomersEdit } from '@/contacts/customer-edit/hooks/useCustomerEdit';
import { IconLoader } from '@tabler/icons-react';

export const TextField = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    placeholder?: string;
    value: string;
    field: string;
    _id: string;
  }
>(({ className, placeholder, value, field, _id, ...props }, ref) => {
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();
  const [open, setOpen] = useState(false);

  const [editingValue, setEditingValue] = useState(value);

  const { customersEdit, loading } = useCustomersEdit();

  useEffect(() => {
    if (value) setEditingValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingValue === value) return setOpen(false);
    customersEdit(
      {
        variables: {
          _id,
          [field]: editingValue,
        },
        onCompleted: () => {
          setOpen(false);
        },
      },
      field,
    );
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          setHotkeyScopeAndMemorizePreviousScope('customerEdit' + field);
        } else {
          goBackToPreviousHotkeyScope();
        }
      }}
    >
      <Popover.Trigger asChild>
        <Button
          variant="ghost"
          className={cn(!editingValue && 'text-border', className)}
          {...props}
          ref={ref}
        >
          {editingValue ?? placeholder}
        </Button>
      </Popover.Trigger>
      <PopoverPortal>
        <PopoverContent className="p-0 z-50" align="start" sideOffset={-32}>
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              placeholder={placeholder}
            />
            {loading && (
              <IconLoader className="absolute right-2 top-2.5  size-3 animate-spin" />
            )}
          </form>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
});
