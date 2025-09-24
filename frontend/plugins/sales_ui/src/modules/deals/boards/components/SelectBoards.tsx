import {
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  TextOverflowTooltip,
  cn,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { IBoard, ISelectBoardsProviderProps } from '@/deals/types/boards';
import React, { useState } from 'react';
import {
  SelectBoardsContext,
  useSelectBoardsContext,
} from '@/deals/context/DealContext';

import { IconBlocks } from '@tabler/icons-react';
import { useBoards } from '@/deals/boards/hooks/useBoards';

export const SelectBoardsProvider = ({
  children,
  value,
  onValueChange,
}: ISelectBoardsProviderProps) => {
  const [, setSelectedBoardName] = useState<string | string[]>('');
  const [selectedBoard, setSelectedBoard] = useState<IBoard>();

  const onSelect = (board: IBoard) => {
    if (!board) {
      return;
    }

    setSelectedBoard(board);
    setSelectedBoardName(board.name);
    onValueChange?.(board.name);
  };

  return (
    <SelectBoardsContext.Provider
      value={{
        selectedBoard,
        setSelectedBoard,
        selectedBoardName: !value ? '' : value,
        onSelect,
      }}
    >
      {children}
    </SelectBoardsContext.Provider>
  );
};

const SelectBoardsValue = () => {
  const { selectedBoardName } = useSelectBoardsContext();

  return (
    <Combobox.Value placeholder="Select Board" value={selectedBoardName} />
  );
};

const SelectBoardsCommand = () => {
  const { onSelect, selectedBoardName } = useSelectBoardsContext();
  const { boards, loading, error } = useBoards();

  return (
    <Command shouldFilter={false}>
      <Command.List className="max-h-[300px] overflow-y-auto">
        <Combobox.Empty loading={loading} error={error} />
        {boards &&
          boards.map((board) => (
            <Command.Item
              key={board.name}
              value={board.name}
              onSelect={() => onSelect(board)}
            >
              <TextOverflowTooltip
                value={board.name}
                className="flex-auto w-auto font-medium"
              />
              <Combobox.Check checked={selectedBoardName === board.name} />
            </Command.Item>
          ))}
      </Command.List>
    </Command>
  );
};

export const SelectBoardsFormItem = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectBoardsProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <SelectBoardsProvider
      {...props}
      onValueChange={(value) => {
        setOpen(false);
        props.onValueChange?.(value);
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full', className)}>
            <SelectBoardsValue />
          </Combobox.Trigger>
        </Form.Control>
        <Combobox.Content>
          <SelectBoardsCommand />
        </Combobox.Content>
      </Popover>
    </SelectBoardsProvider>
  );
};

const SelectBoardsFilterItem = () => {
  return (
    <Filter.Item value="board">
      <IconBlocks />
      Board
    </Filter.Item>
  );
};

const SelectBoardsFilterView = () => {
  const [board, setBoard] = useQueryState<string>('board');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey="board">
      <SelectBoardsProvider
        value={board || ''}
        onValueChange={(value) => {
          setBoard(value as string);
          resetFilterState();
        }}
      >
        <SelectBoardsCommand />
      </SelectBoardsProvider>
    </Filter.View>
  );
};

const SelectBoardsFilterBarItem = () => {
  const [board, setBoard] = useQueryState<string>('board');
  const { resetFilterState } = useFilterContext();
  const [open, setOpen] = useState(false);

  return (
    <Filter.BarItem queryKey="board">
      <Filter.BarName>
        <IconBlocks />
        Board
      </Filter.BarName>
      <SelectBoardsProvider
        value={board as string}
        onValueChange={(value) => {
          setBoard(value as string);
          resetFilterState();
          setOpen(false);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey="board" className="rounded-l">
              <SelectBoardsValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectBoardsCommand />
          </Combobox.Content>
        </Popover>
      </SelectBoardsProvider>
    </Filter.BarItem>
  );
};

export const SelectBoards = {
  Provider: SelectBoardsProvider,
  Value: SelectBoardsValue,
  Command: SelectBoardsCommand,
  FormItem: SelectBoardsFormItem,
  FilterItem: SelectBoardsFilterItem,
  FilterView: SelectBoardsFilterView,
  BarItem: SelectBoardsFilterBarItem,
};
