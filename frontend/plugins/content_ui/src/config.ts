import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';
import { IconBooks } from '@tabler/icons-react';

export const CONFIG: IUIConfig = {
  name: 'content',
  icon: IconSandbox,
  modules: [
    {
      name: 'knowledgebase',
      icon: IconBooks,
      path: 'knowledgebase',
      hasSettings: false,
      hasWidgets: false,
    },
  ],
};
