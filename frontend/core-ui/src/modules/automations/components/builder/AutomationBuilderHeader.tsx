import {
  IconAffiliate,
  IconCategory2,
  IconSettings,
} from '@tabler/icons-react';
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Label,
  PageSubHeader,
  Separator,
  Spinner,
  Switch,
  Tabs,
} from 'erxes-ui';
import { Link } from 'react-router';
import { PageHeader } from 'ui-modules';
import { useAutomationHeader } from './hooks/useAutomationHeader';

export const AutomationBuilderHeader = () => {
  const {
    control,
    loading,
    isOpenSideBar,
    handleSubmit,
    handleSave,
    handleError,
    activeTab,
    toggleTabs,
    toggleSideBarOpen,
  } = useAutomationHeader();
  return (
    <div className="">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/automations">
                    <IconAffiliate />
                    Automations
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/automations">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button
            disabled={loading}
            onClick={handleSubmit(handleSave, handleError)}
          >
            {loading ? <Spinner /> : `Save`}
          </Button>
        </PageHeader.End>
      </PageHeader>
      <PageSubHeader className="hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-2 gap-8">
          <Form.Field
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Form.Item>
                <Input
                  placeholder={
                    fieldState.error
                      ? fieldState.error.message
                      : 'Automation name'
                  }
                  className={'w-64'}
                  {...field}
                />
              </Form.Item>
            )}
          />

          <AutomationTabs toggleTabs={toggleTabs} />
        </div>
        {activeTab === 'builder' && (
          <div className="flex flex-row items-center gap-4">
            <Form.Field
              control={control}
              name="status"
              render={({ field }) => (
                <Form.Item className="flex flex-row items-center gap-2">
                  <Label htmlFor="mode">InActive</Label>
                  <Switch
                    id="mode"
                    onCheckedChange={(open) =>
                      field.onChange(open ? 'active' : 'draft')
                    }
                    checked={field.value === 'active'}
                  />
                </Form.Item>
              )}
            />

            <Button variant="secondary" onClick={toggleSideBarOpen}>
              <IconCategory2 />
              {`${isOpenSideBar ? 'Hide Menu' : 'Show Menu'}`}
            </Button>
          </div>
        )}
      </PageSubHeader>
      <PageSubHeader className="sm:hidden flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <Form.Field
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Form.Item>
                <Input
                  placeholder={
                    fieldState.error
                      ? fieldState.error.message
                      : 'Automation name'
                  }
                  className={'w-64'}
                  {...field}
                />
              </Form.Item>
            )}
          />
          {/* <Tabs defaultValue={activeTab}> */}
          <AutomationTabs toggleTabs={toggleTabs} />
          {/* </Tabs> */}
        </div>

        {activeTab === 'builder' && (
          <div className="flex flex-row justify-between items-center">
            <Form.Field
              control={control}
              name="status"
              render={({ field }) => (
                <Form.Item>
                  <Form.Control>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="mode">InActive</Label>
                      <Switch
                        id="mode"
                        onCheckedChange={(open) =>
                          field.onChange(open ? 'active' : 'draft')
                        }
                        checked={field.value === 'active'}
                      />
                    </div>
                  </Form.Control>
                </Form.Item>
              )}
            />
            <Button variant="secondary" onClick={toggleSideBarOpen}>
              <IconCategory2 />
              {`${isOpenSideBar ? 'Show Menu' : 'Hide Menu'}`}
            </Button>
          </div>
        )}
      </PageSubHeader>
    </div>
  );
};

const AutomationTabs = ({
  toggleTabs,
}: {
  toggleTabs: (tab: 'builder' | 'history') => void;
}) => {
  return (
    <Tabs.List size="sm" className="h-8 ">
      <Tabs.Trigger
        size="sm"
        value="builder"
        className="h-8 py-2 px-6"
        onClick={() => toggleTabs('builder')}
      >
        Builder
      </Tabs.Trigger>
      <Tabs.Trigger
        size="sm"
        value="history"
        className="h-8 py-2 px-6"
        onClick={() => toggleTabs('history')}
      >
        History
      </Tabs.Trigger>
    </Tabs.List>
  );
};
