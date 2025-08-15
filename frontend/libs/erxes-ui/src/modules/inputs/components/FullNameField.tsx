import { Badge, Input, Popover } from '../../../components';
import { useState } from 'react';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table';
import { usePopoverOnEnter } from 'erxes-ui/modules/record-table/hooks/usePopoverOnEnter';
import React from 'react';

interface FullNameFieldProps {
  firstName: string;
  lastName: string;
  onSave?: (firstName: string, lastName: string) => void;
  onClick?: (e: React.MouseEvent) => void;
  withBadge?: boolean;
  triggerClassName?: string;
  scope: string;
}

export const FullNameField = React.forwardRef<
  React.ElementRef<typeof Popover.Trigger>,
  FullNameFieldProps & React.ComponentPropsWithoutRef<typeof Popover.Trigger>
>(
  (
    {
      firstName,
      lastName,
      onSave,
      onClick,
      withBadge = false,
      scope,
      ...props
    },
    ref,
  ) => {
    const [firstNameState, setFirstNameState] = useState<string>(firstName);
    const [lastNameState, setLastNameState] = useState<string>(lastName);
    const [openState, setOpenState] = useState<boolean>(false);

    const { scopeHandleOnOpenChange } = usePopoverOnEnter(
      scope,
      () => {
        onSave?.(firstNameState || '', lastNameState || '');
        setOpenState(false);
      },
      [firstNameState, lastNameState],
    );

    const triggerValue =
      firstName || lastName ? (
        <span onClick={(e) => onClick?.(e)}>
          {firstName} {lastName}
        </span>
      ) : (
        <span className="text-muted-foreground">Unnamed customer</span>
      );

    const handleOpenChange = (open: boolean) => {
      setOpenState(open);
      scopeHandleOnOpenChange(open);
      if (open) {
        setFirstNameState(firstName);
        setLastNameState(lastName);
      } else {
        onSave?.(firstNameState || '', lastNameState || '');
      }
    };

    return (
      <Popover open={openState} onOpenChange={handleOpenChange}>
        <RecordTableInlineCell.Trigger ref={ref} {...props}>
          {withBadge ? (
            <Badge
              variant="secondary"
              onClick={(e) => {
                onClick?.(e);
              }}
            >
              {triggerValue}
            </Badge>
          ) : (
            triggerValue
          )}
        </RecordTableInlineCell.Trigger>
        <RecordTableInlineCell.Content asChild>
          <div className="flex gap-px bg-border w-72 rounded shadow-sm">
            <Input
              value={firstNameState || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFirstNameState(e.target.value);
              }}
              className="rounded-r-none focus-visible:z-10 max-w-36 shadow-none"
              placeholder="First name"
            />
            <Input
              value={lastNameState || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLastNameState(e.target.value);
              }}
              className="rounded-l-none focus-visible:z-10 max-w-36 shadow-none"
              placeholder="Last name"
            />
          </div>
        </RecordTableInlineCell.Content>
      </Popover>
    );
  },
);

FullNameField.displayName = 'FullNameField';
