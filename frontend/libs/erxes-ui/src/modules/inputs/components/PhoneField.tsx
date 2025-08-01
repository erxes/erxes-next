import {
  IconBookmark,
  IconBookmarkFilled,
  IconCircleDashed,
  IconCircleDashedCheck,
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { PhoneInput } from 'erxes-ui/modules/record-field/meta-inputs/components/PhoneInput';
import {
  Badge,
  Button,
  DropdownMenu,
  Separator,
  TextOverflowTooltip,
} from 'erxes-ui/components';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  phonesFamilyState,
  showPhoneInputFamilyState,
  editingPhoneFamilyState,
} from '../states/phoneFieldStates';
import { formatPhoneNumber } from 'erxes-ui/utils/format';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { cn } from 'erxes-ui/lib';
import { usePhoneFields } from '../hooks/usePhoneFields';
import { PhoneFieldsContext } from '../contexts/PhoneFieldsContext';
import {
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui/modules';

export interface IPhoneField {
  phone?: string;
  status?: 'verified' | 'unverified';
  isPrimary?: boolean;
}

export type TPhones = IPhoneField[];

const PhoneListContainer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props} className={cn('p-1 space-y-1', className)} />;
};
PhoneListContainer.displayName = 'PhoneListContainer';

const PhoneFieldsProvider = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    recordId: string;
    onValueChange: (phones: TPhones) => void;
    onValidationStatusChange?: (status: 'verified' | 'unverified') => void;
  } & React.HTMLAttributes<HTMLDivElement>
>(
  (
    { children, recordId, onValueChange, onValidationStatusChange, ...props },
    ref,
  ) => {
    return (
      <PhoneFieldsContext.Provider
        value={{ recordId, onValueChange, onValidationStatusChange }}
      >
        <div ref={ref} {...props}>
          {children}
        </div>
      </PhoneFieldsContext.Provider>
    );
  },
);
PhoneFieldsProvider.displayName = 'PhoneFieldsProvider';

const PhoneList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { recordId } = usePhoneFields();
  const phones = useAtomValue(phonesFamilyState(recordId));
  const [animationParent] = useAutoAnimate();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  return (
    <div
      ref={mounted.current ? animationParent : ref}
      className={cn('space-y-1', className)}
      {...props}
    >
      {phones.map(
        (phone) =>
          phone.phone && (
            <div
              className="flex items-center overflow-hidden gap-1 w-full"
              key={phone.phone}
            >
              <PhoneItem {...phone} />
              <PhoneOptions {...phone} />
            </div>
          ),
      )}
    </div>
  );
});
PhoneList.displayName = 'PhoneList';

const PhoneItem = forwardRef<
  HTMLButtonElement,
  IPhoneField & React.ComponentProps<typeof Button>
>(({ phone, status, isPrimary, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="secondary"
      className={cn(
        'w-full font-medium text-left justify-start px-2 flex-auto overflow-hidden',
        isPrimary && 'text-primary bg-primary/10 hover:bg-primary/20',
        className,
      )}
      size="lg"
      {...props}
    >
      {status === 'verified' ? (
        <IconCircleDashedCheck className="text-success" />
      ) : (
        <IconCircleDashed className="text-muted-foreground" />
      )}
      <TextOverflowTooltip value={phone} />
      {isPrimary && <IconBookmarkFilled className="text-primary" />}
    </Button>
  );
});
PhoneItem.displayName = 'PhoneItem';

const PhoneOptions = forwardRef<
  HTMLButtonElement,
  IPhoneField & React.ComponentProps<typeof Button>
