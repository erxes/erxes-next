import { useHeader } from './header/hooks';
import { HeroSection, HeaderStart } from './header/components';

export const Header = () => {
  const { renderHeaderContent } = useHeader();
  
  const render = () => {
    const content = renderHeaderContent();
    switch (content) {
      case 'hero-section':
        return <HeroSection />;
      case 'header-start':
        return <HeaderStart />;
      default:
        return <HeaderStart />;
    }
  };

  return <div className="flex flex-col gap-4 p-4">{render()}</div>;
};

// Re-export components for backward compatibility
export {
  HeroSection,
  HeaderStart,
  HeaderItemLabel,
  HeaderTabItem,
  HeaderItemsList,
  HeaderTabList,
} from './header/components';
