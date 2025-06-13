import { Avatar, Combobox, isUndefinedOrNull, Tooltip } from 'erxes-ui';
import {
  CompaniesInlineContext,
  useCompaniesInlineContext,
} from '../contexts/CompaniesInlineContext';
import { ICompany } from '../types';
import { useCompanyInline } from '../hooks/useCompanyInline';
import { useEffect, useState } from 'react';

export const CompaniesInlineRoot = ({
  companies,
  companyIds,
  placeholder,
  updateCompanies,
  size,
}: {
  companies?: ICompany[];
  companyIds?: string[];
  placeholder?: string;
  updateCompanies?: (companies: ICompany[]) => void;
  size: React.ComponentProps<typeof Avatar>['size'];
}) => {
  return (
    <CompaniesInlineProvider
      companies={companies}
      companyIds={companyIds}
      placeholder={placeholder}
      updateCompanies={updateCompanies}
    >
      <CompaniesInlineAvatar size={size} />
      <CompaniesInlineTitle />
    </CompaniesInlineProvider>
  );
};

const CompaniesInlineProvider = ({
  children,
  placeholder,
  companyIds,
  companies,
  updateCompanies,
}: {
  children: React.ReactNode;
  companyIds?: string[];
  companies?: ICompany[];
  updateCompanies?: (companies: ICompany[]) => void;
  placeholder?: string;
}) => {
  const [_companies, _setCompanies] = useState<ICompany[]>(companies || []);
  return (
    <CompaniesInlineContext.Provider
      value={{
        companies: companies || _companies,
        loading: false,
        companyIds: companyIds || [],
        updateCompanies: updateCompanies || _setCompanies,
        placeholder: isUndefinedOrNull(placeholder)
          ? 'Select Companies'
          : placeholder,
      }}
    >
      <Tooltip.Provider>{children}</Tooltip.Provider>
      {companyIds
        ?.filter((id) => !companies?.some((company) => company._id === id))
        .map((companyId) => (
          <CompanyInlineEffectComponent key={companyId} companyId={companyId} />
        ))}
    </CompaniesInlineContext.Provider>
  );
};

const CompanyInlineEffectComponent = ({ companyId }: { companyId: string }) => {
  const { updateCompanies, companies } = useCompaniesInlineContext();

  const { companyDetail } = useCompanyInline({
    variables: {
      _id: companyId,
    },
    skip: !companyId,
  });

  useEffect(() => {
    if (companyDetail) {
      const existingCompaniesMap = new Map(
        companies.map((company) => [company._id, company]),
      );
      const newCompanies = companies.filter(
        (company) => !existingCompaniesMap.has(company._id),
      );
      if (newCompanies.length > 0) {
        updateCompanies?.([...companies, ...newCompanies]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyDetail]);

  return null;
};

export const CompaniesInlineAvatar = ({
  size,
}: {
  size: React.ComponentProps<typeof Avatar>['size'];
}) => {
  const { companies, loading, companyIds } = useCompaniesInlineContext();

  if (loading) {
    return (
      <div className="flex -space-x-1.5">
        {companyIds?.map((companyId) => (
          <Avatar key={companyId} size={size} className="bg-background">
            <Avatar.Fallback />
          </Avatar>
        ))}
      </div>
    );
  }

  const renderAvatar = (company: ICompany) => {
    const { avatar, primaryName } = company;
    const firstLetter = primaryName?.charAt(0);
    return (
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Avatar className="bg-background" size={size}>
            <Avatar.Image src={avatar} />
            <Avatar.Fallback>{firstLetter}</Avatar.Fallback>
          </Avatar>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{primaryName}</p>
        </Tooltip.Content>
      </Tooltip>
    );
  };

  if (companies.length === 0) return null;

  if (companies.length === 1) return renderAvatar(companies[0]);

  const withAvatar = companies.slice(0, companies.length > 3 ? 2 : 3);
  const restCompanies = companies.slice(withAvatar.length);

  return (
    <div className="flex -space-x-1.5">
      {withAvatar.map(renderAvatar)}
      {restCompanies.length > 0 && (
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Avatar
              className="ring-2 ring-background bg-background"
              size={size}
            >
              <Avatar.Fallback className="bg-primary/10 text-primary">
                +{restCompanies.length}
              </Avatar.Fallback>
            </Avatar>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>
              {restCompanies.map((company) => company.primaryName).join(', ')}
            </p>
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  );
};

export const CompaniesInlineTitle = () => {
  const { companies, loading, placeholder } = useCompaniesInlineContext();

  const getDisplayValue = () => {
    if (companies.length === 0) return undefined;

    if (companies.length === 1) {
      return companies?.[0].primaryName;
    }

    return `${companies.length} companies`;
  };

  return (
    <Combobox.Value
      value={getDisplayValue()}
      loading={loading}
      placeholder={placeholder}
    />
  );
};

export const CompaniesInline = Object.assign(CompaniesInlineRoot, {
  Provider: CompaniesInlineProvider,
  Avatar: CompaniesInlineAvatar,
  Title: CompaniesInlineTitle,
});
