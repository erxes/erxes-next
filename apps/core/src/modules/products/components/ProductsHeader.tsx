import { Breadcrumb, Button, Header, HoverCard } from 'erxes-ui/components';
import { IconPlus, IconInfoCircle } from '@tabler/icons-react';
import { AddProductButton } from './HeaderAddProductsButton/AddProductButton';
import { CategoryForm } from './HeaderAddProductsButton/components/categoryForm';

const ProductsHeader = () => {
  return (
    <Header className="p-0">
      <div className="flex flex-auto items-center justify-between">
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page className="flex items-center gap-1">
                Products
                <HoverCard.Root>
                  <HoverCard.Trigger>
                    <Button variant="ghost" size="icon" className="opacity-50">
                      <IconInfoCircle className="size-3" />
                    </Button>
                  </HoverCard.Trigger>
                  <HoverCard.Content>
                    <h3 className="mb-1 font-medium">Products</h3>
                    <div className="text-muted-foreground">
                      All information and know-how related to your business
                      products and services are found here.Create and add in
                      unlimited products and servicess so that you and your team
                      members can edit and share
                    </div>
                  </HoverCard.Content>
                </HoverCard.Root>
              </Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div className="flex gap-2 items-center">
          <AddProductButton />
        </div>
      </div>
    </Header>
  );
};

export default ProductsHeader;
