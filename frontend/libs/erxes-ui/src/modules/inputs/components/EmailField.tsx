import {
  IconBookmark,
  IconBookmarksFilled,
  IconCircleDashed,
  IconCircleDashedCheck,
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { Button, DropdownMenu, Input, Separator } from 'erxes-ui/components';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  emailsFamilyState,
  showEmailInputFamilyState,
} from '../states/emailFieldStates';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { cn } from 'erxes-ui/lib';

export interface IEmailField {
  email?: string;
  status?: 'verified' | 'unverified';
  isPrimary?: boolean;
}

export type TEmails = IEmailField[];

export const EmailFieldsContext = createContext<{ recordId: string }>({
  recordId: '',
});
export const EmailFieldsProvider = ({
  children,
  recordId,
}: {
  children: React.ReactNode;
  recordId: string;
}) => {
  return (
    <EmailFieldsContext.Provider value={{ recordId }}>
      {children}
    </EmailFieldsContext.Provider>
  );
};

export const useEmailFields = () => {
  const { recordId } = useContext(EmailFieldsContext);
  return { recordId };
};

export const EmailListField = ({
  recordId,
  emails,
}: {
  recordId: string;
  emails: TEmails;
}) => {
  const setEmails = useSetAtom(emailsFamilyState(recordId));

  useEffect(() => {
    const filterDuplicateEmails = emails.filter(
      (email, index, self) =>
        index === self.findIndex((t) => t.email === email.email),
    );
    setEmails(filterDuplicateEmails);
  }, [emails, setEmails]);

  return (
    <EmailFieldsProvider recordId={recordId}>
      <div className="p-1 space-y-1">
        <EmailList />
        <AddEmailInput />
      </div>
      <Separator />
      <div className="p-1">
        <AddEmailButton />
      </div>
    </EmailFieldsProvider>
  );
};

export const AddEmailInput = () => {
  const { recordId } = useEmailFields();
  const showEmailInput = useAtomValue(showEmailInputFamilyState(recordId));
  const [email, setEmail] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showEmailInput) {
      setEmail('');
      inputRef.current?.focus();
    }
  }, [showEmailInput]);

  if (!showEmailInput) return null;

  return (
    <Input
      placeholder="Add email"
      variant="secondary"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      ref={inputRef}
    />
  );
};

export const AddEmailButton = () => {
  const { recordId } = useEmailFields();
  const setShowEmailInput = useSetAtom(showEmailInputFamilyState(recordId));
  return (
    <Button
      variant="secondary"
      className="w-full"
      onClick={() => setShowEmailInput(true)}
    >
      <IconPlus />
      Add email
    </Button>
  );
};

const EmailList = () => {
  const { recordId } = useEmailFields();
  const emails = useAtomValue(emailsFamilyState(recordId));
  const [animationParent] = useAutoAnimate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div ref={mounted ? animationParent : null} className="space-y-1">
      {emails.map((email) => (
        <div
          className="grid grid-cols-[1fr_auto] gap-1 w-full"
          key={email.email}
        >
          <EmailField {...email} />
          <EmailOptions {...email} />
        </div>
      ))}
    </div>
  );
};

const EmailField = ({ email, status, isPrimary }: IEmailField) => {
  return (
    <Button
      variant="secondary"
      className={cn(
        'w-full font-medium text-left justify-start px-2',
        isPrimary && 'text-primary',
      )}
      size="lg"
    >
      {status === 'verified' ? (
        <IconCircleDashedCheck className="text-success" />
      ) : (
        <IconCircleDashed className="text-muted-foreground" />
      )}
      {email}
    </Button>
  );
};

const EmailOptions = ({
  email,
  status,
  isPrimary,
}: IEmailField & { isPrimary?: boolean }) => {
  const { recordId } = useEmailFields();
  const [emails, setEmails] = useAtom(emailsFamilyState(recordId));

  const handleSetPrimaryEmail = () => {
    if (isPrimary) return;
    setEmails([
      { email, status, isPrimary: true },
      ...(emails || [])
        .filter((e) => e.email !== email)
        .map((e) => ({ ...e, isPrimary: false })),
    ]);
  };
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          className="w-full font-medium size-8"
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
            <IconBookmarksFilled className="text-success" />
          ) : (
            <IconBookmark />
          )}
          {isPrimary ? 'Primary email' : 'Set as primary email'}
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <IconEdit />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup>
          <DropdownMenu.RadioItem value="verified">
            <IconCircleDashedCheck className="text-success" />
            Verified
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="unverified">
            <IconCircleDashed className="text-muted-foreground" />
            Unverified
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="text-destructive">
          <IconTrash />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
