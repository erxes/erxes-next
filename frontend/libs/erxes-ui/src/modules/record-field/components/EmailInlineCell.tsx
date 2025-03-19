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
import { Popover, Command, Button, Input } from 'erxes-ui/components';
import { z } from 'zod';
import { InlineCell } from 'erxes-ui/modules/inline-cell/components/InlineCell';
import { InlineCellDisplay } from 'erxes-ui/modules/inline-cell/components/InlineCellDisplay';
import { InlineCellEdit } from 'erxes-ui/modules/inline-cell/components/InlineCellEdit';
import { cn } from 'erxes-ui/lib';
import {
  EMAIL_VALIDATION_STATUS_INFOS,
  EmailIconComponents,
} from 'erxes-ui/constants/EmailValidationStatusInfos';

const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

type EmailContextType = {
  recordId: string;
  allEmails: string[];
  newEmail: string;
  editingEmail: string | null;
  isAddingEmail: boolean;
  emailValidationStatus?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  setNewEmail: (email: string) => void;
  setIsAddingEmail: (isAdding: boolean) => void;
  setEditingEmail: (email: string | null) => void;
  handleDelete: (email: string) => void;
  handleSetPrimary: (email: string) => void;
  handleEdit: (email: string) => void;
  handleAddNewEmail: () => void;
  handleEditSubmit: () => void;
  handleValidationStatusChange: (status: string) => void;
  handleEscape: (closeEditMode: () => void) => void;
};

const EmailContext = createContext<EmailContextType | undefined>(undefined);
const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error(
      'useEmailContext must be used within an EmailContextProvider',
    );
  }
  return context;
};
type EmailContextProviderProps = {
  children: ReactNode;
  recordId: string;
  primaryEmail: string | undefined;
  emails: string[];
  emailValidationStatus?: string;
  onChange: (
    primaryEmail: string,
    emails: string[],
    onCompleted: () => void,
  ) => void;
  onValidationStatusSelect?: (emailValidationStatus: string) => void;
};

const EmailContextProvider: React.FC<EmailContextProviderProps> = ({
  children,
  recordId,
  primaryEmail,
  emails,
  emailValidationStatus: initialValidationStatus,
  onChange,
  onValidationStatusSelect,
}) => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [allEmails, setAllEmails] = useState<string[]>([
    ...(primaryEmail ? [primaryEmail] : []),
    ...emails.filter((email) => email !== primaryEmail),
  ]);
  const [isAddingEmail, setIsAddingEmail] = useState<boolean>(
    allEmails.length === 0,
  );
  const inputRef = useRef<React.ElementRef<typeof Input>>(null);
  const [currentValidationStatus, setCurrentValidationStatus] = useState(
    initialValidationStatus,
  );

  const handleEscape = (closeEditMode: () => void) => {
    if (editingEmail) {
      setEditingEmail(null);
      setNewEmail('');
    }
    if (isAddingEmail) {
      setIsAddingEmail(false);
      setNewEmail('');
    }
    if (!isAddingEmail && !editingEmail) {
      closeEditMode();
      setNewEmail('');
      setIsAddingEmail(false);
      setEditingEmail(null);
    }
  };

  const handleChange = (updatedEmails: string[]) => {
    const [newPrimaryEmail, ...restEmails] = updatedEmails;
    onChange(newPrimaryEmail || '', restEmails, () =>
      setAllEmails(updatedEmails),
    );
  };

  const handleDelete = (emailToDelete: string) => {
    const updatedEmails = allEmails.filter((e) => e !== emailToDelete);
    handleChange(updatedEmails);
  };

  const handleSetPrimary = (emailToSetPrimary: string) => {
    const remainingEmails = allEmails.filter((e) => e !== emailToSetPrimary);
    const updatedEmails = [emailToSetPrimary, ...remainingEmails];
    handleChange(updatedEmails);
  };

  const handleAddNewEmail = () => {
    if (newEmail && !allEmails.includes(newEmail)) {
      const validation = emailSchema.safeParse({ email: newEmail });
      if (validation.success) {
        const updatedEmails = [...allEmails, newEmail];
        handleChange(updatedEmails);
        setNewEmail('');
        setIsAddingEmail(false);
      }
    }
  };

  const handleEdit = (emailToEdit: string) => {
    setEditingEmail(emailToEdit);
    setNewEmail(emailToEdit);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleEditSubmit = () => {
    if (
      editingEmail &&
      newEmail.trim() &&
      !allEmails.includes(newEmail.trim())
    ) {
      const validation = emailSchema.safeParse({ email: newEmail });
      if (validation.success) {
        const updatedEmails = allEmails.map((email) =>
          email === editingEmail ? newEmail : email,
        );
        handleChange(updatedEmails);
        setNewEmail('');
        setEditingEmail(null);
      }
    }
  };

  const handleValidationStatusChange = (status: string) => {
    setCurrentValidationStatus(status);
    if (onValidationStatusSelect) {
      onValidationStatusSelect(status);
    }
  };

  const contextValue: EmailContextType = {
    recordId,
    allEmails,
    newEmail,
    editingEmail,
    isAddingEmail,
    emailValidationStatus: currentValidationStatus,
    inputRef,
    setNewEmail,
    setIsAddingEmail,
    setEditingEmail,
    handleDelete,
    handleSetPrimary,
    handleEdit,
    handleAddNewEmail,
    handleEditSubmit,
    handleValidationStatusChange,
    handleEscape,
  };

  return (
    <EmailContext.Provider value={contextValue}>
      {children}
    </EmailContext.Provider>
  );
};

