import { Separator, Sheet } from 'erxes-ui';
import {
  CompanyDetailLayout,
  CompanyDetailTabContent,
} from '@/contacts/companies/company-detail/CompanyDetailLayout';

export const CompanyDetail = () => {
  return (
    <CompanyDetailLayout>
      <div className="flex flex-auto">
        <Sheet.Content className="border-b-0 rounded-b-none">
          {/* <CompanyDetailGeneral />
          <Separator />
          <CompanyDetailTabContent value="overview">
            <CompanyDetailGeneral />
          </CompanyDetailTabContent>
          <CompanyDetailTabContent value="properties">
            <CompanyProperties />
          </CompanyDetailTabContent> */}
        </Sheet.Content>
      </div>
    </CompanyDetailLayout>
  );
};
