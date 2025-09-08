import {
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  PopoverScoped,
  SelectTree,
  TextOverflowTooltip,
  cn,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import {
  CreateBoardForm,
  SelectBoardsCreateContainer,
} from './CreateBoardForm';
import { IBoard, ISelectBoardsProviderProps } from '@/deals/types/boards';
import { IconFolder, IconPlus } from '@tabler/icons-react';
import React, { useState } from 'react';
import {
  SelectBoardsContext,
  useSelectBoardsContext,
} from '@/deals/context/DealContext';

import { BoardBadge } from './BoardBadge';
import { useBoards } from '../hooks/useBoards';
import { useDebounce } from 'use-debounce';

export const SelectBoardsProvider = ({
  children,
  value,
  onValueChange,
  mode = 'single',
}: ISelectBoardsProviderProps) => {
  const [newBoardName, setNewBoardName] = useState<string>('');
  const [selectedBoards, setSelectedBoards] = useState<IBoard[]>([]);

  const handleSelectCallback = (board: IBoard) => {
    if (!board) return;

    const isSingleMode = mode === 'single';
    const multipleValue = (value as string[]) || [];
    const isSelected = !isSingleMode && multipleValue.includes(board._id);

    const newSelectedBoardIds = isSingleMode
      ? [board._id]
      : isSelected
      ? multipleValue.filter((d) => d !== board._id)
      : [...multipleValue, board._id];

    const newSelectedBoards = isSingleMode
      ? [board]
      : isSelected
      ? selectedBoards.filter((d) => d._id !== board._id)
      : [...selectedBoards, board];

    setSelectedBoards(newSelectedBoards);
    onValueChange?.(isSingleMode ? board._id : newSelectedBoardIds);
  };

  return (
    <SelectBoardsContext.Provider
      value={{
        onSelect: handleSelectCallback,
        value,
        selectedBoards,
        setSelectedBoards,
        newBoardName,
        setNewBoardName,
        mode,
      }}
    >
      {children}
    </SelectBoardsContext.Provider>
  );
};

export const SelectBoardsCommand = ({
  disableCreateOption,
}: {
  disableCreateOption?: boolean;
}) => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { selectedBoards } = useSelectBoardsContext();
  const [noBoardsSearchValue, setNoBoardsSearchValue] = useState<string>('');

  const {
    boards,
    loading,
    error,
    // handleFetchMore,
    // totalCount,
  } = useBoards({
    variables: {
      searchValue: debouncedSearch,
    },
    skip:
      !!noBoardsSearchValue && debouncedSearch.includes(noBoardsSearchValue),
    onCompleted(data) {
      // const { totalCount = 0 } = data?.salesBoards || {};
      setNoBoardsSearchValue('');
    },
  });

  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Search Boards"
        focusOnMount
      />
      <Command.Empty>No boards found</Command.Empty>
      <Command.List>
        <SelectTree.Provider id={'select-Boards'} ordered={!search}>
          <SelectBoardsCreate
            search={search}
            show={!disableCreateOption && !loading && !boards?.length}
          />
          <Combobox.Empty loading={loading} error={error} />
          {boards?.map((board) => (
            <SelectBoardsItem
              key={board._id}
              board={{
                ...board,
                hasChildren: false,
              }}
            />
          ))}
          {/* <Combobox.FetchMore
            fetchMore={handleFetchMore}
            currentLength={boards?.length || 0}
            totalCount={totalCount}
          /> */}
        </SelectTree.Provider>
      </Command.List>
    </Command>
  );
};

export const SelectBoardsCreate = ({
  search,
  show,
}: {
  search: string;
  show: boolean;
}) => {
  const { setNewBoardName } = useSelectBoardsContext();

  if (!search || !show) return null;

  return (
    <Command.Item
      onSelect={() => setNewBoardName(search)}
      className="font-medium"
    >
      <IconPlus />
      Create new board: "{search}"
    </Command.Item>
  );
};

export const SelectBoardsItem = ({
  board,
}: {
  board: IBoard & { hasChildren: boolean };
}) => {
  const { onSelect, selectedBoards } = useSelectBoardsContext();
  const isSelected = selectedBoards.some((d) => d._id === board._id);
  return (
    <SelectTree.Item
      key={board._id}
      _id={board._id}
      name={board.name}
      order={'1'}
      hasChildren={board.hasChildren}
      selected={isSelected}
      onSelect={() => onSelect(board)}
    >
      <TextOverflowTooltip
        value={board.name}
        className="flex-auto w-auto font-medium"
      />
    </SelectTree.Item>
  );
};

export const BoardsList = ({
  placeholder,
  renderAsPlainText,
  ...props
}: Omit<React.ComponentProps<typeof BoardBadge>, 'onClose'> & {
  placeholder?: string;
  renderAsPlainText?: boolean;
}) => {
  const { value, selectedBoards, setSelectedBoards, onSelect } =
    useSelectBoardsContext();

  const selectedBoardIds = Array.isArray(value) ? value : [value];

  if (!value || !value.length) {
    return <Combobox.Value placeholder={placeholder || ''} />;
  }
  console.log('sss', selectedBoardIds);
  return (
    <>
      {selectedBoardIds.map((boardId) => (
        <BoardBadge
          key={boardId}
          boardId={boardId}
          board={selectedBoards.find((d) => d._id === boardId)}
          renderAsPlainText={renderAsPlainText}
          variant={'secondary'}
          onCompleted={(board) => {
            console.log('board', board);
            if (!board) return;
            if (selectedBoardIds.includes(board._id)) {
              setSelectedBoards([...selectedBoards, board]);
            }
          }}
          onClose={() =>
            onSelect?.(selectedBoards.find((d) => d._id === boardId) as IBoard)
          }
          {...props}
        />
      ))}
    </>
  );
};

