import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui/components';
import { productDetailSheetOpenAtom } from '../../states/productDetailStates';
import { cn } from 'erxes-ui/lib';
import { useSetHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/useSetHotkeyScope';
import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { ContactHotKeyScope } from '@/contacts/types/ContactHotKeyScope';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useLocation, useNavigate } from 'react-router-dom';

export const ProductDetailSheet = ({ children }: { children: React.ReactNode }) => {
  const [activeTab] = useAtom(productDetailSheetOpenAtom);
  const setHotkeyScope = useSetHotkeyScope();
  const navigate = useNavigate();
  const location = useLocation();

  const open = new URLSearchParams(location.search).get('product_id');

  useEffect(() => {
    if (open) {
      setHotkeyScope(ContactHotKeyScope.CustomerEditSheet);
    }
  }, [open, setHotkeyScope]);

  const setOpen = (productId: string | null) => {
    navigate({
      pathname: location.pathname,
      search: productId ? `?product_id=${productId}` : '',
    });
    if (!productId) {
      setHotkeyScope(PageHotkeyScope.ProductsPage);
    }
  };

  return (
    <Sheet
      open={!!open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(null);
          setHotkeyScope(PageHotkeyScope.ProductsPage);
        }
      }}
    >
      <Sheet.Content
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
          <Sheet.Description className="sr-only">Product Detail</Sheet.Description>
        </Sheet.Header>
        {children}
        {/* <ProductGeneral/> */}
      </Sheet.Content>
    </Sheet>
  );
};
