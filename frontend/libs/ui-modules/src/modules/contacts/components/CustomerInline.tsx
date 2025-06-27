import React from 'react';
import { useCustomerInline } from '../hooks/useCustomerInline';
import { ICustomerInline } from '../types/Customer';
import { Avatar, avatarVariants, cn, Combobox, Skeleton } from 'erxes-ui';
import { useCustomerInlineContext } from '../hooks/useCustomerInlineContext';
import { CustomerInlineContext } from '../contexts/CustomerInlineContext';

const CustomerInlineRoot = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
    customer?: ICustomerInline;
    customerId?: string;
    avatarProps?: React.ComponentPropsWithoutRef<typeof Avatar>;
    placeholder?: string;
  }
>(({ customer, customerId, avatarProps, placeholder, ...props }, ref) => {
  return (
    <CustomerInlineProvider customerId={customerId} customer={customer}>
      <span
        ref={ref}
        {...props}
        className={cn(
          'inline-flex items-center gap-2 overflow-hidden',
          props.className,
        )}
      >
        <CustomerInlineAvatar {...avatarProps} />
        <CustomerInlineTitle placeholder={placeholder} />
      </span>
    </CustomerInlineProvider>
  );
});

CustomerInlineRoot.displayName = 'CustomerInlineRoot';

const CustomerInlineProvider = ({
  children,
  customer,
  customerId,
}: {
  children: React.ReactNode;
  customer?: ICustomerInline;
  customerId?: string;
}) => {
  const { customerDetail, loading } = useCustomerInline({
    variables: {
      _id: customerId,
    },
    skip: !customerId,
  });

  const customerData = customerDetail || customer || {};

  return (
    <CustomerInlineContext.Provider
      value={{ ...customerData, _id: customerId || customerData._id, loading }}
    >
      {children}
    </CustomerInlineContext.Provider>
  );
};

const CustomerInlineAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar>
>(({ ...props }, ref) => {
  const { firstName, lastName, avatar, primaryEmail, primaryPhone, loading } =
    useCustomerInlineContext();

  if (loading)
    return <Skeleton className={avatarVariants({ size: props.size })} />;

  return (
    <Avatar {...props} ref={ref}>
      <Avatar.Image src={avatar} />
      <Avatar.Fallback>
        {firstName?.charAt(0) ||
          lastName?.charAt(0) ||
          primaryEmail?.charAt(0) ||
          primaryPhone?.charAt(0) ||
          ''}
      </Avatar.Fallback>
    </Avatar>
  );
});

CustomerInlineAvatar.displayName = 'CustomerInlineAvatar';

export const CustomerInlineTitle = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'> & {
    placeholder?: string;
  }
>(({ className, ...props }, ref) => {
  const { firstName, lastName, primaryEmail, primaryPhone, loading } =
    useCustomerInlineContext();

  const placeholder = props.placeholder || 'anonymous customer';
  const value =
    firstName || lastName
      ? `${firstName || ''} ${lastName || ''}`
      : primaryEmail || primaryPhone || placeholder;

  return (
    <Combobox.Value
      loading={loading}
      value={value}
      className={cn(
        value === placeholder ? 'text-muted-foreground' : '',
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});

CustomerInlineTitle.displayName = 'CustomerInlineTitle';

export const CustomerInline = Object.assign(CustomerInlineRoot, {
  Provider: CustomerInlineProvider,
  Avatar: CustomerInlineAvatar,
  Title: CustomerInlineTitle,
});
