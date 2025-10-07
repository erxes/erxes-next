import { useAtom } from 'jotai';
import {
  activeTabAtom,
  setActiveTabAtom,
  resetTabAtom,
  isMessengerOpenAtom,
  conversationIdAtom,
} from '../atoms';
import { TabType } from '../types';

export function useMessenger() {
  const [activeTab] = useAtom(activeTabAtom);
  const [, setActiveTab] = useAtom(setActiveTabAtom);
  const [, resetTab] = useAtom(resetTabAtom);
  const [, setConversationId] = useAtom(conversationIdAtom);
  const [isOpen, setIsOpen] = useAtom(isMessengerOpenAtom);

  const switchToTab = (tab: TabType) => {
    setActiveTab(tab);
  };

  const goBack = () => {
    resetTab();
    setConversationId(null);
  };

  const toggleMessenger = () => {
    setIsOpen(!isOpen);
  };

  return {
    activeTab,
    isOpen,
    switchToTab,
    goBack,
    toggleMessenger,
    setIsOpen,
  };
}
