import {
  CustomersInlineContext,
  useCustomersInlineContext,
} from '../contexts/CustomersInlineContext';
import {
  Avatar,
  AvatarProps,
  cn,
  Combobox,
  isUndefinedOrNull,
  Tooltip,
} from 'erxes-ui';
import { ICustomer } from '../types';
import { useEffect } from 'react';
import { useCustomersInline } from '../hooks';
import React from 'react';

interface CustomersInlineProviderProps {
  children: React.ReactNode;
  customerIds?: string[];
  customers?: ICustomer[];
  placeholder?: string;
  updateCustomers?: (customers: ICustomer[]) => void;
}

const CustomersInlineProvider = ({
  children,
  placeholder,
  customerIds,
  customers,
  updateCustomers,
}: CustomersInlineProviderProps) => {
  const getCustomerTitle = (customer: ICustomer) => {
    const { firstName, lastName, primaryEmail, primaryPhone } = customer;
    const fullName =
      firstName || lastName
        ? `${firstName || ''} ${lastName || ''}`.trim()
        : primaryEmail || primaryPhone || placeholder || 'anonymous customer';
    return fullName;
  };

  return (
    <CustomersInlineContext.Provider
      value={{
        customers: customers || [],
        loading: false,
        placeholder: isUndefinedOrNull(placeholder)
          ? 'Select Customers'
          : placeholder,
        updateCustomers,
        getCustomerTitle,
      }}
    >
      <Tooltip.Provider>{children}</Tooltip.Provider>
      {customerIds?.some(
        (id) => !customers?.some((customer) => customer._id === id),
      ) && (
        <CustomerInlineEffectComponent
          customerIdsWithNoDetails={customerIds.filter(
            (id) => !customers?.some((customer) => customer._id === id),
          )}
        />
      )}
    </CustomersInlineContext.Provider>
  );
};

const CustomerInlineEffectComponent = ({
  customerIdsWithNoDetails,
}: {
  customerIdsWithNoDetails: string[];
}) => {
  const { updateCustomers, customers } = useCustomersInlineContext();
  const { customers: detailMissingCustomers } = useCustomersInline({
    variables: {
      _ids: customerIdsWithNoDetails,
    },
  });

  useEffect(() => {
    if (detailMissingCustomers && detailMissingCustomers.length > 0) {
      const existingCustomersMap = new Map(
        customers.map((customer) => [customer._id, customer]),
      );
      const newCustomers = detailMissingCustomers.filter(
        (customer) => !existingCustomersMap.has(customer._id),
      );

      if (newCustomers.length > 0) {
        updateCustomers?.([...customers, ...newCustomers]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailMissingCustomers, updateCustomers, customerIdsWithNoDetails]);

  return null;
};

const CustomersInlineAvatar = ({ className, ...props }: AvatarProps) => {
  const { customers, loading, customerIds, getCustomerTitle } =
    useCustomersInlineContext();

  if (loading)
    return (
      <div className="flex -space-x-1.5">
        {customerIds?.map((customerId) => (
          <Avatar key={customerId} className={cn('bg-background', className)}>
            <Avatar.Fallback />
          </Avatar>
        ))}
      </div>
    );

  const renderAvatar = (customer: ICustomer) => {
    return (
      <Tooltip delayDuration={100}>
        <Tooltip.Trigger asChild>
          <Avatar
            key={customer._id}
            className={cn(
              'bg-background',
              customers.length > 1 && 'ring-2 ring-background',
              className,
            )}
            size="lg"
            {...props}
          >
            <Avatar.Image src={customer.avatar} />
            <Avatar.Fallback>
              {getCustomerTitle(customer).charAt(0)}
            </Avatar.Fallback>
          </Avatar>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{getCustomerTitle(customer)}</p>
        </Tooltip.Content>
      </Tooltip>
    );
  };

  if (customers.length === 0) return null;

  if (customers.length === 1) return renderAvatar(customers[0]);

  const withAvatar = customers.slice(0, customers.length > 3 ? 2 : 3);
  const restMembers = customers.slice(withAvatar.length);

  return (
    <div className="flex -space-x-1.5">
      {withAvatar.map(renderAvatar)}
      {restMembers.length > 0 && (
        <Tooltip delayDuration={100}>
          <Tooltip.Trigger asChild>
            <Avatar
              key={restMembers[0]._id}
              className={cn('ring-2 ring-background bg-background', className)}
              {...props}
              size="lg"
            >
              <Avatar.Fallback className="bg-primary/10 text-primary">
                +{restMembers.length}
              </Avatar.Fallback>
            </Avatar>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>
              {restMembers
                .map((c) => `${c.firstName || ''} ${c.lastName || ''}`)
                .join(', ')}
            </p>
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  );
};

const CustomersInlineTitle = ({ className }: { className?: string }) => {
  const { getCustomerTitle, customers, loading, placeholder } =
    useCustomersInlineContext();

  const getDisplayValue = () => {
    if (!customers || customers.length === 0) return placeholder;

    if (customers.length === 1) {
      return getCustomerTitle(customers[0]);
    }

    return `${customers.length} customers`;
  };

  return (
    <Combobox.Value
      value={getDisplayValue()}
      loading={loading}
      placeholder={placeholder}
      className={className}
    />
  );
};

const CustomersInlineRoot = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> &
    Omit<CustomersInlineProviderProps, 'children'>
>(
  (
    {
      customerIds,
      customers,
      placeholder,
      updateCustomers,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <CustomersInlineProvider
        customerIds={customerIds}
        customers={customers}
        placeholder={placeholder}
        updateCustomers={updateCustomers}
      >
        <span
          ref={ref}
          {...props}
          className={cn(
            'inline-flex items-center gap-2 overflow-hidden',
            className,
          )}
        >
          <CustomersInlineAvatar />
          <CustomersInlineTitle />
        </span>
      </CustomersInlineProvider>
    );
  },
);

export const CustomersInline = Object.assign(CustomersInlineRoot, {
  Provider: CustomersInlineProvider,
  Avatar: CustomersInlineAvatar,
  Title: CustomersInlineTitle,
});