>(({ phone, status, isPrimary, className, ...props }, ref) => {
  const { recordId, onValueChange, onValidationStatusChange } =
    usePhoneFields();
  const phones = useAtomValue(phonesFamilyState(recordId));
  const setEditingPhone = useSetAtom(editingPhoneFamilyState(recordId));
  const setShowPhoneInput = useSetAtom(showPhoneInputFamilyState(recordId));

  const handleSetPrimaryPhone = () => {
    if (isPrimary) return;
    onValueChange?.([
      { phone, status, isPrimary: true },
      ...(phones || [])
        .filter((e) => e.phone !== phone)
        .map((e) => ({ ...e, isPrimary: false })),
    ]);
  };

  const handleEditClick = () => {
    setShowPhoneInput(true);
    setEditingPhone(phone || null);
  };

  const handleVerificationChange = (value: string) => {
    onValidationStatusChange?.(value as 'verified' | 'unverified');
  };

  const handleDeleteClick = () => {
    onValueChange?.(phones.filter((e) => e.phone !== phone));
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          ref={ref}
          variant="secondary"
          className={cn('w-full font-medium size-8 flex-shrink-0', className)}
          size="icon"
          {...props}
        >
          <IconDots />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side="right"
        className="min-w-48 text-sm"
        sideOffset={8}
        alignOffset={-4}
        align="start"
      >
        <DropdownMenu.Item onClick={handleSetPrimaryPhone}>
          {isPrimary ? (
            <IconBookmarkFilled className="text-primary" />
          ) : (
            <IconBookmark />
          )}
          {isPrimary ? 'Primary phone' : 'Set as primary phone'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleEditClick}>
          <IconEdit />
          Edit
        </DropdownMenu.Item>

        {isPrimary && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup onValueChange={handleVerificationChange}>
              <DropdownMenu.RadioItem value="verified">
                <IconCircleDashedCheck className="text-success data-[state=active]:bg-muted " />
                Verified
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="unverified">
                <IconCircleDashed className="text-muted-foreground" />
                Unverified
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </>
        )}
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          className="text-destructive"
          onClick={handleDeleteClick}
        >
          <IconTrash />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
});
PhoneOptions.displayName = 'PhoneOptions';

const PhoneForm = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultCountry?: string;
  }
>(({ className, defaultCountry = 'MN', ...props }, ref) => {
  const { recordId } = usePhoneFields();
  const phones = useAtomValue(phonesFamilyState(recordId));
  const [newPhone, setNewPhone] = useState<string>('');
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);
  const [editingPhone, setEditingPhone] = useAtom(
    editingPhoneFamilyState(recordId),
  );
  const { onValueChange } = usePhoneFields();
  const [showPhoneInput, setShowPhoneInput] = useAtom(
    showPhoneInputFamilyState(recordId),
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!showPhoneInput) return;
    setTimeout(() => {
      inputRef.current?.focus();
    }, 180);
    if (editingPhone) {
      setNewPhone(editingPhone);
    }
  }, [showPhoneInput, editingPhone]);

  useEffect(() => {
    if (phones.filter((phone) => !!phone.phone).length === 0) {
      setShowPhoneInput(true);
      setTimeout(() => {
        inputRef.current?.focus();
      });
    } else {
      setShowPhoneInput(false);
    }
  }, [phones, setShowPhoneInput]);
  const onPhoneEdit = (newPhone: string, prevPhone: string) => {
    onValueChange?.(
      phones.map((phoneItem) =>
        phoneItem.phone === prevPhone
          ? { ...phoneItem, phone: newPhone }
          : phoneItem,
      ),
    );
    setNewPhone('');
    setEditingPhone(null);
  };

  const onPhoneAdd = (phone: string) => {
    if (phones.length === 0) {
      onValueChange?.([{ phone, status: 'unverified', isPrimary: true }]);
    } else {
      onValueChange?.([...phones, { phone, status: 'unverified' }]);
    }
    setNewPhone('');
  };

  return (
    <div ref={ref} className={className} {...props}>
      {showPhoneInput && (
        <div className="px-1 pb-1">
          <PhoneInput
            placeholder={editingPhone ? 'Edit phone' : 'Add phone'}
            defaultCountry="MN"
            value={newPhone}
            onChange={(phone) => {
              setNewPhone(phone);
            }}
            onValidationChange={(isValid) => {
              setIsPhoneValid(isValid);
            }}
            onEnter={(phone) => {
              if (isPhoneValid && editingPhone) {
                onPhoneEdit(phone, editingPhone);
              } else if (isPhoneValid) {
                onPhoneAdd(phone);
              }
            }}
            ref={(el) => {
              inputRef.current = el;
            }}
          />
        </div>
      )}
      <Separator />
      <div className="p-1">
        <Button
          variant="secondary"
          className="w-full"
          disabled={showPhoneInput && !isPhoneValid && newPhone.length > 0}
          onClick={(e) => {
            if (!showPhoneInput) setShowPhoneInput(true);
            else if (isPhoneValid) {
              if (editingPhone) {
                onPhoneEdit(newPhone, editingPhone);
              } else {
                onPhoneAdd(newPhone);
              }
            }
          }}
        >
          <IconPlus />
          {editingPhone ? 'Edit phone' : 'Add phone'}
        </Button>
      </div>
    </div>
  );
});
PhoneForm.displayName = 'PhoneForm';

