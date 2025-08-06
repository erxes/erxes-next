import {
  Button,
  cn,
  Input,
  Label,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
  TextOverflowTooltip,
} from 'erxes-ui';
import React, { useState } from 'react';
import {
  Icon,
  IconExternalLink,
  IconLink,
  IconProps,
} from '@tabler/icons-react';
import { useUserEdit } from '@/settings/team-member/hooks/useUserEdit';

type UserLinks = {
  facebook?: string;
  twitter?: string;
  website?: string;
  discord?: string;
  github?: string;
  instagram?: string;
};

type LinkFieldName = keyof UserLinks;

type Props = {
  links: UserLinks;
  _id: string;
  linkField: string;
  label: string;
  InputIcon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<Icon>
  >;
} & React.HTMLAttributes<HTMLButtonElement>;

export const LinkInput = React.forwardRef<HTMLButtonElement, Props>(
  ({ _id, links, linkField, label, InputIcon, ...props }, ref) => {
    const { usersEdit } = useUserEdit();
    const value = links?.[linkField as LinkFieldName] ?? '';
    const [isOpen, setIsOpen] = useState(false);
    const [editingValue, setEditingValue] = useState(value);

    const handleSave = (newValue: string) => {
      usersEdit({
        variables: {
          _id,
          links: {
            ...links,
            [linkField]: newValue,
          },
        },
      });
    };

    const handleAction = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (editingValue === value) {
        setIsOpen(false);
        return;
      }
      handleSave(editingValue);
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAction();
      }
      if (e.key === 'Escape') {
        setEditingValue(value);
        setIsOpen(false);
      }
    };

    function handleNavigate(
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ): void {
      event.stopPropagation();

      if (!value) return;

      const trimmed = value.trim();

      let url = trimmed;

      if (linkField === 'discord' && /^\d{17,19}$/.test(trimmed)) {
        url = `https://discord.com/users/${trimmed}`;
      } else if (/^https?:\/\//i.test(trimmed)) {
        url = trimmed;
      } else {
        url = `https://${trimmed}`;
      }

      window.open(url, '_blank');
    }

    return (
      <fieldset className="space-y-2">
        <Label asChild>
          <legend>{label}</legend>
        </Label>
        <RecordTablePopover
          scope={`user-${_id}-${linkField}`}
          open={isOpen}
          onOpenChange={(open: boolean) => {
            setIsOpen(open);
            if (open) {
              setEditingValue(value);
            } else if (!open && editingValue !== value) {
              handleAction();
            }
          }}
        >
          <RecordTableCellTrigger
            {...props}
            ref={ref}
            className="relative md:border border-accent rounded-sm p-0 group"
          >
            <span className="absolute inset-0 w-8 flex items-center justify-center text-muted-foreground bg-muted rounded-l-sm">
              {InputIcon ? <InputIcon size={16} /> : <IconLink size={16} />}
            </span>
            <Input
              readOnly
              className={cn(props.className, 'pl-9 w-full')}
              value={value}
              placeholder={`https://www.${label.toLowerCase()}.com/username`}
            />
            <span
              className={cn(
                'absolute inset-y-0 right-0 w-8 flex overflow-hidden items-center justify-center text-muted-foreground bg-muted rounded-r-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 ease-linear',
                !value && 'hidden',
              )}
            >
              <Button
                type="button"
                variant={'ghost'}
                onClick={handleNavigate}
                className={cn(
                  'md:bg-none border-0',
                  !value && 'pointer-events-none',
                )}
                disabled={!value}
                aria-label="Open link"
              >
                <IconExternalLink size={16} />
              </Button>
            </span>
          </RecordTableCellTrigger>
          <RecordTableCellContent asChild>
            <form onSubmit={handleAction}>
              <div className="relative">
                <span className="absolute inset-0 w-8 flex items-center justify-center text-muted-foreground bg-muted rounded-l-sm">
                  {InputIcon ? <InputIcon size={16} /> : <IconLink size={16} />}
                </span>
                <Input
                  className={cn(props.className, 'pl-9')}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  value={editingValue}
                />
              </div>
              <button type="submit" className="sr-only">
                Save
              </button>
            </form>
          </RecordTableCellContent>
        </RecordTablePopover>
      </fieldset>
    );
  },
);
