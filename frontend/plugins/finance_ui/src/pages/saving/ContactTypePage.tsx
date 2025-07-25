import { PageContainer, PageSubHeader } from 'erxes-ui';
import { ContractsTypeDetail } from '~/modules/contractTypes/components/ContractTypeDetailSheet';
import { ContractTypesHeader } from '~/modules/contractTypes/components/ContractTypesHeader';
import { ContractTypesRecordTable } from '~/modules/contractTypes/components/ContractTypesRecordTable';

export const ContactTypePage = () => {
  return (
    <PageContainer>
      <ContractTypesHeader />
      <ContractTypesRecordTable />
      <ContractsTypeDetail />
    </PageContainer>
  );
};
