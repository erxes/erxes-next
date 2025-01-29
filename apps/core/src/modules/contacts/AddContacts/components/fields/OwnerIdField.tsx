import { Avatar, Button, Command, Popover, Spinner } from 'erxes-ui/components';
import { useUsers } from '@/contacts/hooks/useUsers';
import { useState } from 'react';
import { cn } from 'erxes-ui/lib/utils';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'erxes-ui/components';
import { Control } from 'react-hook-form';
import { CustomerFormType } from '@/contacts/AddContacts/components/formSchema';
import { SelectUserFetchMore } from '../SelectUserFetchMore';
import { useDebounce } from 'use-debounce';

export const OwnerIdField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [open, setOpen] = useState(false);
  const { users, loading, handleFetchMore, totalCount } = useUsers({
    variables: {
      searchValue: debouncedSearch,
    },
  });
  return (
    <FormField
      control={control}
      name="ownerId"
      render={({ field }) => {
        const currentUser = users.find((user) => user._id === field.value);

        const handleSelectUser = (userId: string) => {
          field.onChange(userId === field.value ? '' : userId);
          setOpen(false);
        };

        return (
          <FormItem>
            <FormLabel>CHOOSE AN OWNER</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen} modal>
                <Popover.Trigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="owner-command-menu"
                    className="truncate h-8 rounded-md hover:cursor-pointer shadow-none w-full justify-between"
                  >
                    {currentUser ? (
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <Avatar.Image src={currentUser.details?.avatar} />
                          <Avatar.Fallback colorSeed={currentUser._id}>
                            {currentUser.details?.firstName?.charAt(0)}
                          </Avatar.Fallback>
                        </Avatar>
                        <span className="truncate">
                          {currentUser.details?.fullName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-medium text-sm">
                        Choose
                      </span>
                    )}
                    <IconChevronDown
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Button>
                </Popover.Trigger>
                <Popover.Content
                  className="w-60 min-w-[var(--radix-popper-anchor-width)] border-input p-0"
                  align="start"
                  side="bottom"
                  sideOffset={8}
                >
                  <Command id="owner-command-menu" className="relative">
                    <Command.Input
                      value={search}
                      onValueChange={setSearch}
                      variant="secondary"
                      wrapperClassName="flex-auto"
                    />
                    <Command.List className="max-h-[300px] overflow-y-auto">
                      <Command.Empty>
                        {loading ? (
                          <div className="flex items-center justify-center h-full">
                            <Spinner size={'small'} />
                          </div>
                        ) : (
                          <div>
                            <p className="text-muted-foreground pb-2">
                              No results found.
                            </p>
                          </div>
                        )}
                      </Command.Empty>
                      {users.map((user) => (
                        <Command.Item
                          key={user._id}
                          value={user.details?.fullName}
                          className="h-7 text-xs"
                          onSelect={() => handleSelectUser(user._id)}
                        >
                          <Avatar>
                            <Avatar.Image src={user.details?.avatar} />
                            <Avatar.Fallback colorSeed={user._id}>
                              {user.details?.fullName?.charAt(0)}
                            </Avatar.Fallback>
                          </Avatar>
                          <span className="ml-2">{user.details?.fullName}</span>
                          <IconCheck
                            size={16}
                            strokeWidth={2}
                            className={cn(
                              'ml-auto',
                              user._id === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </Command.Item>
                      ))}
                      <SelectUserFetchMore
                        fetchMore={handleFetchMore}
                        usersLength={users?.length}
                        totalCount={totalCount}
                      />
                    </Command.List>
                  </Command>
                </Popover.Content>
              </Popover>
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        );
      }}
    />
  );
};
