import { IconDotsVertical, IconEdit } from '@tabler/icons-react';
import { AlertDialog, Button, Dialog, DropdownMenu } from 'erxes-ui';
import {IconTrash} from '@tabler/icons-react';
import { useState } from 'react';
import { useFormContext, UseFormSetValue } from 'react-hook-form';
import { NodeData } from '../../../types';
import { EditForm } from './EditNodeForm';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';

const fields = {
  trigger: 'triggers',
  action: 'actions',
};

export const NodeDropdownActions = ({
  id,
  data,
  setValue,
}: {
  id: string;
  data: NodeData;
  setValue: UseFormSetValue<TAutomationProps>;
}) => {
  const { getValues } = useFormContext<TAutomationProps>();
  const [isOpenDropDown, setOpenDropDown] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);
  const nodeType = data.nodeType;

  const fieldName = fields[nodeType] as 'triggers' | 'actions';

  const onRemove = () => {
    const nodes = getValues(`detail.${fieldName}`);

    setValue(
      `detail.${fieldName}`,
      nodes.filter((node) => node.id !== id),
    );
  };

  return (
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
          <IconDotsVertical className="w-4 h-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-42">
        <DropdownMenu.Item asChild>
          <Dialog
            open={isOpenDialog}
            onOpenChange={(open) => {
              setOpenDialog(open);
            }}
          >
            <Dialog.Trigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <IconEdit className="w-4 h-4" />
                Edit
              </Button>
            </Dialog.Trigger>
            <EditForm
              id={id}
              fieldName={fieldName}
              data={data}
              setValue={setValue}
              callback={() => setOpenDialog(false)}
            />
          </Dialog>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <AlertDialog>
            <AlertDialog.Trigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <IconTrash className="h-4 w-4 text-red-500" />
                Delete
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                <AlertDialog.Description>
                  This action cannot be undone.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action onClick={onRemove}>
                  Continue
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
