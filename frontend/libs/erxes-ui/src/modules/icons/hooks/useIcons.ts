import { useAtomValue } from 'jotai';

import { Icon123 } from '../components/TablerIcons';
import { iconsState } from '../states/iconsState';

export const useIcons = () => {
  const icons = useAtomValue(iconsState);
  const defaultIcon = Icon123;

  const getIcons = () => {
    return icons;
  };

  const getIcon = (iconKey?: string | null) => {
    if (!iconKey) {
      return defaultIcon;
    }

    return icons[iconKey] ?? defaultIcon;
  };

  return { getIcons, getIcon };
};
