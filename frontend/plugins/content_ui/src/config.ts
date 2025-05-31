import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';
import { BookOpenCheck } from 'lucide-react';

export const CONFIG: IUIConfig = {
  name: 'content',
  icon: IconSandbox,
  modules: [
    {
      name: 'knowledgebase',
      icon: BookOpenCheck,
      path: 'knowledgebase',
      hasSettings: false,
      hasWidgets: false,
    },
  ],
};
