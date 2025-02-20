import React, { useRef, useState } from 'react';
import {
  IconBookmarkPlus,
  IconPencil,
  IconTrash,
  IconDotsVertical,
  IconBookmark,
  IconPlus,
} from '@tabler/icons-react';
import { Popover, Command, Button, Input } from 'erxes-ui/components';
import { PhoneInput } from 'erxes-ui/modules/record-field/meta-inputs/components/PhoneInput';
import {
  parsePhoneNumberFromString,
  formatIncompletePhoneNumber,
  CountryCode,
} from 'libphonenumber-js';
import { InlineCell } from 'erxes-ui/modules/inline-cell/components/InlineCell';
import { InlineCellDisplay } from 'erxes-ui/modules/inline-cell/components/InlineCellDisplay';
import { InlineCellEdit } from 'erxes-ui/modules/inline-cell/components/InlineCellEdit';
import { cn } from 'erxes-ui/lib';

export const Phone = React.forwardRef<
  React.ElementRef<typeof Button>,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onChange'> & {
    recordId: string;
    primaryPhone: string | undefined;
    phones: string[];
    fieldId?: string;
    defaultCountryCode?: CountryCode | undefined;
    onChange: (
      primaryPhone: string,
      phones: string[],
      onCompleted: () => void,
    ) => void;
  }
>(
  (
    { recordId, primaryPhone, phones, onChange, defaultCountryCode = 'MN', ...props },
    ref,
  ) => {
    const [newPhone, setNewPhone] = useState<string>('');
    const [editingPhone, setEditingPhone] = useState<string | null>(null);
    const [allPhones, setAllPhones] = useState<string[]>([
      ...(primaryPhone ? [primaryPhone] : []),
      ...phones.filter((phone) => phone !== primaryPhone),
    ]);
    const [isAddingPhone, setIsAddingPhone] = useState<boolean>(
      allPhones.length === 0,
    );
    const inputRef = useRef<React.ElementRef<typeof Input>>(null);

    const validatePhoneNumber = (phone: string): boolean => {
      const phoneNumber = parsePhoneNumberFromString(phone);
      return phoneNumber ? phoneNumber.isPossible() : false;
    };

    const handleEscape = (closeEditMode: () => void) => {
      closeEditMode();
      setNewPhone('');
      setIsAddingPhone(false);
      setEditingPhone(null);
    };

    const handleChange = (updatedPhones: string[]) => {
      const [newPrimaryPhone, ...restPhones] = updatedPhones;
      onChange(newPrimaryPhone || '', restPhones, () =>
        setAllPhones(updatedPhones),
      );
    };

    const handleDelete = (phoneToDelete: string) => {
      const updatedPhones = allPhones.filter((p) => p !== phoneToDelete);
      handleChange(updatedPhones);
    };

    const handleSetPrimary = (phoneToSetPrimary: string) => {
      const remainingPhones = allPhones.filter((p) => p !== phoneToSetPrimary);
      const updatedPhones = [phoneToSetPrimary, ...remainingPhones];
      handleChange(updatedPhones);
    };

    const handleAddNewPhone = () => {
      if (newPhone && !allPhones.includes(newPhone)) {
        if (validatePhoneNumber(newPhone)) {
          const updatedPhones = [...allPhones, newPhone];
          handleChange(updatedPhones);
          setNewPhone('');
          setIsAddingPhone(false);
        } else {
          console.log('noo');
        }
      }
    };

    const handleEdit = (phoneToEdit: string) => {
      setEditingPhone(phoneToEdit);
      setNewPhone(phoneToEdit);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    };

    const handleEditSubmit = () => {
      if (
        editingPhone &&
        newPhone.trim() &&
        !allPhones.includes(newPhone.trim())
      ) {
        if (validatePhoneNumber(newPhone)) {
          const updatedPhones = allPhones.map((phone) =>
            phone === editingPhone ? newPhone : phone,
          );
          handleChange(updatedPhones);
          setNewPhone('');
          setEditingPhone(null);
        }
      }
    };

    const handlePhoneInput = (value: string) => {
      setNewPhone(value);
    };

    return (
      <InlineCell
        name="phone"
        recordId={recordId}
        onEnter={editingPhone ? handleEditSubmit : handleAddNewPhone}
        onEscape={handleEscape}
        onCancel={handleEscape}
        display={() => (
          <PhoneListDisplay
            phones={allPhones}
            ref={ref}
            {...props}
            onClick={() => {
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          />
        )}
        edit={() => (
          <InlineCellEdit className="w-56 p-1">
            <PhoneItems
              phones={allPhones}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
              onEdit={handleEdit}
              editingPhone={editingPhone}
            >
              <PhoneMutate
                defaultCountryCode={defaultCountryCode}
                isAddingPhone={isAddingPhone}
                isEditing={Boolean(editingPhone)}
                newPhone={newPhone}
                inputRef={inputRef}
                onInputChange={handlePhoneInput}
                onAddClick={() => {
                  setIsAddingPhone(true);
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 0);
                }}
              />
            </PhoneItems>
          </InlineCellEdit>
        )}
      />
    );
  },
);

const PhoneListDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & { phones: string[] }
>(({ phones, onClick, ...props }, ref) => (
  <InlineCellDisplay
    className="w-full h-cell"
    ref={ref}
    asChild
    {...props}
    onClick={onClick}
  >
    <div className="w-full relative h-cell group">
      {phones.map((phone, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-min hover:bg-border"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {formatIncompletePhoneNumber(phone || '')}
        </Button>
      ))}
      <Button
        variant="outline"
        size={'icon'}
        className="absolute right-1 size-5 px-0 hidden items-center hover:bg-border justify-center group-hover:flex"
      >
        <IconPencil className="text-muted-foreground" />
      </Button>
    </div>
  </InlineCellDisplay>
));

interface PhoneActionPopoverProps {
  phone: string;
  onDelete: (phone: string) => void;
  onSetPrimary: (phone: string) => void;
  onEdit: (phone: string) => void;
  isEditing: boolean;
  isPrimary: boolean;
}

const PhoneActionPopover: React.FC<PhoneActionPopoverProps> = ({
  phone,
  isPrimary = false,
  onDelete,
  onSetPrimary,
  onEdit,
  isEditing,
}) => {
  const triggerButtonRef = useRef<React.ElementRef<typeof Button>>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    triggerButtonRef?.current?.focus();
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open} modal>
      <Popover.Trigger asChild>
        <Button
          ref={triggerButtonRef}
          variant="ghost"
          size="icon"
          className={cn(
            'absolute right-1 opacity-0 group-hover:opacity-100 hover:bg-border flex items-center justify-center transition-opacity size-5 px-0',
            open && 'opacity-100 bg-border z-20',
          )}
          disabled={isEditing}
        >
          <IconDotsVertical className="text-muted-foreground w-4 h-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="bg-background p-1 shadow-lg w-56" align="end">
        <Command>
          <Command.List>
            {!isPrimary && (
              <Command.Item className="h-cell" asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-muted-foreground"
                  onClick={() => {
                    onSetPrimary(phone);
                    setOpen(false);
                  }}
                >
                  <IconBookmarkPlus className="w-4 h-4 " />
                  Set as primary phone
                </Button>
              </Command.Item>
            )}
            <Command.Item className="h-cell" asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground"
                onClick={() => {
                  onEdit(phone);
                  setOpen(false);
                }}
              >
                <IconPencil className="w-4 h-4 " />
                Edit
              </Button>
            </Command.Item>
            <Command.Item className="h-cell" asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => {
                  onDelete(phone);
                  setOpen(false);
                }}
              >
                <IconTrash className="w-4 h-4" />
                Delete
              </Button>
            </Command.Item>
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
};