export const Email = React.forwardRef<
  React.ElementRef<typeof Button>,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onChange'> & {
    recordId: string;
    primaryEmail: string | undefined;
    emails: string[];
    emailValidationStatus?: string;
    fieldId?: string;
    onValidationStatusSelect?: (emailValidationStatus: string) => void;
    onChange: (
      primaryEmail: string,
      emails: string[],
      onCompleted: () => void,
    ) => void;
  }
>(
  (
    {
      recordId,
      primaryEmail,
      emails,
      onChange,
      emailValidationStatus,
      onValidationStatusSelect,
      ...props
    },
    ref,
  ) => {
    return (
      <EmailContextProvider
        recordId={recordId}
        primaryEmail={primaryEmail}
        emails={emails}
        emailValidationStatus={emailValidationStatus}
        onChange={onChange}
        onValidationStatusSelect={onValidationStatusSelect}
      >
        <EmailComponent ref={ref} {...props} />
      </EmailContextProvider>
    );
  },
);

const EmailComponent = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  const {
    recordId,
    handleEscape,
    handleEditSubmit,
    handleAddNewEmail,
    editingEmail,
  } = useEmailContext();

  return (
    <InlineCell
      name="email"
      recordId={recordId}
      onEnter={editingEmail ? handleEditSubmit : handleAddNewEmail}
      onEscape={handleEscape}
      onCancel={handleEscape}
      display={() => <EmailListDisplay ref={ref} {...props} />}
      edit={() => (
        <InlineCellEdit className="w-56 p-1">
          <EmailItems>
            <EmailMutate />
          </EmailItems>
        </InlineCellEdit>
      )}
    />
  );
});

const EmailListDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  const { allEmails, emailValidationStatus } = useEmailContext();

  return (
    <InlineCellDisplay className="w-full h-cell" ref={ref} asChild {...props}>
      <div className="w-full relative h-cell group">
        {allEmails.map((email, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-min hover:bg-border"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {emailValidationStatus && (
              <ValidationDisplay
                value={index === 0 ? emailValidationStatus : 'unknown'}
                validationInfos={EMAIL_VALIDATION_STATUS_INFOS}
              />
            )}
            {email}
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

const EmailActionPopover: React.FC<{
  email: string;
  isPrimary: boolean;
  index: number;
}> = ({ email, isPrimary, index }) => {
  const {
    handleDelete,
    handleSetPrimary,
    handleEdit,
    editingEmail,
    emailValidationStatus,
  } = useEmailContext();

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
          disabled={Boolean(editingEmail)}
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
                      handleSetPrimary(email);
                      setOpen(false);
                    }}
                  >
                    <IconBookmark className="w-4 h-4 " />
                    Set as primary email
                  </Button>
                </Command.Item>
              )}
              <Command.Item className="h-cell" asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 "
                  onClick={() => {
                    handleEdit(email);
                    setOpen(false);
                  }}
                >
                  <IconEdit className="w-4 h-4 " />
                  Edit
                </Button>
              </Command.Item>
            </Command.Group>
            {emailValidationStatus && (
              <>
                <Command.Separator />
                <Command.Group className="m-1 p-0">
                  <EmailValidationStatusSelect index={index} />
                </Command.Group>{' '}
              </>
            )}
            <Command.Separator />
            <Command.Item className="h-cell m-1" asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => {
                  handleDelete(email);
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

const EmailMutate: React.FC = () => {
  const {
    isAddingEmail,
    editingEmail,
    newEmail,
    inputRef,
    setNewEmail,
    setIsAddingEmail,
  } = useEmailContext();

  const onAddClick = () => {
    setIsAddingEmail(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Command.Item className="h-cell text-xs items-center justify-start flex p-0">
      {isAddingEmail || editingEmail ? (
        <Input
          className="h-7 mb-px w-full mx-1"
          ref={inputRef}
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder={editingEmail ? 'Edit email' : 'Add new email'}
        />
      ) : (
        <Button
          variant="ghost"
          className="flex gap-1 hover:bg-transparent justify-start w-full h-full focus-visible:ring-0 text-sm"
          onClick={onAddClick}
        >
          <IconPlus />
          Add Email
        </Button>
      )}
    </Command.Item>
  );
};

const EmailItems: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { allEmails } = useEmailContext();

  return (
    <Command>
      <Command.List className="max-h-[300px] overflow-y-auto">
        {allEmails.map((email, index) => (
          <EmailItem key={index} email={email} index={index} />
        ))}
        {allEmails.length > 0 && <Command.Separator className="my-1" />}
        {children}
      </Command.List>
    </Command>
  );
};

const EmailItem: React.FC<{ email: string; index: number }> = ({
  email,
  index,
}) => {
  const { emailValidationStatus } = useEmailContext();

  return (
    <Command.Item className="group relative flex items-center h-cell text-xs">
      {emailValidationStatus && (
        <ValidationDisplay
          value={index === 0 ? emailValidationStatus : 'unknown'}
          validationInfos={EMAIL_VALIDATION_STATUS_INFOS}
        />
      )}
      <span className="relative truncate max-w-[180px]">
        <span className="relative z-10 hover:cursor-pointer text-base font-medium ">
          {email}
        </span>
        <span className="absolute bottom-0 left-0 w-full h-px bg-transparent group-hover:bg-muted-foreground" />
      </span>

      {index === 0 && (
        <IconBookmark className="text-muted-foreground absolute right-2 h-[15px] w-[15px] group-hover:hidden" />
      )}
      <EmailActionPopover email={email} isPrimary={index === 0} index={index} />
    </Command.Item>
  );
};

const EmailValidationStatusSelect: React.FC<{ index: number }> = ({
  index,
}) => {
  const { emailValidationStatus, handleValidationStatusChange } =
    useEmailContext();

  return (
    <>
      {EMAIL_VALIDATION_STATUS_INFOS.map((info) => {
        const ItemIcon = EmailIconComponents[info.icon];
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
              {emailValidationStatus === info.value && (
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
