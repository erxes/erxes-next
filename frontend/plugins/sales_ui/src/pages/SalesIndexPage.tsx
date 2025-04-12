import {
  IconCaretDownFilled,
  IconSandbox,
  IconSettings,
} from '@tabler/icons-react';
import { Button, PluginHeader } from 'erxes-ui';
import { Link } from 'react-router-dom';

export const SalesIndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PluginHeader
        title="Sales"
        icon={IconSandbox}
        className="p-3 mx-0"
        separatorClassName="mb-0"
      >
        <Button variant="outline" asChild>
          <Link to="/settings/sales">
            <IconSettings />
            Go to settings
          </Link>
        </Button>
        <Button>
          More <IconCaretDownFilled />
        </Button>
      </PluginHeader>
      <div className="flex-1">
        <h1>Sales plugin</h1>
      </div>
    </div>
  );
};
