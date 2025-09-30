import { useAtom } from 'jotai';
import { activeTabAtom, isMessengerOpenAtom, setActiveTabAtom } from '../components/messenger/atoms';

export function useMessenger() {
  const [activeTab] = useAtom(activeTabAtom);
  const [isOpen, setIsOpen] = useAtom(isMessengerOpenAtom);
  const [, setActiveTab] = useAtom(setActiveTabAtom);

  const switchToTab = (tab: string) => {
    setActiveTab(tab as any);
  };

  const goBack = () => {
    setActiveTab('');
  };

  return {
    activeTab,
    setActiveTab,
    switchToTab,
    goBack,
    isOpen,
    setIsOpen,
  };
}
