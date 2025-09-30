import { HEADER_ITEMS } from '../../constants';
import { HeaderTabItem } from './header-tab-item';

export function HeaderTabList() {
  return (
    <div className="flex items-center gap-1" role="tablist">
      {HEADER_ITEMS.map((item) => (
        <HeaderTabItem 
          key={item.title} 
          title={item.title}
          value={item.value} 
          Icon={item.Icon} 
        />
      ))}
    </div>
  );
}
