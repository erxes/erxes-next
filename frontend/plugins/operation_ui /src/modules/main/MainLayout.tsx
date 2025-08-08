import { Resizable } from 'erxes-ui';
import { MainNavigation } from '@/navigation/MainNavigation';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Resizable.PanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <Resizable.Panel minSize={20} maxSize={30} defaultSize={20}>
        <MainNavigation />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel minSize={20} defaultSize={80}>
        {children}
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
