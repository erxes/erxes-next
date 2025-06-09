import {
  AUTOMATION_CREATE,
  AUTOMATION_EDIT,
} from '@/automations/graphql/automationMutations';
import { useMutation } from '@apollo/client';
import {
  IconAffiliate,
  IconCategory2,
  IconSettings,
} from '@tabler/icons-react';
import { useReactFlow } from '@xyflow/react';
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
import { useQueryState, useToast } from 'erxes-ui/hooks';
import { SubmitErrorHandler, useFormContext } from 'react-hook-form';
import { Link, useParams } from 'react-router';
import { TAutomationProps } from '../../utils/AutomationFormDefinitions';
import { PageHeader } from 'ui-modules';
import { PageSubHeader } from 'erxes-ui';

export const AutomationBuilderHeader = ({ reactFlowInstance }: any) => {
  const { control, watch, setValue, handleSubmit, clearErrors } =
    useFormContext<TAutomationProps>();
  const [_, setActiveTabParams] = useQueryState('activeTab');

  const { getNodes, setNodes } = useReactFlow();
  const { toast } = useToast();

  const activeTab = watch('activeTab');
  const isMinimized = watch('isMinimized');
  const detail = watch('detail');
  const {
    triggers = [],
    actions = [],
    name = '',
    status = 'draft',
  } = detail || {};

  const { id } = useParams();
  const [save, { loading }] = useMutation(
    id ? AUTOMATION_EDIT : AUTOMATION_CREATE,
  );

  const handleSave = (values: TAutomationProps) => {
    const generateValues = () => {
      const finalValues = {
        id,
        name,
        status: status,
        triggers: triggers.map((t: any) => ({
          id: t.id,
          type: t.type,
          config: t.config,
          icon: t.icon,
          label: t.label,
          description: t.description,
          actionId: t.actionId,
          position: t.position,
          isCustom: t.isCustom,
          workflowId: t.workflowId,
        })),
        actions: actions.map((a: any) => ({
          id: a.id,
          type: a.type,
          nextActionId: a.nextActionId,
          config: a.config,
          icon: a.icon,
          label: a.label,
          description: a.description,
          position: a.position,
          workflowId: a.workflowId,
        })),
      };

      return finalValues;
    };

    return save({ variables: generateValues() }).then(() => {
      clearErrors();
    });
  };

  const handleError: SubmitErrorHandler<TAutomationProps> = ({
    detail: errors,
  }) => {
    const { triggers = [], actions = [] } = watch('detail');
    const nodes = getNodes();
    const { triggers: triggersErrors, actions: actionsErrors } = errors || {};

    const nodeErrorMap: Record<string, string> = {};

    for (const { errors, list = [] } of [
      { errors: triggersErrors, list: triggers },
      { errors: actionsErrors, list: actions },
    ]) {
      if (Array.isArray(errors)) {
        errors.forEach((err, i) => {
          if (err && list[i]?.id) {
            const nodeId = list[i].id;
            const errorKeys = Object.keys(err);
            nodeErrorMap[nodeId] =
              errorKeys.length === 1
                ? err[errorKeys[0]]?.message
                : JSON.stringify(err);
          }
        });
      }
    }

    if (Object.keys(nodeErrorMap).length > 0) {
      const updatedNodes = nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          error: nodeErrorMap[node.id],
        },
      }));

      setNodes(updatedNodes);

      // Focus on first error node
      const firstErrorNode = updatedNodes.find((n) => nodeErrorMap[n.id]);
      if (firstErrorNode && reactFlowInstance) {
        reactFlowInstance.fitView({
          nodes: [firstErrorNode],
          duration: 800,
        });
      }
    } else {
      const errorKeys = Object.keys(errors || {});
      if (errorKeys?.length > 0) {
        const errorMessage = (errors as Record<string, { message?: string }>)[
          errorKeys[0]
        ]?.message;
        toast({
          title: 'Error',
          description: errorMessage,
        });
      }
    }
  };

  const toggleTabs = (value: 'builder' | 'history') => {
    setValue('activeTab', value);
    setActiveTabParams(value);
  };

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
