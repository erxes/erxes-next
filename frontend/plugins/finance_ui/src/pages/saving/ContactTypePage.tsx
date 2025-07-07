import { PageContainer, PageSubHeader } from 'erxes-ui';
import { ContractTypesHeader } from '~/modules/contractTypes/components/ContractTypesHeader';
import { ContractTypesRecordTable } from '~/modules/contractTypes/components/ContractTypesRecordTable';

export const ContactTypePage = () => {
  return (
    <PageContainer>
      <ContractTypesHeader />
      <ContractTypesRecordTable />
    </PageContainer>
  );
};