export const SelectBoardsValue = () => {
  const { selectedBoards, mode } = useSelectBoardsContext();

  if (selectedBoards?.length > 1)
    return (
      <span className="text-muted-foreground">
        {selectedBoards.length} Boards selected
      </span>
    );

  return (
    <BoardsList
      placeholder="Select Boards"
      renderAsPlainText={mode === 'single'}
    />
  );
};

export const SelectBoardsContent = () => {
  const { newBoardName } = useSelectBoardsContext();

  if (newBoardName) {
    return (
      <SelectBoardsCreateContainer>
        <CreateBoardForm />
      </SelectBoardsCreateContainer>
    );
  }
  return <SelectBoardsCommand />;
};

// export const SelectBoardsInlineCell = ({
//   onValueChange,
//   scope,
//   ...props
// }: Omit<React.ComponentProps<typeof SelectBoardsProvider>, 'children'> & {
//   scope?: string;
// }) => {
//   const [open, setOpen] = useState<boolean>(false);

//   return (
//     <SelectBoardsProvider
//       onValueChange={(value) => {
//         onValueChange?.(value);
//         setOpen(false);
//       }}
//       {...props}
//     >
//       <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
//         <RecordTableCellTrigger>
//           <SelectBoardsValue />
//         </RecordTableCellTrigger>
//         <RecordTableCellContent className="min-w-72">
//           <SelectBoardsContent />
//         </RecordTableCellContent>
//       </RecordTablePopover>
//     </SelectBoardsProvider>
//   );
// };

export const SelectBoardsDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectBoardsProvider>, 'children'> &
    Omit<
      React.ComponentPropsWithoutRef<typeof Combobox.Trigger>,
      'children'
    > & {
      scope?: string;
    }
>(({ onValueChange, scope, value, mode, options, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectBoardsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...{ value, mode, options }}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <Combobox.Trigger ref={ref} {...props}>
          <SelectBoardsValue />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectBoardsContent />
        </Combobox.Content>
      </PopoverScoped>
    </SelectBoardsProvider>
  );
});

SelectBoardsDetail.displayName = 'SelectBoardsDetail';

// export const SelectBoardsCommandbarItem = ({
//   onValueChange,
//   ...props
// }: Omit<React.ComponentProps<typeof SelectBoardsProvider>, 'children'>) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <SelectBoardsProvider
//       onValueChange={(value) => {
//         onValueChange?.(value);
//         setOpen(false);
//       }}
//       {...props}
//     >
//       <RecordTablePopover open={open} onOpenChange={setOpen}>
//         <Button variant={'secondary'} asChild>
//           <RecordTableCellTrigger>
//             <IconFolder />
//             Department
//           </RecordTableCellTrigger>
//         </Button>
//         <RecordTableCellContent className="w-96">
//           <SelectBoardsContent />
//         </RecordTableCellContent>
//       </RecordTablePopover>
//     </SelectBoardsProvider>
//   );
// };

export const SelectBoardsFormItem = ({
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectBoardsProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <SelectBoardsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full shadow-xs', className)}>
            <SelectBoardsValue />
          </Combobox.Trigger>
        </Form.Control>

        <Combobox.Content>
          <SelectBoardsContent />
        </Combobox.Content>
      </Popover>
    </SelectBoardsProvider>
  );
};

export const SelectBoardsFilterItem = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  return (
    <Filter.Item value={value}>
      <IconFolder />
      {label}
    </Filter.Item>
  );
};

export const SelectBoardsFilterView = ({
  mode,
  filterKey,
}: {
  mode: 'single' | 'multiple';
  filterKey: string;
}) => {
  const [query, setQuery] = useQueryState<string[] | string | undefined>(
    filterKey,
  );
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={filterKey}>
      <SelectBoardsProvider
        mode={mode}
        value={query || []}
        onValueChange={(value) => {
          setQuery(value);
          resetFilterState();
        }}
      >
        <SelectBoardsContent />
      </SelectBoardsProvider>
    </Filter.View>
  );
};

export const SelectBoardsFilterBar = ({
  mode = 'multiple',
  filterKey,
  label,
}: {
  mode: 'single' | 'multiple';
  filterKey: string;
  label: string;
}) => {
  const [query, setQuery] = useQueryState<string[]>(filterKey);
  const [open, setOpen] = useState<boolean>(false);

  if (!query) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconFolder />
        {label}
      </Filter.BarName>
      <SelectBoardsProvider
        mode={mode}
        value={query || []}
        onValueChange={(value) => {
          if (value && value.length > 0) {
            setQuery(value as string[]);
          } else {
            setQuery(null);
          }
          setOpen(false);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={filterKey}>
              <SelectBoardsValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectBoardsContent />
          </Combobox.Content>
        </Popover>
      </SelectBoardsProvider>
      <Filter.BarClose filterKey={filterKey} />
    </Filter.BarItem>
  );
};

export const SelectBoards = Object.assign(SelectBoardsProvider, {
  // CommandBarItem: SelectBoardsCommandbarItem,
  Content: SelectBoardsContent,
  Command: SelectBoardsCommand,
  Item: SelectBoardsItem,
  Value: SelectBoardsValue,
  List: BoardsList,
  // InlineCell: SelectBoardsInlineCell,
  FormItem: SelectBoardsFormItem,
  FilterItem: SelectBoardsFilterItem,
  FilterView: SelectBoardsFilterView,
  FilterBar: SelectBoardsFilterBar,
  Detail: SelectBoardsDetail,
});
