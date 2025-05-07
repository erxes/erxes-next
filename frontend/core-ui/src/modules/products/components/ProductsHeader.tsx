import { IconCube } from '@tabler/icons-react';

import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { ProductAddSheet } from '../add-products/components/ProductAddSheet';
export const ProductsHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/products">
                  <IconCube />
                  Products & Services
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.LikeButton />
      </PageHeader.Start>
      <PageHeader.End>
        <ProductAddSheet />
      </PageHeader.End>
    </PageHeader>
  );
};
