'use client';
import {
  Button,
  NestedDropdownMenu,
  useNestedDropdownMenu,
} from 'erxes-ui/components';
import {
  Building2,
  GanttChartSquare,
  CheckCircle,
  Hash,
  History,
  Type,
  Plus,
  Tags,
  Eye,
  EyeOff,
  GripVertical,
  Menu,
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
import { useCallback, useEffect, useState } from 'react';

interface FieldItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
}

const initialFields: FieldItem[] = [
  { id: 'name', icon: <Type className="h-4 w-4" />, label: 'Name' },
  { id: 'code', icon: <Hash className="h-4 w-4" />, label: 'Code' },
  {
    id: 'price',
    icon: <IconCurrencyTugrik className="h-4 w-4" />,
    label: 'Price',
  },
  {
    id: 'category',
    icon: <GanttChartSquare className="h-4 w-4" />,
    label: 'Category',
  },
  { id: 'status', icon: <CheckCircle className="h-4 w-4" />, label: 'Status' },
  {
    id: 'created at',
    icon: <History className="h-4 w-4" />,
    label: 'Created At',
  },
  { id: 'tags', icon: <Tags className="h-4 w-4" />, label: 'Tags' },
  { id: 'vendor', icon: <Building2 className="h-4 w-4" />, label: 'Vendor' },
  { id: 'type', label: 'Type' },
];

function SortableItem({
  item,
  keyString,
}: {
  item: FieldItem;
  keyString: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <NestedDropdownMenu.Item
      draggable
      key={keyString}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="mr-2 h-4 w-4 cursor-grab" />
      {item.icon}
      <span className="ml-2">{item.label}</span>
    </NestedDropdownMenu.Item>
  );
}

export function ProductsRecordTableOptionsContent() {
  const [fields, setFields] = useState(initialFields);
  const { setMenuStack, menuStack } = useNestedDropdownMenu();

  useEffect(() => {
    if (menuStack.length > 0) {
      setMenuStack([
        {
          label: 'Fields',
          content: (
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
                  <SortableItem item={field} keyString={field.id} />
                ))}
              </SortableContext>
            </DndContext>
          ),
        },
      ]);
    }
  }, [fields]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((prevFields) => {
        const oldIndex = prevFields.findIndex((item) => item.id === active.id);
        const newIndex = prevFields.findIndex((item) => item.id === over.id);
        return arrayMove(prevFields, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <>
      <NestedDropdownMenu.Trigger asChild>
        <Button variant="ghost" className="text-muted-foreground">
          Options
        </Button>
      </NestedDropdownMenu.Trigger>
      <NestedDropdownMenu.Content className="w-56">
        <NestedDropdownMenu.Label className="flex items-center gap-2">
          <Menu className="h-4 w-4" />
          Products
        </NestedDropdownMenu.Label>
        <NestedDropdownMenu.Separator />
        {/* <NestedDropdownMenu.Search></NestedDropdownMenu.Search> */}
        <NestedDropdownMenu.Sub label="Fields">
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
                <SortableItem item={field} keyString={field.id} />
              ))}
            </SortableContext>
          </DndContext>
          {/* <NestedDropdownMenu.Separator /> */}
          {/* <NestedDropdownMenu.Sub
            label={
              <div className="flex items-center">
                <EyeOff className="mr-2 h-4 w-4" />
                <span>Hidden Fields</span>
              </div>
            }
          >
            <NestedDropdownMenu.Item>No hidden fields</NestedDropdownMenu.Item>
          </NestedDropdownMenu.Sub> */}
        </NestedDropdownMenu.Sub>
        <NestedDropdownMenu.Separator />
        <NestedDropdownMenu.Item>
          <div>Hello</div>
        </NestedDropdownMenu.Item>
      </NestedDropdownMenu.Content>
    </>
  );
}
