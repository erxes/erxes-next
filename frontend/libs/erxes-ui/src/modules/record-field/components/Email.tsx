import React, { useRef, useState } from 'react';
import { IconBookmarkPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { Popover, Command, Button, Input } from 'erxes-ui/components';
import { IconDotsVertical } from '@tabler/icons-react';
import { z } from 'zod';
import { InlineCell } from 'erxes-ui/modules/inline-cell/components/InlineCell';
import { InlineCellDisplay } from 'erxes-ui/modules/inline-cell/components/InlineCellDisplay';
import { InlineCellEdit } from 'erxes-ui/modules/inline-cell/components/InlineCellEdit';
import { IconBookmark, IconPlus } from '@tabler/icons-react';
import { cn } from 'erxes-ui/lib';

const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const Email = React.forwardRef<
  React.ElementRef<typeof Button>,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onChange'> & {
    recordId: string;
    primaryEmail: string | undefined;
    emails: string[];
    fieldId?: string;
    onChange: (
      primaryEmail: string,
      emails: string[],
      onCompleted: () => void,
    ) => void;
  }
>(({ recordId, primaryEmail, emails, onChange, ...props }, ref) => {
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

  const handleEscape = (closeEditMode: () => void) => {
    closeEditMode();
    setNewEmail('');
    setIsAddingEmail(false);
    setEditingEmail(null);
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
    if (editingEmail && newEmail && !allEmails.includes(newEmail)) {
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

  return (
    <InlineCell
      name="email"
      recordId={recordId}
      onEnter={editingEmail ? handleEditSubmit : handleAddNewEmail}
      onEscape={handleEscape}
      onCancel={handleEscape}
      display={() => (
        <EmailListDisplay emails={allEmails} ref={ref} {...props} />
      )}
      edit={() => (
        <InlineCellEdit className="w-56 p-1">
          <EmailItems
            emails={allEmails}
            onDelete={handleDelete}
            onSetPrimary={handleSetPrimary}
            onEdit={handleEdit}
            editingEmail={editingEmail}
          >
            <EmailMutate
              isAddingEmail={isAddingEmail}
              isEditing={Boolean(editingEmail)}
              newEmail={newEmail}
              inputRef={inputRef}
              onInputChange={setNewEmail}
              onAddClick={() => {
                setIsAddingEmail(true);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }}
            />
          </EmailItems>
        </InlineCellEdit>
      )}
    />
  );
});

const EmailListDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & { emails: string[] }
>(({ emails, ...props }, ref) => (
  <InlineCellDisplay className="w-full h-cell" ref={ref} asChild {...props}>
    <div className="w-full relative h-cell group">
      {emails.map((email, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-min hover:bg-border"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
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
));

interface EmailActionPopoverProps {
  email: string;
  onDelete: (email: string) => void;
  onSetPrimary: (email: string) => void;
  onEdit: (email: string) => void;
  isEditing: boolean;
}

const EmailActionPopover: React.FC<EmailActionPopoverProps> = ({
  email,
  onDelete,
  onSetPrimary,
  onEdit,
  isEditing,
}) => {
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
            'absolute right-1 opacity-0 group-hover:opacity-100 hover:bg-border flex items-center justify-center transition-opacity size-5 px-0',
            open && 'opacity-100 bg-border z-20',
          )}
          disabled={isEditing}
        >
          <IconDotsVertical className="text-muted-foreground w-4 h-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="bg-background p-1 shadow-lg w-56"
        align="end"
        alignOffset={10}
      >
        <Command>
          <Command.List>
            <Command.Item className="h-cell" asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground"
                onClick={() => {
                  onSetPrimary(email);
                  setOpen(false);
                }}
              >
                <IconBookmarkPlus className="w-4 h-4 " />
                Set as primary email
              </Button>
            </Command.Item>
            <Command.Item className="h-cell" asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground"
                onClick={() => {
                  onEdit(email);
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
                  onDelete(email);
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

interface EmailMutateProps {
  isAddingEmail: boolean;
  isEditing: boolean;
  newEmail: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onAddClick: () => void;
}

const EmailMutate: React.FC<EmailMutateProps> = ({
  isAddingEmail,
  isEditing,
  newEmail,
  inputRef,
  onInputChange,
  onAddClick,
}) => (
  <Command.Item className="h-cell text-xs items-center justify-start flex p-0">
    {isAddingEmail || isEditing ? (
      <Input
        className="h-7 mb-px w-full mx-1"
        ref={inputRef}
        value={newEmail}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={isEditing ? 'Edit email' : 'Add new email'}
      />
    ) : (
      <Button
        variant="ghost"
        className="flex gap-1 hover:bg-transparent justify-start w-full h-full focus-visible:ring-0"
        onClick={onAddClick}
      >
        <IconPlus />
        Add Email
      </Button>
    )}
  </Command.Item>
);

interface EmailItemsProps {
  emails: string[];
  onDelete: (email: string) => void;
  onSetPrimary: (email: string) => void;
  onEdit: (email: string) => void;
  editingEmail: string | null;
  children: React.ReactNode;
}

const EmailItems: React.FC<EmailItemsProps> = ({
  emails,
  onDelete,
  onSetPrimary,
  onEdit,
  editingEmail,
  children,
}) => (
  <Command>
    <Command.List className="max-h-[300px] overflow-y-auto">
      {emails.map((email, index) => (
        <Command.Item
          key={index}
          className="group relative flex items-center h-cell text-xs"
        >
          <span className="relative truncate max-w-[180px]">
            <span className="relative z-10 hover:cursor-pointer">{email}</span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-transparent group-hover:bg-muted-foreground" />
          </span>

          {index === 0 && (
            <IconBookmark className="text-muted-foreground absolute right-2 h-[15px] w-[15px] group-hover:hidden" />
          )}
          <EmailActionPopover
            email={email}
            onDelete={onDelete}
            onSetPrimary={onSetPrimary}
            onEdit={onEdit}
            isEditing={Boolean(editingEmail)}
          />
        </Command.Item>
      ))}
      <Command.Separator className="my-1" />
      {children}
    </Command.List>
  </Command>
);