interface PhoneListFieldProps {
  recordId: string;
  phones: TPhones;
  onValueChange: (phones: TPhones) => void;
  onValidationStatusChange?: (status: 'verified' | 'unverified') => void;
}

const PhoneListFieldRoot = forwardRef<
  HTMLDivElement,
  PhoneListFieldProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      recordId,
      phones,
      onValueChange,
      onValidationStatusChange,
      className,
      ...props
    },
    ref,
  ) => {
    const setPhones = useSetAtom(phonesFamilyState(recordId));
    const setShowPhoneInput = useSetAtom(showPhoneInputFamilyState(recordId));

    useEffect(() => {
      setPhones(phones);
      return () => {
        setShowPhoneInput(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phones, setPhones]);

    return (
      <PhoneField.Provider
        ref={ref}
        recordId={recordId}
        onValueChange={onValueChange}
        onValidationStatusChange={onValidationStatusChange}
        className={className}
        {...props}
      >
        <PhoneListContainer>
          <PhoneList />
        </PhoneListContainer>
        <PhoneForm />
      </PhoneField.Provider>
    );
  },
);
PhoneListFieldRoot.displayName = 'PhoneListFieldRoot';

export const PhonesBadgeDisplay = ({
  phones,
}: {
  phones: TPhones | undefined;
}) => {
  const { recordId } = usePhoneFields();
  const phonesFromAtom = useAtomValue(phonesFamilyState(recordId));

  const phonesToDisplay = phones || phonesFromAtom;

  return (
    <div className="flex gap-2">
      {phonesToDisplay?.map((phone) =>
        phone.phone ? (
          <Badge key={phone.phone} variant="secondary">
            {phone.isPrimary &&
              (phone.status === 'verified' ? (
                <IconCircleDashedCheck className="text-success size-4" />
              ) : (
                <IconCircleDashed className="text-muted-foreground size-4" />
              ))}
            {formatPhoneNumber({ value: phone.phone })}
          </Badge>
        ) : null,
      )}
    </div>
  );
};

export interface PhoneListFieldInlineCellProps {
  recordId: string;
  phones: TPhones;
  onValueChange: (phones: TPhones) => void;
  onValidationStatusChange?: (status: 'verified' | 'unverified') => void;
  scope?: string;
}

const PhoneListFieldInlineCell = forwardRef<
  HTMLDivElement,
  PhoneListFieldInlineCellProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      recordId,
      phones,
      onValueChange,
      onValidationStatusChange,
      className,
      scope,
      ...props
    },
    ref,
  ) => {
    const setPhones = useSetAtom(phonesFamilyState(recordId));
    const setShowPhoneInput = useSetAtom(showPhoneInputFamilyState(recordId));

    useEffect(() => {
      setPhones(phones);
      return () => {
        setShowPhoneInput(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phones, setPhones]);

    return (
      <PhoneFieldsProvider
        ref={ref}
        recordId={recordId}
        onValueChange={onValueChange}
        onValidationStatusChange={onValidationStatusChange}
        className={className}
        {...props}
      >
        <RecordTablePopover scope={scope}>
          <RecordTableCellTrigger>
            <PhonesBadgeDisplay phones={phones} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <PhoneListContainer>
              <PhoneList />
            </PhoneListContainer>
            <PhoneForm />
          </RecordTableCellContent>
        </RecordTablePopover>
      </PhoneFieldsProvider>
    );
  },
);
PhoneListFieldInlineCell.displayName = 'PhoneListFieldInlineCell';

export interface PhoneFieldDetailProps {
  recordId: string;
  phones: TPhones;
  onValueChange: (phones: TPhones) => void;
  onValidationStatusChange?: (status: 'verified' | 'unverified') => void;
  scope?: string;
}

const PhoneField = Object.assign(PhoneListFieldRoot, {
  Provider: PhoneFieldsProvider,
  Container: PhoneListContainer,
  List: PhoneList,
  Item: PhoneItem,
  Options: PhoneOptions,
  Form: PhoneForm,
  BadgeDisplay: PhonesBadgeDisplay,
  InlineCell: PhoneListFieldInlineCell,
});

export { PhoneField };
