import { IconCube } from '@tabler/icons-react';

import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';
import { AddProductForm } from '../add-products/components/AddProductForm';
import { Link } from 'react-router-dom';

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
        <AddProductForm />
      </PageHeader.End>
    </PageHeader>
  );
};
