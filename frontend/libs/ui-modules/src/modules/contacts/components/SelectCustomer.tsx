import {
  AvatarProps,
  ButtonProps,
  Combobox,
  Command,
  Popover,
  Skeleton,
} from 'erxes-ui';
import { useCustomers } from '../hooks/useCustomers';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { ICustomerInline } from '../types/Customer';
import React from 'react';
import { useCustomerInline } from '../hooks';
import { CustomerInline } from './CustomerInline';

interface SelectCustomerProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const SelectCustomer = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ButtonProps & SelectCustomerProps
>(({ value, onValueChange, children, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ICustomerInline | undefined>(
    undefined,
  );

  const handleSelect = (user: ICustomerInline | undefined) => {
    setSelectedUser(user);
    onValueChange?.(user?._id || '');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      {children ? (
        children
      ) : (
        <SelectCustomerTrigger
          value={value || ''}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          {...props}
          ref={ref}
        />
      )}

      <Combobox.Content>
        <SelectCustomerList
          renderItem={(customer) => (
            <SelectCustomerItem
              key={customer._id}
              customer={customer}
              selectedUser={selectedUser}
              handleSelect={handleSelect}
            />
          )}
        />
      </Combobox.Content>
    </Popover>
  );
});

export function SelectCustomerList({
  renderItem,
}: {
  renderItem: (customer: ICustomerInline) => React.ReactNode;
}) {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { customers, loading, handleFetchMore, totalCount, error } =
    useCustomers({
      variables: {
        searchValue: debouncedSearch,
      },
    });
  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        wrapperClassName="flex-auto"
      />
      <Command.List className="max-h-[300px] overflow-y-auto">
        <Combobox.Empty loading={loading} error={error} />
        {customers?.map((customer: ICustomerInline) => renderItem(customer))}
        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          currentLength={customers?.length}
          totalCount={totalCount}
        />
      </Command.List>
    </Command>
  );
}

export const SelectCustomerTrigger = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ButtonProps & {
    value: string;
    selectedUser?: ICustomerInline;
    setSelectedUser: (customer?: ICustomerInline) => void;
  }
>(({ value, selectedUser, setSelectedUser, ...props }, ref) => {
  const { loading } = useCustomerInline({
    variables: { _id: value },
    skip: !value || selectedUser?._id === value,
    onCompleted: ({ customerDetail }: { customerDetail: ICustomerInline }) => {
      setSelectedUser({ ...customerDetail, _id: value });
    },
  });

  return (
    <Combobox.Trigger disabled={loading} {...props} ref={ref}>
      {value ? (
        <CustomerInline
          customer={selectedUser}
          avatarProps={{
            size: props.size as AvatarProps['size'],
          }}
        />
      ) : loading ? (
        <Skeleton className="w-full h-8" />
      ) : (
        <Combobox.Value placeholder="Select customer" />
      )}
    </Combobox.Trigger>
  );
});

export const SelectCustomerItem = ({
  customer,
  selectedUser,
  handleSelect,
}: {
  customer: ICustomerInline;
  selectedUser?: ICustomerInline;
  handleSelect: (customer?: ICustomerInline) => void;
}) => {
  const isSelected = selectedUser?._id === customer._id;
  return (
    <Command.Item
      key={customer._id}
      value={customer._id}
      onSelect={() => handleSelect(isSelected ? undefined : customer)}
    >
      <CustomerInline customer={customer} />
      <Combobox.Check checked={isSelected} />
    </Command.Item>
  );
};
