import { PageHeader, PageHeaderEnd, PageHeaderStart } from 'ui-modules';
import { CreateBrand } from './CreateBrand';
import { Breadcrumb, Button, useMultiQueryState } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { IconChessKnightFilled } from '@tabler/icons-react';
import { useBrands } from '../hooks/useBrands';

export function BrandsHeader() {
  const [{ searchValue }] = useMultiQueryState<{
    searchValue: string;
  }>(['searchValue']);
  const { totalCount, loading } = useBrands({
    variables: {
      searchValue,
    },
  });
  return (
    <PageHeader>
      <PageHeaderStart>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/settings/brands">
                  <IconChessKnightFilled />
                  Brands
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeaderStart>
      <PageHeaderEnd>
        <CreateBrand />
      </PageHeaderEnd>
    </PageHeader>
  );
}
