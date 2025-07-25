import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { IconSandbox } from '@tabler/icons-react';
import { IconCategoryPlus } from '@tabler/icons-react';
import { ContractTypeAddSheet } from '@/contractTypes/components/AddContractTypeForm';

export const ContractTypesHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/settings/saving">
                  <IconSandbox />
                  Saving
                </Link>
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/saving/contactTypes">
                  <IconCategoryPlus />
                  Types
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.FavoriteToggleButton />
      </PageHeader.Start>
      <PageHeader.End>
        <ContractTypeAddSheet />
      </PageHeader.End>
    </PageHeader>
  );
};
