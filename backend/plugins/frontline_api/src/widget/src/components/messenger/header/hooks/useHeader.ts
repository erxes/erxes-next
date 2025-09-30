import { useMessenger } from '../../hooks/useMessenger';
import { HEADER_ITEMS } from '../../constants';
import { HeaderContentType } from '../types';

export function useHeader() {
  const { activeTab, switchToTab, goBack } = useMessenger();

  const getCurrentTitle = (): string => {
    return HEADER_ITEMS.find((item) => item.value === activeTab)?.title ?? 'Chat';
  };

  const renderHeaderContent = (): HeaderContentType => {
    switch (activeTab) {
      case 'chat':
        return 'header-start';
      case '':
        return 'hero-section';
      default:
        return 'header-start';
    }
  };

  return {
    activeTab,
    switchToTab,
    goBack,
    getCurrentTitle,
    renderHeaderContent,
  };
}
