import {
  IconAffiliate,
  IconCategory2,
  IconSettings,
} from '@tabler/icons-react';
import { PageSubHeader } from 'erxes-ui';
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Label,
  Separator,
  Spinner,
  Switch,
  Tabs,
} from 'erxes-ui/components';
import { Link } from 'react-router';
import { PageHeader } from 'ui-modules';
import { useAutomationHeader } from './hooks/useAutomationHeader';

export const AutomationBuilderHeader = ({ reactFlowInstance }: any) => {
  const {
    control,
    loading,
    isMinimized,
    handleSubmit,
    handleSave,
    handleError,
    activeTab,
    toggleTabs,
    setValue,
  } = useAutomationHeader(reactFlowInstance);
  return (
    <>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <IconAffiliate className="w-5 h-5" />
                <span className="font-medium">
                  <Link to={`/automations`}>Automations</Link>
                </span>
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
      <PageSubHeader className="flex items-center justify-between">
        <div className="flex items-center space-x-2 gap-8">
          <Form.Field
            control={control}
            name="detail.name"
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

          <Tabs defaultValue={activeTab}>
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
          </Tabs>
        </div>
        {activeTab === 'builder' && (
          <div className="flex flex-row items-center space-x-2 gap-4">
            <Form.Field
              control={control}
              name="detail.status"
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

            <Button
              variant="secondary"
              onClick={() => setValue('isMinimized', !isMinimized)}
            >
              <IconCategory2 />
              {`${isMinimized ? 'Show Menu' : 'Hide Menu'}`}
            </Button>
          </div>
        )}
      </PageSubHeader>
    </>
  );
};
