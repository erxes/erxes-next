import { cn, Combobox, Command, Form, Popover, useQueryState } from 'erxes-ui';
import React, { createContext, useContext, useState } from 'react';
import { ActionsInline } from 'ui-modules/modules/permissions/components/ActionsInline';
import { usePermissionsActions } from 'ui-modules/modules/permissions/hooks/usePermissions';
import { IPermissionAction } from 'ui-modules/modules/permissions/types/permission';

export interface ISelectActionsContext {
  onSelect: (action: IPermissionAction) => void;
  actions?: IPermissionAction[];
  actionsNames?: string[];
  setActions?: (actions: IPermissionAction[]) => void;
  loading: boolean;
  error: string | null;
}

export const SelectActionsContext = createContext<ISelectActionsContext | null>(
  null,
);

export const useSelectActionsContext = () => {
  const context = useContext(SelectActionsContext);

  if (!context) {
    throw new Error(
      'useSelectActionsContext must be used within a SelectActionsContext',
    );
  }

  return context;
};

export const SelectActionsProvider = ({
  children,
  mode = 'single',
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange?: (value: string[] | string) => void;
}) => {
  const [actions, setActions] = useState<IPermissionAction[]>([]);
  const isSingleMode = mode === 'single';

  const onSelect = (action: IPermissionAction) => {
    if (!action) {
      return;
    }

    if (isSingleMode) {
      setActions([action]);
      return onValueChange?.(action.name);
    }
    const arrayValue = Array.isArray(value) ? value : [];

    const isActionsSelected = arrayValue.includes(action.name);
    const newSelectedActionNames = isActionsSelected
      ? arrayValue.filter((name) => name !== action.name)
      : [...arrayValue, action.name];

    setActions(actions.filter((a) => newSelectedActionNames.includes(a.name)));
    onValueChange?.(newSelectedActionNames);
  };

  return (
    <SelectActionsContext.Provider
      value={{
        actions,
        setActions,
        actionsNames: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectActionsContext.Provider>
  );
};

const SelectActionsValue = () => {
  const { actions, actionsNames, setActions } = useSelectActionsContext();

  return (
    <ActionsInline
      actions={actions as IPermissionAction[]}
      actionsNames={actionsNames}
      updateActions={setActions}
    />
  );
};

export const SelectActionsContent = () => {
  const { actionsNames, onSelect } = useSelectActionsContext();
  const [module] = useQueryState<string>('module');

  const { actions, loading, error } = usePermissionsActions();
  const actionsData =
    actions &&
    actions?.length > 0 &&
    actions.filter((a) => a.module === module);

  return (
    <Command shouldFilter={false}>
      <Command.List className="max-h-[300px] overflow-y-auto">
        <Combobox.Empty loading={loading} error={error} />
        {actionsData && actionsData?.length > 0 && (
          <>
            {actionsData.map((action) => (
              <Command.Item
                key={action.name}
                value={action.name}
                onSelect={() => onSelect(action)}
              >
                {action.name}
                <Combobox.Check checked={actionsNames?.includes(action.name)} />
              </Command.Item>
            ))}
          </>
        )}
      </Command.List>
    </Command>
  );
};

export const SelectActionsFormItem = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectActionsProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <SelectActionsProvider
      {...props}
      onValueChange={(value) => {
        props.mode === 'single' && setOpen(false);
        props.onValueChange?.(value);
      }}
    >
      <Popover onOpenChange={setOpen} open={open}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full', className)}>
            <SelectActionsValue />
          </Combobox.Trigger>
        </Form.Control>

        <Combobox.Content>
          <SelectActionsContent />
        </Combobox.Content>
      </Popover>
    </SelectActionsProvider>
  );
};

export const SelectActions = {
  Provider: SelectActionsProvider,
  Value: SelectActionsValue,
  Content: SelectActionsContent,
  FormItem: SelectActionsFormItem,
};
