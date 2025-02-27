import React, {
  useRef,
  useState,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { ValidationDisplay } from 'erxes-ui/display';
import {
  IconEdit,
  IconTrash,
  IconDots,
  IconBookmark,
  IconPlus,
  IconPencil,
  IconCheck,
} from '@tabler/icons-react';
import { Popover, Command, Button } from 'erxes-ui/components';
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
import {
  PHONE_VALIDATION_STATUS_INFOS,
  PhoneIconComponents,
} from 'erxes-ui/constants/PhoneValidationStatusInfos';

type PhoneContextType = {
  recordId: string;
  allPhones: string[];
  newPhone: string;
  editingPhone: string | null;
  isAddingPhone: boolean;
  phoneValidationStatus?: string;
  defaultCountryCode: CountryCode;
  inputRef: React.RefObject<HTMLInputElement>;
  setNewPhone: (phone: string) => void;
  setIsAddingPhone: (isAdding: boolean) => void;
  setEditingPhone: (phone: string | null) => void;
  handleDelete: (phone: string) => void;
  handleSetPrimary: (phone: string) => void;
  handleEdit: (phone: string) => void;
  handleAddNewPhone: () => void;
  handleEditSubmit: () => void;
  handleValidationStatusChange: (status: string) => void;
  handleEscape: (closeEditMode: () => void) => void;
};

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);
const usePhoneContext = () => {
  const context = useContext(PhoneContext);
  if (!context) {
    throw new Error(
      'usePhoneContext must be used within a PhoneContextProvider',
    );
  }
  return context;
};

type PhoneContextProviderProps = {
  children: ReactNode;
  recordId: string;
  primaryPhone: string | undefined;
  phones: string[];
  phoneValidationStatus?: string;
  defaultCountryCode: CountryCode;
  onChange: (
    primaryPhone: string,
    phones: string[],
    onCompleted: () => void,
  ) => void;
  onValidationStatusSelect?: (phoneValidationStatus: string) => void;
};

const PhoneContextProvider: React.FC<PhoneContextProviderProps> = ({
  children,
  recordId,
  primaryPhone,
  phones,
  phoneValidationStatus: initialValidationStatus,
  defaultCountryCode,
  onChange,
  onValidationStatusSelect,
}) => {
  const [newPhone, setNewPhone] = useState<string>('');
  const [editingPhone, setEditingPhone] = useState<string | null>(null);
  const [allPhones, setAllPhones] = useState<string[]>([
    ...(primaryPhone ? [primaryPhone] : []),
    ...phones.filter((phone) => phone !== primaryPhone),
  ]);
  const [isAddingPhone, setIsAddingPhone] = useState<boolean>(
    allPhones.length === 0,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentValidationStatus, setCurrentValidationStatus] = useState(
    initialValidationStatus,
  );

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneNumber = parsePhoneNumberFromString(phone);
    return phoneNumber ? phoneNumber.isPossible() : false;
  };

  const handleEscape = (closeEditMode: () => void) => {
    if (editingPhone) {
      setEditingPhone(null);
      setNewPhone('');
    }
    if (isAddingPhone) {
      setIsAddingPhone(false);
      setNewPhone('');
    }
    if (!isAddingPhone && !editingPhone) {
      closeEditMode();
      setNewPhone('');
      setIsAddingPhone(false);
      setEditingPhone(null);
    }
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

  const handleValidationStatusChange = (status: string) => {
    setCurrentValidationStatus(status);
    if (onValidationStatusSelect) {
      onValidationStatusSelect(status);
    }
  };

  const contextValue: PhoneContextType = {
    recordId,
    allPhones,
    newPhone,
    editingPhone,
    isAddingPhone,
    phoneValidationStatus: currentValidationStatus,
    defaultCountryCode,
    inputRef,
    setNewPhone,
    setIsAddingPhone,
    setEditingPhone,
    handleDelete,
    handleSetPrimary,
    handleEdit,
    handleAddNewPhone,
    handleEditSubmit,
    handleValidationStatusChange,
    handleEscape,
  };

  return (
    <PhoneContext.Provider value={contextValue}>
      {children}
    </PhoneContext.Provider>
  );
};

