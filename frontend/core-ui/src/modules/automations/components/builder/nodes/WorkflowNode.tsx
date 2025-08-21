import { useNodeDropDownActions } from '@/automations/components/builder/nodes/hooks/useNodeDropDownActions';
import { NodeRemoveActionDialog } from '@/automations/components/builder/nodes/NodeDropdownActions';
import { WorkflowActionMapper } from '@/automations/components/builder/nodes/WorkflowActionMapper';
import {
  AutomationNodesType,
  NodeData,
  WorkflowNodeData,
} from '@/automations/types';
import {
  IconArrowsSplit2,
  IconDotsVertical,
  IconEdit,
} from '@tabler/icons-react';
import { Node, NodeProps } from '@xyflow/react';
import { Button, cn, Dialog, DropdownMenu, Sheet } from 'erxes-ui';
import { Dispatch, memo, SetStateAction } from 'react';

const WorkflowNode = ({
  data,
  selected,
  id,
}: NodeProps<Node<NodeData & WorkflowNodeData>>) => {
  const {
    fieldName,
    isOpenDialog,
    isOpenDropDown,
    setOpenDropDown,
    onRemoveNode,
    setOpenDialog,
  } = useNodeDropDownActions(id, data.nodeType);

  return (
    <div className="flex flex-col">
      <div className="w-2/5 ml-1 bg-warning/10 text-warning text-center px-2 py-1 rounded-t-md">
        <p className="font-medium font-bold">Workflow</p>
      </div>
      <div
        className={cn(
          'rounded-md shadow-md bg-background w-[280px] relative font-mono',
          selected ? 'ring-2 ring-warning ring-offset-2' : '',
          'transition-all duration-200',
          data?.error ? 'ring-2 ring-red-300 ring-offset-2' : '',
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-slate-200 gap-8">
          <div className="flex items-center gap-2 text-warning">
            <div className="size-6 rounded-full flex items-center justify-center">
              <IconArrowsSplit2 />
            </div>
            <p className="font-medium">{data.label}</p>
          </div>

          <div className="flex items-center gap-1">
            <DropdownMenu
              open={isOpenDropDown || isOpenDialog}
              onOpenChange={(open) => {
                if (!isOpenDialog) {
                  setOpenDropDown(open);
                }
              }}
            >
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-42">
                <WorkflowActionSelectorDialog
                  isOpenDialog={isOpenDialog}
                  setOpenDialog={setOpenDialog}
                  data={data}
                  id={id}
                  fieldName={fieldName}
                />
                <DropdownMenu.Item asChild>
                  <NodeRemoveActionDialog onRemoveNode={onRemoveNode} />
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-3">
          <span className="text-xs text-accent-foreground ">
            {data.description}
          </span>
        </div>
      </div>
    </div>
  );
};

const WorkflowActionSelectorDialog = ({
  isOpenDialog,
  setOpenDialog,
  data,
  id,
  fieldName,
}: {
  isOpenDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  data: WorkflowNodeData;
  id: string;
  fieldName:
    | AutomationNodesType.Triggers
    | AutomationNodesType.Actions
    | AutomationNodesType.Workflows;
}) => {
  return (
    <Sheet
      open={isOpenDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);
      }}
    >
      <Sheet.Trigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <IconEdit className="size-4" />
          Select Actions
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="p-0 md:w-[calc(100vw-theme(spacing.4))] flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none sm:max-w-screen-2xl">
        <Sheet.Header>
          <Sheet.Title>Workflow</Sheet.Title>
          <Sheet.Description>
            Select workflow action for connection
          </Sheet.Description>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Content>
          {isOpenDialog && <WorkflowActionMapper id={data.automationId} />}
        </Sheet.Content>
      </Sheet.View>
    </Sheet>
  );
};

export default memo(WorkflowNode);
