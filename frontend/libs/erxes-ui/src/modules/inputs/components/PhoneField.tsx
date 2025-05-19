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
import { useEffect, useRef, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { cn } from 'erxes-ui/lib';
import { usePhoneFields } from '../hooks/usePhoneFields';
import { PhoneFieldsContext } from '../contexts/PhoneFieldsContext';

export interface IPhoneField {
  phone?: string;
  status?: 'verified' | 'unverified';
  isPrimary?: boolean;
}

export type TPhones = IPhoneField[];

export const PhoneFieldsProvider = ({
  children,
  recordId,
  onValueChange,
}: {
  children: React.ReactNode;
  recordId: string;
  onValueChange: (phones: TPhones) => void;
}) => {
  return (
    <PhoneFieldsContext.Provider value={{ recordId, onValueChange }}>
      {children}
    </PhoneFieldsContext.Provider>
  );
};

export const PhoneListField = ({
  recordId,
  phones,
  onValueChange,
}: {
  recordId: string;
  phones: TPhones;
  onValueChange: (phones: TPhones) => void;
}) => {
  const setPhones = useSetAtom(phonesFamilyState(recordId));
  const setShowPhoneInput = useSetAtom(showPhoneInputFamilyState(recordId));

  useEffect(() => {
    setPhones(phones);
    return () => {
      setShowPhoneInput(false);
    };
  }, [phones, setPhones]);

  return (
    <PhoneFieldsProvider recordId={recordId} onValueChange={onValueChange}>
      <div className="p-1 space-y-1">
        <PhoneList />
      </div>
      <PhoneForm />
    </PhoneFieldsProvider>
  );
};

const PhoneList = () => {
  const { recordId } = usePhoneFields();
  const phones = useAtomValue(phonesFamilyState(recordId));
  const [animationParent] = useAutoAnimate();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);
  return (
    <div ref={mounted.current ? animationParent : null} className="space-y-1">
      {phones.map(
        (phone) =>
          phone.phone && (
            <div
              className="flex items-center overflow-hidden gap-1 w-full"
              key={phone.phone}
            >
              <PhoneField {...phone} />
              <PhoneOptions {...phone} />
            </div>
          ),
      )}
    </div>
  );
};

const PhoneField = ({ phone, status, isPrimary }: IPhoneField) => {
  return (
    <Button
      variant="secondary"
      className={cn(
        'w-full font-medium text-left justify-start px-2 flex-auto overflow-hidden',
        isPrimary && 'text-primary bg-primary/10 hover:bg-primary/20',
      )}
      size="lg"
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
};

const PhoneOptions = ({
  phone,
  status,
  isPrimary,
}: IPhoneField & { isPrimary?: boolean }) => {
  const { recordId, onValueChange } = usePhoneFields();
  const [phones, setPhones] = useAtom(phonesFamilyState(recordId));
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
    onValueChange?.(
      phones.map((e) => {
        if (e.phone === phone) {
          return { ...e, status: value as 'verified' | 'unverified' };
        }
        return e;
      }),
    );
  };
  const handleDeleteClick = () => {
    onValueChange?.(phones.filter((e) => e.phone !== phone));
  };
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          className="w-full font-medium size-8 flex-shrink-0"
          size="icon"
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
};

const PhoneForm = () => {
  const { recordId } = usePhoneFields();
  const phones = useAtomValue(phonesFamilyState(recordId));
  const [newPhone, setNewPhone] = useState<string>('');
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
    <>
      {showPhoneInput && (
        <div className="px-1 pb-1">
          <PhoneInput
            placeholder={editingPhone ? 'Edit phone' : 'Add phone'}
            defaultCountry="MN"
            value={newPhone}
            onChange={(phone) => {
              setNewPhone(phone);
            }}
            onEnter={(phone) => {
              if (editingPhone) {
                onPhoneEdit(phone, editingPhone);
              } else {
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
          onClick={(e) => {
            if (!showPhoneInput) setShowPhoneInput(true);
            else {
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
    </>
  );
};
