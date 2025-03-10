import { Tabs } from 'erxes-ui/components/tabs';
import { ProductDetailSheet } from './ProductDetailSheet';
import { useLocation, useNavigate } from 'react-router-dom';
import { Resizable } from 'erxes-ui/components';

export const ProductDetailLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <ProductDetailSheet>
      <div className="flex h-auto flex-auto overflow-auto">
        <div className="flex flex-col flex-auto min-h-full overflow-hidden">
          <Resizable.PanelGroup
            direction="horizontal"
            className="flex-auto min-h-full overflow-hidden"
          >
            <Resizable.Panel defaultSize={75} minSize={30}>
              <ProductDetailTabs>{children}</ProductDetailTabs>
            </Resizable.Panel>

            {actions && (
              <>
                <Resizable.Handle />
                <Resizable.Panel defaultSize={25} minSize={20}>
                  {actions}
                </Resizable.Panel>
              </>
            )}
          </Resizable.PanelGroup>
        </div>
      </div>
    </ProductDetailSheet>
  );
};

const ProductDetailTabs = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedTab = searchParams.get('tab') || 'overview';
  const handleTabChange = (tab: string) => {
    searchParams.set('tab', tab);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={handleTabChange}
      className="flex-auto flex flex-col"
    >
      <Tabs.List className="h-12">
        <Tabs.Trigger value="overview" className="text-base h-full">
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger value="properties" className="text-base h-full">
          Properties
        </Tabs.Trigger>
      </Tabs.List>
      {children}
    </Tabs>
  );
};

export const ProductDetailTabContent = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <Tabs.Content value={value} className="flex-auto overflow-hidden">
      {children}
    </Tabs.Content>
  );
};
