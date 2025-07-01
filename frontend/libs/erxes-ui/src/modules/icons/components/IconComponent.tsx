import React from 'react';
import { useIcons } from '../hooks/useIcons';
import { TablerIcon } from '@tabler/icons-react';
import { ALL_ICONS } from 'erxes-ui/modules/icons/components/TablerIcons';

export type IconComponentNamesType = keyof typeof ALL_ICONS;

export const IconComponent = React.forwardRef<
  TablerIcon,
  React.ComponentPropsWithoutRef<TablerIcon> & { name?: keyof typeof ALL_ICONS }
>(({ name, ...props }, ref) => {
  const { getIcon } = useIcons();
  const Icon = getIcon(name);

  return <Icon ref={ref} {...props} />;
});
