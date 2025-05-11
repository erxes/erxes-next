import {
  IconCategory2,
  IconLayoutSidebarRightExpandFilled,
  IconMenu,
} from '@tabler/icons-react';
import { Button, Input, Label, Switch, Tabs } from 'erxes-ui/components';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default () => {
  const { watch, setValue } = useFormContext();
  const activeTab = watch('activeTab');
  const isMinimized = watch('isMinimized');
  console.log({ isMinimized });
  return (
    <div className="h-12 border-b px-4">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-2 gap-8">
          <Input placeholder="Automation name" className="w-64" />

          <Tabs defaultValue="builder">
            <Tabs.List size="sm" className="h-8 ">
              <Tabs.Trigger
                size="sm"
                value="builder"
                className="h-8 py-2 px-6"
                onClick={() => setValue('activeTab', 'builder')}
              >
                Builder
              </Tabs.Trigger>
              <Tabs.Trigger
                size="sm"
                value="history"
                className="h-8 py-2 px-6"
                onClick={() => setValue('activeTab', 'history')}
              >
                History
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
        {activeTab === 'builder' && (
          <div className="flex flex-row items-center space-x-2 gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="mode">InActive</Label>
              <Switch id="mode" />
            </div>
            {/* <Button className="w-24">Save</Button> */}

            <Button
              variant="secondary"
              onClick={() => setValue('isMinimized', !isMinimized)}
            >
              <IconCategory2 />
              {`${isMinimized ? 'Show Menu' : 'Hide Menu'}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
