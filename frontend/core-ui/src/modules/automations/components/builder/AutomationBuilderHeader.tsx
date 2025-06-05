import {
  AUTOMATION_CREATE,
  AUTOMATION_EDIT,
} from '@/automations/graphql/automationMutations';
import { useMutation } from '@apollo/client';
import { IconCategory2 } from '@tabler/icons-react';
import { useReactFlow } from '@xyflow/react';
import {
  Button,
  Form,
  Input,
  Label,
  Spinner,
  Switch,
  Tabs,
} from 'erxes-ui/components';
import { useToast } from 'erxes-ui/hooks';
import { SubmitErrorHandler, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
import { TAutomationProps } from '../../utils/AutomationFormDefinitions';

export default ({ reactFlowInstance }: any) => {
  const { control, watch, setValue, handleSubmit, clearErrors } =
    useFormContext<TAutomationProps>();

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
      console.log({ errorKeys });
      if (errorKeys?.length > 0) {
        const errorMessage = (errors as Record<string, { message?: string }>)[
          errorKeys[0]
        ]?.message;
        console.log({ errorMessage });
        toast({
          title: 'Error',
          description: errorMessage,
        });
      }
    }
  };

  return (
    <div className="h-12 border-b px-4">
      <div className="flex items-center justify-between h-full">
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
            <Form.Field
              control={control}
              name="activeTab"
              render={({ field }) => (
                <Form.Item>
                  <Form.Control>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="mode">InActive</Label>
                      <Switch
                        id="mode"
                        onCheckedChange={field.onChange}
                        checked={!!field.value}
                      />
                    </div>
                  </Form.Control>
                </Form.Item>
              )}
            />
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
        <Button
          disabled={loading}
          onClick={handleSubmit(handleSave, handleError)}
        >
          {loading ? <Spinner /> : `Save`}
        </Button>
      </div>
    </div>
  );
};
