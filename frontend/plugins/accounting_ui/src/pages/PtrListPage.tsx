import {
  IconCaretDownFilled,
  IconCurrencyDollar,
  IconSettings,
} from '@tabler/icons-react';
import { Button, PluginHeader } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PtrRecordTable } from '@/ptr/components/PtrRecordTable';
export const PtrListPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PluginHeader
        title="PTR List"
        icon={IconCurrencyDollar}
        className="p-3 mx-0"
        separatorClassName="mb-0"
      >
        <Button variant="outline" asChild>
          <Link to="/settings/accounting">
            <IconSettings />
            Go to settings
          </Link>
        </Button>
        <Button>
          More <IconCaretDownFilled />
        </Button>
      </PluginHeader>
      <div className="flex-1">
        <PtrRecordTable />
      </div>
    </div>
  );
};
