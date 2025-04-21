import {
  IconCaretDownFilled,
  IconSandbox,
  IconSettings,
} from '@tabler/icons-react';
import { Button, PluginHeader } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { useWidget } from 'ui-modules';

export const SampleIndexPage = () => {
  const { Widget } = useWidget();

  console.log(Widget);
  return (
    <div className="flex flex-col h-full">
      <PluginHeader
        title="Sample"
        icon={IconSandbox}
        className="p-3 mx-0"
        separatorClassName="mb-0"
      >
        <Button variant="outline" asChild>
          <Link to="/settings/education">
            <IconSettings />
            Go to settings
          </Link>
        </Button>
        <Button>
          More <IconCaretDownFilled />
        </Button>
      </PluginHeader>
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden flex-auto">
          <h1>Sample dasdasdplugin</h1>
        </div>
        {!!Widget && (
          <Widget
            pluginName="education"
            contentId="1"
            contentType="education"
          />
        )}
      </div>
    </div>
  );
};
