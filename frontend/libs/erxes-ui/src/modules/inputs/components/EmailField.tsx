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
import {
  Button,
  DropdownMenu,
  Input,
  Separator,
  TextOverflowTooltip,
  Form,
} from 'erxes-ui/components';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import {
  emailsFamilyState,
  showEmailInputFamilyState,
  editingEmailFamilyState,
} from '../states/emailFieldStates';
import { useEffect, useRef } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { cn } from 'erxes-ui/lib';
import { useEmailFields } from '../hooks/useEmailFields';
import { EmailFieldsContext } from '../contexts/EmailFieldsContext';
import { emailSchema } from '../validations/emailValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export interface IEmailField {
  email?: string;
  status?: 'verified' | 'unverified';
  isPrimary?: boolean;
}

export type TEmails = IEmailField[];

export const EmailFieldsProvider = ({
  children,
  recordId,
  onValueChange,
  noValidation,
}: {
  children: React.ReactNode;
  recordId: string;
  onValueChange: (emails: TEmails) => void;
  noValidation?: boolean;
}) => {
  return (
    <EmailFieldsContext.Provider value={{ recordId, onValueChange, noValidation }}>
      {children}
    </EmailFieldsContext.Provider>
  );
};

export const EmailListField = ({
  recordId,
  emails,
  onValueChange,
  noValidation,
}: {
  recordId: string;
  emails: TEmails;
  onValueChange: (emails: TEmails) => void;
  noValidation?: boolean;
}) => {
  const setEmails = useSetAtom(emailsFamilyState(recordId));
  const setShowEmailInput = useSetAtom(showEmailInputFamilyState(recordId));
  useEffect(() => {
    setEmails(emails);
    return () => {
      setShowEmailInput(false);
    };
  }, [emails, setEmails]);
  return (
    <EmailFieldsProvider recordId={recordId} onValueChange={onValueChange} noValidation={noValidation}>
      <div className="p-1 space-y-1">
        <EmailList />
      </div>
      <EmailForm />
    </EmailFieldsProvider>
  );
};

const EmailList = () => {
  const { recordId } = useEmailFields();
  const emails = useAtomValue(emailsFamilyState(recordId));
  const [animationParent] = useAutoAnimate();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);
  return (
    <div ref={mounted.current ? animationParent : null} className="space-y-1">
      {emails.map(
        (email) =>
          email.email && (
            <div
              className="flex items-center overflow-hidden gap-1 w-full"
              key={email.email}
            >
              <EmailField {...email} />
              <EmailOptions {...email} />
            </div>
          ),
      )}
    </div>
  );
};

const EmailField = ({ email, status, isPrimary }: IEmailField) => {
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
      <TextOverflowTooltip value={email} />
      {isPrimary && <IconBookmarkFilled className="text-primary" />}
    </Button>
  );
};

const EmailOptions = ({
  email,
  status,
  isPrimary,
}: IEmailField & { isPrimary?: boolean }) => {
  const { recordId, onValueChange, noValidation } = useEmailFields();
  const [emails, setEmails] = useAtom(emailsFamilyState(recordId));
  const setEditingEmail = useSetAtom(editingEmailFamilyState(recordId));
  const setShowEmailInput = useSetAtom(showEmailInputFamilyState(recordId));
  const handleSetPrimaryEmail = () => {
    if (isPrimary) return;
    onValueChange?.([
      { email, status, isPrimary: true },
      ...(emails || [])
        .filter((e) => e.email !== email)
        .map((e) => ({ ...e, isPrimary: false })),
    ]);
  };
  const handleEditClick = () => {
    setShowEmailInput(true);
    setEditingEmail(email || null);
  };

  const handleVerificationChange = (value: string) => {
    onValueChange?.(
      emails.map((e) => {
        if (e.email === email) {
          return { ...e, status: value as 'verified' | 'unverified' };
        }
        return e;
      }),
    );
  };
  const handleDeleteClick = () => {
    onValueChange?.(emails.filter((e) => e.email !== email));
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
        <DropdownMenu.Item onClick={handleSetPrimaryEmail}>
          {isPrimary ? (
            <IconBookmarkFilled className="text-primary" />
          ) : (
            <IconBookmark />
          )}
          {isPrimary ? 'Primary email' : 'Set as primary email'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleEditClick}>
          <IconEdit />
          Edit
        </DropdownMenu.Item>

        {isPrimary && !noValidation && (
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

const EmailForm = () => {
  const { recordId } = useEmailFields();
  const emails = useAtomValue(emailsFamilyState(recordId));
  const [editingEmail, setEditingEmail] = useAtom(
    editingEmailFamilyState(recordId),
  );
  const { onValueChange } = useEmailFields();
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });
  const [showEmailInput, setShowEmailInput] = useAtom(
    showEmailInputFamilyState(recordId),
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!showEmailInput) return;
    setTimeout(() => {
      inputRef.current?.focus();
    }, 180);
    if (editingEmail) {
      form.setValue('email', editingEmail);
    }
  }, [showEmailInput, editingEmail]);

  useEffect(() => {
    if (emails.filter((email) => !!email.email).length === 0) {
      setShowEmailInput(true);
      setTimeout(() => {
        inputRef.current?.focus();
      });
    } else {
      setShowEmailInput(false);
    }
  }, [emails, setShowEmailInput]);
  const onEmailEdit = (newEmail: string, prevEmail: string) => {
    onValueChange?.(
      emails.map((emailItem) =>
        emailItem.email === prevEmail
          ? { ...emailItem, email: newEmail }
          : emailItem,
      ),
    );
    form.reset();
    setEditingEmail(null);
  };
  const onEmailAdd = (email: string) => {
    if (emails.length === 0) {
      onValueChange?.([{ email, status: 'unverified', isPrimary: true }]);
    } else {
      onValueChange?.([...emails, { email, status: 'unverified' }]);
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ email }) => {
          if (!!editingEmail) {
            onEmailEdit(email, editingEmail);
          } else {
            onEmailAdd(email);
          }
        })}
      >
        {showEmailInput && (
          <Form.Field
            name="email"
            control={form.control}
            render={({ field }) => (
              <div className="px-1 pb-1">
                <Input
                  placeholder={!!editingEmail ? 'Edit email' : 'Add email'}
                  variant="secondary"
                  className={cn(
                    form.formState.errors.email &&
                      'focus-visible:shadow-destructive',
                  )}
                  {...field}
                  ref={(el) => {
                    field.ref(el);
                    inputRef.current = el;
                  }}
                />
              </div>
            )}
          />
        )}
        <Separator />
        <div className="p-1">
          <Button
            variant="secondary"
            className="w-full"
            type="submit"
            onClick={(e) => {
              if (!showEmailInput) {
                e.preventDefault();
              }
              setShowEmailInput(true);
            }}
          >
            <IconPlus />
            {!!editingEmail ? 'Edit email' : 'Add email'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
