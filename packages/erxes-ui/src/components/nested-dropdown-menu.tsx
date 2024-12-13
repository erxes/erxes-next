'use client';
import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronLeft, ChevronRight, GripVertical, Search } from 'lucide-react';
import { cn } from '../lib/utils';
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

type MenuStack = {
  label: React.ReactNode;
  content: React.ReactNode;
  items?: string[];
}[];

const NestedDropdownMenuContext = React.createContext<{
  menuStack: MenuStack;
  setMenuStack: React.Dispatch<React.SetStateAction<MenuStack>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}>({
  menuStack: [],
  setMenuStack: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
});
export const useNestedDropdownMenu = () =>
  React.useContext(NestedDropdownMenuContext);

const NestedDropdownMenuRoot = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>
>(({ children, ...props }, ref) => {
  const [menuStack, setMenuStack] = React.useState<MenuStack>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <NestedDropdownMenuContext.Provider
      value={{ menuStack, setMenuStack, searchQuery, setSearchQuery }}
    >
      <DropdownMenuPrimitive.Root {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    </NestedDropdownMenuContext.Provider>
  );
});
NestedDropdownMenuRoot.displayName = DropdownMenuPrimitive.Root.displayName;

const NestedDropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const NestedDropdownMenuSearch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const { searchQuery, setSearchQuery } = React.useContext(
    NestedDropdownMenuContext
  );

  return (
    <div className="relative px-2 py-1.5">
      <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
      <input
        ref={ref}
        type="search"
        placeholder="Search fields"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={cn(
          'h-8 w-full rounded-md bg-zinc-800 pl-8 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700',
          className
        )}
        {...props}
      />
    </div>
  );
});
NestedDropdownMenuSearch.displayName = 'NestedDropdownMenuSearch';

const NestedDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const { menuStack, setMenuStack, searchQuery } = React.useContext(
    NestedDropdownMenuContext
  );

  const renderContent = (content: React.ReactNode) => {
    return React.Children.map(content, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === NestedDropdownMenuSub) {
          if (!menuStack.some((prop)=>prop.items)) {
            return React.cloneElement(child, {
              ...child.props,
              searchText: child.props.searchText || child.props.label,
            });
          } else {
            return React.cloneElement(child, {
              ...child.props,
              searchText: child.props.searchText || child.props.label,
            });
          }
        }
        if (child.props.searchText) {
          if (
            searchQuery &&
            !child.props.searchText
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ) {
            return null;
          }
        }
        if (child.props.children) {
          return React.cloneElement(child, {
            ...child.props,
            children: renderContent(child.props.children),
          });
        }
      }
      return child;
    });
  };

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md bg-zinc-900 p-1 text-zinc-100 shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className
        )}
        {...props}
      >
        {menuStack.length > 0 ? (
          <>
            <NestedDropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setMenuStack((prev) => prev.slice(0, -1));
              }}
              className="cursor-pointer"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span>{menuStack[menuStack.length - 1].label}</span>
            </NestedDropdownMenuItem>
            <NestedDropdownMenuSeparator />
            {renderContent(menuStack[menuStack.length - 1].content)}
          </>
        ) : (
          renderContent(props.children)
        )}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
});
NestedDropdownMenuContent.displayName =
  DropdownMenuPrimitive.Content.displayName;

const NestedDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    searchText?: string;
  }
>(({ className, searchText, children, ...props }, ref) => {
  const { searchQuery } = React.useContext(NestedDropdownMenuContext);

  if (
    searchText &&
    searchQuery &&
    !searchText.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return null;
  }

  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-800 focus:bg-zinc-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
});
NestedDropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const NestedDropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
));
NestedDropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const NestedDropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-zinc-800', className)}
    {...props}
  />
));
NestedDropdownMenuSeparator.displayName =
  DropdownMenuPrimitive.Separator.displayName;

interface NestedDropdownMenuSubProps {
  label: React.ReactNode;
  children: React.ReactNode;
  searchText?: string;
  items?: string[];
}

const NestedDropdownMenuSub: React.FC<NestedDropdownMenuSubProps> = ({
  label,
  children,
  searchText,
  items,
}) => {
  const { setMenuStack, searchQuery } = React.useContext(
    NestedDropdownMenuContext
  );

  if (
    searchText &&
    searchQuery &&
    !searchText.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return null;
  }

  return (
    <NestedDropdownMenuItem
      onSelect={(event) => {
        event.preventDefault();
        setMenuStack((prev) => {
          const newStack = [...prev, { label, content: children, items }];
          return newStack;
        });
      }}
    >
      {label}
      <ChevronRight className="ml-auto h-4 w-4" />
    </NestedDropdownMenuItem>
  );
};

NestedDropdownMenuSub.displayName = 'NestedDropdownMenuSub';

interface Item {
  id: string;
  icon?: React.ReactNode;
  label: string;
}

interface NestedDropdownMenuSortablesProps {
  items: Item[]
  onChange?: (items: Item[]) => void
}

function SortableItem({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <NestedDropdownMenu.Item
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="mr-2 h-4 w-4 cursor-grab" />
      {item.icon}
      <span className="ml-2">{item.label}</span>
    </NestedDropdownMenu.Item>
  )
}

export function NestedDropdownMenuSortables({ items: initialItems, onChange }: NestedDropdownMenuSortablesProps) {
  const [items, setItems] = React.useState(initialItems)
  // const { setMenuStack } = useNestedDropdownMenu()
  const {setMenuStack} = React.useContext(NestedDropdownMenuContext)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id)
        const newIndex = prevItems.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(prevItems, oldIndex, newIndex)
        onChange?.(newItems)
        return newItems
      })
    }
  }

  React.useEffect(() => {
    setMenuStack([
      {
        label: 'Sortable Items',
        content: (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </SortableContext>
          </DndContext>
        ),
      },
    ])
  }, [items, setMenuStack, sensors])

  return (
    <NestedDropdownMenu>
      <NestedDropdownMenu.Trigger>Sortable Menu</NestedDropdownMenu.Trigger>
      <NestedDropdownMenu.Content>
        {/* Content is managed by the effect above */}
      </NestedDropdownMenu.Content>
    </NestedDropdownMenu>
  )
}



const NestedDropdownMenu = Object.assign(NestedDropdownMenuRoot, {
  Trigger: NestedDropdownMenuTrigger,
  Content: NestedDropdownMenuContent,
  Item: NestedDropdownMenuItem,
  Label: NestedDropdownMenuLabel,
  Separator: NestedDropdownMenuSeparator,
  Sub: NestedDropdownMenuSub,
  Search: NestedDropdownMenuSearch,
});

export { NestedDropdownMenu };