export const Phone = React.forwardRef<
  React.ElementRef<typeof Button>,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onChange'> & {
    recordId: string;
    primaryPhone: string | undefined;
    phones: string[];
    phoneValidationStatus?: string;
    fieldId?: string;
    defaultCountryCode?: CountryCode;
    onValidationStatusSelect?: (phoneValidationStatus: string) => void;
    onChange: (
      primaryPhone: string,
      phones: string[],
      onCompleted: () => void,
    ) => void;
  }
>(
  (
    {
      recordId,
      primaryPhone,
      phones,
      onChange,
      phoneValidationStatus,
      defaultCountryCode = 'MN',
      onValidationStatusSelect,
      ...props
    },
    ref,
  ) => {
    return (
      <PhoneContextProvider
        recordId={recordId}
        primaryPhone={primaryPhone}
        phones={phones}
        phoneValidationStatus={phoneValidationStatus}
        defaultCountryCode={defaultCountryCode}
        onChange={onChange}
        onValidationStatusSelect={onValidationStatusSelect}
      >
        <PhoneComponent ref={ref} {...props} />
      </PhoneContextProvider>
    );
  },
);

const PhoneComponent = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  const {
    recordId,
    handleEscape,
    handleEditSubmit,
    handleAddNewPhone,
    editingPhone,
  } = usePhoneContext();

  return (
    <InlineCell
      name="phone"
      recordId={recordId}
      onEnter={editingPhone ? handleEditSubmit : handleAddNewPhone}
      onEscape={handleEscape}
      onCancel={handleEscape}
      display={() => <PhoneListDisplay ref={ref} {...props} />}
      edit={() => (
        <InlineCellEdit className="w-56 p-1">
          <PhoneItems>
            <PhoneMutate />
          </PhoneItems>
        </InlineCellEdit>
      )}
    />
  );
});

const PhoneListDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  const { allPhones, phoneValidationStatus } = usePhoneContext();

  return (
    <InlineCellDisplay className="w-full h-cell" ref={ref} asChild {...props}>
      <div className="w-full relative h-cell group">
        {allPhones.map((phone, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-min hover:bg-border"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {phoneValidationStatus && (
              <ValidationDisplay
                value={index === 0 ? phoneValidationStatus : 'unknown'}
                validationInfos={PHONE_VALIDATION_STATUS_INFOS}
              />
            )}
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
  );
});

