import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { Button, cn, Sheet, useSetHotkeyScope } from 'erxes-ui';
import { renderingProductDetailAtom } from '../../states/productDetailStates';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { ProductHotKeyScope } from '@/products/types/ProductsHotKeyScope';
import { useQueryState } from 'erxes-ui';

export const ProductDetailSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab] = useAtom(renderingProductDetailAtom);
  const setHotkeyScope = useSetHotkeyScope();
  const [productId, setProductId] = useQueryState('productId');

  useEffect(() => {
    if (productId) {
      setHotkeyScope(ProductHotKeyScope.ProductEditSheet);
    }
  }, [productId, setHotkeyScope]);

  const setOpen = (newProductId: string | null) => {
    if (newProductId) {
      setProductId(newProductId);
    } else {
      setProductId(null);
    }

    if (!newProductId) {
      setHotkeyScope(ProductHotKeyScope.ProductsPage);
    }
  };

  return (
    <Sheet
      open={!!productId}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(null);
          setHotkeyScope(ProductHotKeyScope.ProductsPage);
        }
      }}
    >
      <Sheet.View
        className={cn(
          'p-0 md:max-w-screen-2xl flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none',
          !!activeTab && 'md:w-[calc(100vw-theme(spacing.4))]',
        )}
      >
        <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
          <Button variant="ghost" size="icon">
            <IconLayoutSidebarLeftCollapse />
          </Button>
          <Sheet.Title>Product Detail</Sheet.Title>
          <Sheet.Close />
          <Sheet.Description className="sr-only">
            Product Detail
          </Sheet.Description>
        </Sheet.Header>
        {children}
      </Sheet.View>
    </Sheet>
  );
};
