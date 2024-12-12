import { Button, NestedDropdownMenu } from 'erxes-ui/components';
import {
  Building2,
  GanttChartIcon as ChartNoAxesGantt,
  CircleCheck,
  HashIcon,
  HistoryIcon,
  TextIcon as LetterText,
  PlusIcon,
  TagsIcon,
  Eye,
  EyeOff,
  GripVertical,
  MenuIcon,
} from 'lucide-react';
import { IconCurrencyTugrik } from '@tabler/icons-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState, useCallback } from 'react';

interface FieldItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
}

const initialFields: FieldItem[] = [
  { id: 'name', icon: <LetterText className="h-4 w-4" />, label: 'Name' },
  {
    id: 'code',
    icon: <HashIcon className="h-4 w-4" />,
    label: 'Code',
  },
  {
    id: 'price',
    icon: <IconCurrencyTugrik className="h-4 w-4" />,
    label: 'Price',
  },
  {
    id: 'category',
    icon: <ChartNoAxesGantt className="h-4 w-4" />,
    label: 'Category',
  },
  { id: 'status', icon: <CircleCheck className="h-4 w-4" />, label: 'Status' },
  {
    id: 'created at',
    icon: <HistoryIcon className="h-4 w-4" />,
    label: 'Created At',
  },
  {
    id: 'tags',
    icon: <TagsIcon className="h-4 w-4" />,
    label: 'Tags',
  },
  {
    id: 'vendor',
    icon: <Building2 className="h-4 w-4" />,
    label: 'Vendor',
  },
  {
    id: 'type',
    // icon: <Users className="h-4 w-4" />,
    label: 'Type',
  },
];

function SortableItem({ item }: { item: FieldItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <NestedDropdownMenu.Item
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="mr-2 h-4 w-4 cursor-grab" />
      {item.icon ? item.icon : ''}
      <span className="ml-2">{item.label}</span>
    </NestedDropdownMenu.Item>
  );
}
export const ProductsRecordTableOptions = () => {
  const [fields, setFields] = useState(initialFields);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    console.log({ active: active, over: over });

    if (active.id !== over.id) {
      let count = 1
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
        count++
      });
    }
  }, []);
  useEffect(() => {
    console.log('Fields updated:', fields);
  }, [fields]);

  return (
    <NestedDropdownMenu>
      <NestedDropdownMenu.Trigger asChild>
        <Button variant="ghost" className="text-muted-foreground">
          Options
        </Button>
      </NestedDropdownMenu.Trigger>
      <NestedDropdownMenu.Content className="w-56 text-muted-foreground b g-background">
        <NestedDropdownMenu.Label className="flex text-white gap-2">
          <MenuIcon className="h-4 w-4 " />
          Products
        </NestedDropdownMenu.Label>
        <NestedDropdownMenu.Separator />
        <NestedDropdownMenu.Sub
          label="Fields"
          key={fields.map((f) => f.id).join(',')}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableItem key={field.id} item={field} />
              ))}
            </SortableContext>
          </DndContext>
          <NestedDropdownMenu.Separator />
          <NestedDropdownMenu.Sub
            label={
              <div className="flex items-center">
                <EyeOff className="mr-2 h-4 w-4" />
                <span>Hidden Fields</span>
              </div>
            }
          >
            <NestedDropdownMenu.Item></NestedDropdownMenu.Item>
          </NestedDropdownMenu.Sub>
        </NestedDropdownMenu.Sub>
      </NestedDropdownMenu.Content>
    </NestedDropdownMenu>
  );
};