const PhoneActionPopover: React.FC<{
  phone: string;
  isPrimary: boolean;
  index: number;
}> = ({ phone, isPrimary, index }) => {
  const {
    handleDelete,
    handleSetPrimary,
    handleEdit,
    editingPhone,
    phoneValidationStatus,
  } = usePhoneContext();

  const triggerButtonRef = useRef<React.ElementRef<typeof Button>>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setTimeout(() => {
      triggerButtonRef?.current?.focus();
    }, 0);
  };
  return (
    <Popover onOpenChange={handleOpenChange} open={open} modal>
      <Popover.Trigger asChild>
        <Button
          ref={triggerButtonRef}
          variant="ghost"
          size="icon"
          className={cn(
            'absolute disabled:opacity-0 right-1 opacity-0 group-hover:opacity-100 hover:bg-border flex items-center justify-center transition-opacity size-5 px-0',
            open && 'opacity-100 bg-border z-20',
          )}
          disabled={Boolean(editingPhone)}
        >
          <IconDots className="text-muted-foreground size-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="bg-background shadow-lg p-0 w-56"
        align="end"
        alignOffset={10}
      >
        <Command>
          <Command.List className="text-base font-medium">
            <Command.Group className="m-1 p-0">
              {!isPrimary && (
                <Command.Item className="h-cell" asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      handleSetPrimary(phone);
                      setOpen(false);
                    }}
                  >
                    <IconBookmark className="w-4 h-4 " />
                    Set as primary phone
                  </Button>
                </Command.Item>
              )}
              <Command.Item className="h-cell" asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 "
                  onClick={() => {
                    handleEdit(phone);
                    setOpen(false);
                  }}
                >
                  <IconEdit className="w-4 h-4 " />
                  Edit
                </Button>
              </Command.Item>
            </Command.Group>
            {phoneValidationStatus && (
              <>
                <Command.Separator />
                <Command.Group className="m-1 p-0">
                  <PhoneValidationStatusSelect index={index} />
                </Command.Group>
              </>
            )}
            <Command.Separator />
            <Command.Item className="h-cell m-1" asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => {
                  handleDelete(phone);
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

const PhoneMutate: React.FC = () => {
  const {
    isAddingPhone,
    editingPhone,
    newPhone,
    inputRef,
    setNewPhone,
    setIsAddingPhone,
    defaultCountryCode,
  } = usePhoneContext();

  const onAddClick = () => {
    setIsAddingPhone(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Command.Item className="h-cell text-xs items-center justify-start flex p-0">
      {isAddingPhone || editingPhone ? (
        <PhoneInput
          className="w-full m-1"
          ref={inputRef}
          value={newPhone}
          onChange={(value) => setNewPhone(value)}
          defaultCountry={defaultCountryCode}
          placeholder={
            editingPhone ? 'Edit phone number' : 'Add new phone number'
          }
        />
      ) : (
        <Button
          variant="ghost"
          className="flex gap-1 hover:bg-transparent justify-start w-full h-full focus-visible:ring-0 text-sm"
          onClick={onAddClick}
        >
          <IconPlus />
          Add Phone Number
        </Button>
      )}
    </Command.Item>
  );
};

const PhoneItems: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { allPhones } = usePhoneContext();

  return (
    <Command>
      <Command.List className="max-h-[300px] overflow-y-auto">
        {allPhones.map((phone, index) => (
          <PhoneItem key={index} phone={phone} index={index} />
        ))}
        {allPhones.length > 0 && <Command.Separator className="my-1" />}
        {children}
      </Command.List>
    </Command>
  );
};

const PhoneItem: React.FC<{ phone: string; index: number }> = ({
  phone,
  index,
}) => {
  const { phoneValidationStatus } = usePhoneContext();

  return (
    <Command.Item className="group relative flex items-center h-cell text-xs">
      {phoneValidationStatus && (
        <ValidationDisplay
          value={index === 0 ? phoneValidationStatus : 'unknown'}
          validationInfos={PHONE_VALIDATION_STATUS_INFOS}
        />
      )}
      <span className={cn('relative truncate max-w-[180px]')}>
        <span className="relative z-10 hover:cursor-pointer text-base font-medium ">
          {formatIncompletePhoneNumber(phone || '')}
        </span>
        <span className="absolute bottom-0 left-0 w-full h-px bg-transparent group-hover:bg-muted-foreground" />
      </span>

      {index === 0 && (
        <IconBookmark className="text-muted-foreground absolute right-2 h-[15px] w-[15px] group-hover:hidden" />
      )}
      <PhoneActionPopover phone={phone} isPrimary={index === 0} index={index} />
    </Command.Item>
  );
};

const PhoneValidationStatusSelect: React.FC<{ index: number }> = ({
  index,
}) => {
  const { phoneValidationStatus, handleValidationStatusChange } =
    usePhoneContext();

  return (
    <>
      {PHONE_VALIDATION_STATUS_INFOS.map((info) => {
        const ItemIcon = PhoneIconComponents[info.icon];
        return (
          <Command.Item
            key={info.value}
            value={info.value}
            className={cn('h-cell relative hover:cursor-pointer')}
            asChild
          >
            <Button
              variant={'outline'}
              className="w-full h-cell m-0 px-2 shadow-none "
              onClick={() => {
                if (index === 0) {
                  handleValidationStatusChange(info.value);
                }
              }}
            >
              <div className="flex flex-row items-center w-full gap-2 ">
                <ItemIcon className={cn(info.className)} size={16} />
                <span>{info.label}</span>
              </div>
              {phoneValidationStatus === info.value && (
                <IconCheck
                  className="text-primary absolute right-2"
                  size={16}
                />
              )}
            </Button>
          </Command.Item>
        );
      })}
    </>
  );
};
