import { isUndefinedOrNull, Tooltip } from 'erxes-ui';
import {
  CompaniesInlineContext,
  useCompaniesInlineContext,
} from '../contexts/CompaniesInlineContext';
import { ICompany } from '../types';
import { useCompanyInline } from '../hooks/useCompanyInline';
import { useEffect, useState } from 'react';

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