interface PhoneMutateProps {
  isAddingPhone: boolean;
  isEditing: boolean;
  newPhone: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onAddClick: () => void;
  defaultCountryCode: CountryCode | undefined;
}

const PhoneMutate: React.FC<PhoneMutateProps> = ({
  isAddingPhone,
  isEditing,
  newPhone,
  inputRef,
  onInputChange,
  defaultCountryCode,
  onAddClick,
}) => (
  <Command.Item className="h-cell text-xs items-center justify-start flex p-0 mb-px">
    {isAddingPhone || isEditing ? (
      <PhoneInput
        className="w-full m-1"
        ref={inputRef}
        value={newPhone}
        onChange={onInputChange}
        defaultCountry={defaultCountryCode}
        placeholder={isEditing ? 'Edit phone number' : 'Add new phone number'}
      />
    ) : (
      <Button
        variant="ghost"
        className="flex gap-1 hover:bg-transparent justify-start w-full h-full focus-visible:ring-0"
        onClick={onAddClick}
      >
        <IconPlus />
        Add Phone Number
      </Button>
    )}
  </Command.Item>
);

interface PhoneItemsProps {
  phones: string[];
  onDelete: (phone: string) => void;
  onSetPrimary: (phone: string) => void;
  onEdit: (phone: string) => void;
  editingPhone: string | null;
  children: React.ReactNode;
}

const PhoneItems: React.FC<PhoneItemsProps> = ({
  phones,
  onDelete,
  onSetPrimary,
  onEdit,
  editingPhone,
  children,
}) => (
  <Command>
    <Command.List className=" overflow-y-auto">
      {phones.map((phone, index) => (
        <Command.Item
          key={index}
          className="group relative flex items-center h-cell text-xs"
        >
          <span className="relative truncate max-w-[180px]">
            <span className="relative z-10 hover:cursor-pointer">
              {formatIncompletePhoneNumber(phone || '')}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-transparent group-hover:bg-muted-foreground" />
          </span>

          {index === 0 && (
            <IconBookmark className="text-muted-foreground absolute right-2 h-[15px] w-[15px] group-hover:hidden" />
          )}
          <PhoneActionPopover
            phone={phone}
            isPrimary={index === 0}
            onDelete={onDelete}
            onSetPrimary={onSetPrimary}
            onEdit={onEdit}
            isEditing={Boolean(editingPhone)}
          />
        </Command.Item>
      ))}
      {phones.length > 0 && <Command.Separator className="my-1" />}
      {children}
    </Command.List>
  </Command>
);
