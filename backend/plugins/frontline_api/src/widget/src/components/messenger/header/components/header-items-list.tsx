import { HEADER_ITEMS } from '../../constants';
import { HeaderItemLabel } from './header-item-label';

export function HeaderItemsList() {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {HEADER_ITEMS.map((item) => (
        <HeaderItemLabel
          key={item.title}
          title={item.title}
          value={item.value}
          Icon={item.Icon}
        />
      ))}
    </div>
  );
}
