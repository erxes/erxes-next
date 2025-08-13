import React from 'react';
import {
  Avatar,
  avatarVariants,
  cn,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui';
import { ICompany } from '../types/Company';
import { useCompanyInline } from '../hooks/useCompanyInline';
import { CompanyInlineContext } from '../contexts/CompanyInlineContext';
import { useCompanyInlineContext } from '../hooks/useCompanyInlineContext';

const CompanyInlineRoot = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
    company?: ICompany;
    companyId?: string;
    avatarProps?: React.ComponentPropsWithoutRef<typeof Avatar>;
  }
>(({ company, companyId, avatarProps, ...props }, ref) => {
  return (
    <CompanyInlineProvider companyId={companyId} company={company}>
      <span
        ref={ref}
        {...props}
        className={cn(
          'inline-flex items-center gap-2 overflow-hidden',
          props.className,
        )}
      >
        <CompanyInlineAvatar {...avatarProps} />
        <CompanyInlineTitle />
      </span>
    </CompanyInlineProvider>
  );
});

CompanyInlineRoot.displayName = 'CompanyInlineRoot';

const CompanyInlineProvider = ({
  children,
  company,
  companyId,
}: {
  children: React.ReactNode;
  company?: ICompany;
  companyId?: string;
}) => {
  const { companyDetail, loading } = useCompanyInline({
    variables: {
      _id: companyId || '',
    },
    skip: !companyId,
  });

  const companyData = companyDetail || company || ({} as ICompany);

  return (
    <CompanyInlineContext.Provider
      value={{
        ...companyData,
        _id: companyId || companyData._id,
        loading,
      }}
    >
      {children}
    </CompanyInlineContext.Provider>
  );
};

const CompanyInlineAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar>
>(({ ...props }, ref) => {
  const { avatar, primaryName, primaryEmail, loading, _id } =
    useCompanyInlineContext();

  if (loading)
    return <Skeleton className={avatarVariants({ size: props.size })} />;

  return (
    <Avatar {...props} ref={ref}>
      <Avatar.Image src={avatar} />
      <Avatar.Fallback>
        {primaryName?.charAt(0) || primaryEmail?.charAt(0) || ''}
      </Avatar.Fallback>
    </Avatar>
  );
});

CompanyInlineAvatar.displayName = 'CompanyInlineAvatar';

export const CompanyInlineTitle = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>((props, ref) => {
  const { primaryName, primaryEmail, loading } = useCompanyInlineContext();

  if (loading) return <Skeleton className="w-20 h-4" />;

  return (
    <TextOverflowTooltip
      value={primaryName || primaryEmail}
      {...props}
      ref={ref}
    />
  );
});

CompanyInlineTitle.displayName = 'CompanyInlineTitle';

export const CompanyInline = Object.assign(CompanyInlineRoot, {
  Provider: CompanyInlineProvider,
  Avatar: CompanyInlineAvatar,
  Title: CompanyInlineTitle,
});
