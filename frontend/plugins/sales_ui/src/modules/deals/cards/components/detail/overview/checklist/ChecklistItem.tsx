import { Button, Collapsible, Spinner, cn, useConfirm } from 'erxes-ui';
import { IChecklist, IChecklistItem } from '@/deals/types/checklists';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  useChecklistItemsAdd,
  useChecklistItemsReorder,
  useChecklistsRemove,
} from '@/deals/cards/hooks/useChecklists';

import ChecklistItemContent from './ChecklistItemContent';
import CircularProgressbar from '@/deals/components/common/CircularProgressbar';
import SortableList from '@/deals/components/common/SortableList';
import { useState } from 'react';

// import {
//   useChecklistItemsAdd,
//   useChecklists,
// } from '@/deals/cards/hooks/useChecklists';

const ChecklistItem = ({ item }: { item: IChecklist }) => {
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<IChecklistItem[]>(item.items);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [hideChecked, setHideChecked] = useState(false);

  const { salesChecklistItemsAdd } = useChecklistItemsAdd();
  const { salesChecklistItemsReorder } = useChecklistItemsReorder();
  const { salesChecklistsRemove, salesChecklistsRemoveLoading } =
    useChecklistsRemove();
  const { confirm } = useConfirm();

  // Calculate completed percentage for progress bar
  const checkedCount = items.filter((i) => i.isChecked).length;

  // Add multiple items from textarea, split by newline
  const handleAdd = () => {
    const lines = newItem
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((content, i) => ({
        _id: (Date.now() + i).toString(),
        content,
        isChecked: false,
        checklistId: item._id,
      }));

    if (lines.length > 0) {
      setItems((prev) => [...prev, ...lines]);
      setNewItem('');
      setAdding(false);
      salesChecklistItemsAdd({
        variables: {
          checklistId: item._id,
          content: newItem,
        },
      });
    }
  };

  // For keyboard enter submit on textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const onReorderItems = (reOrderedItems: IChecklistItem[]) => {
    setItems(reOrderedItems);

    const movedItem = reOrderedItems.find(
      (_, index) => items[index]._id !== reOrderedItems[index]._id,
    );

    if (!movedItem) return;

    const destinationIndex = reOrderedItems.findIndex(
      (i) => i._id === movedItem._id,
    );

    salesChecklistItemsReorder({
      variables: {
        destinationIndex,
        _id: movedItem._id,
      },
    });
  };

  const onDeleteChecklist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    confirm({
      message: `Are you sure you want to delete ${item.title}?`,
    }).then(() => {
      salesChecklistsRemove({
        variables: {
          _id: id,
        },
      });
    });
  };
  console.log('aaa', item);
  return (
    <Collapsible className="checklists" open={open} onOpenChange={setOpen}>
      <Collapsible.TriggerButton className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Collapsible.TriggerIcon className="group-data-[state=open]/checklists:rotate-180" />
          {item.title}
          <CircularProgressbar
            value={checkedCount}
            max={items.length || 1}
            size={20}
            strokeWidth={3}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            // onClick={() => onToggleHideChecked(item._id)}
            className="text-xs px-2 py-1 rounded hover:bg-gray-100 border text-gray-600"
          >
            {hideChecked ? 'Show All' : 'Hide Checked'}
          </button>

          <Button
            variant="destructive"
            onClick={(e) => onDeleteChecklist(e, item._id)}
            title="Delete checklist"
            size="sm"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className={cn(salesChecklistsRemoveLoading && 'opacity-50')}
          >
            <IconTrash />{' '}
            {salesChecklistsRemoveLoading ? <Spinner /> : 'Delete'}
          </Button>
        </div>
      </Collapsible.TriggerButton>

      <Collapsible.Content className="flex flex-col gap-1 py-1 pl-1">
        <SortableList
          items={items}
          onReorder={(items) => onReorderItems(items)}
          itemKey="_id"
          className="flex flex-col gap-1"
          renderItem={(item: IChecklistItem, index: number) => (
            <ChecklistItemContent
              item={item}
              index={index}
              setItems={setItems}
            />
          )}
        />

        {adding ? (
          <div className="flex flex-col gap-2 p-2">
            <textarea
              className="border border-gray-300 rounded px-2 py-1 text-sm w-full resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter items, each on a new line"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setNewItem('');
                }}
                className="px-3 py-1 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-1 p-2 cursor-pointer hover:bg-gray-100 select-none"
            onClick={() => setAdding(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setAdding(true);
              }
            }}
          >
            <IconPlus size={14} />
            Add an item
          </div>
        )}
      </Collapsible.Content>
    </Collapsible>
  );
};

export default ChecklistItem;
