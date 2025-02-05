// import { IconEyeOff } from '@tabler/icons-react';
// import type { Icon } from '@tabler/icons-react';
// import {
//   IconGripVertical,
//   IconChevronLeft,
//   IconChevronRight,
// } from '@tabler/icons-react';
// import { Button, DropdownMenu } from 'erxes-ui/components';
// import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';

// import {
//   arrayMove,
//   sortableKeyboardCoordinates,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { useRecoilState } from 'recoil';
// import { fieldsState } from 'erxes-ui/states/RecordTableFieldsState';

// type Field = {
//   id: string;
//   name: string;
//   icon: Icon;
//   isVisible: boolean;
// };

// const DraggableItem = ({
//   field,
//   hiddenFieldToggleFunc,
// }: {
//   field: Field;
//   hiddenFieldToggleFunc: (fieldId: string, e: React.MouseEvent) => void;
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: field.id, disabled: field.id === 'name' });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition: transition,
//     zIndex: isDragging ? 1000 : 'auto',
//     overflow: 'auto',
//   };

//   const FieldIcon = field.icon;

//   return (
//     <DropdownMenu.Item
//       key={field.id}
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="group cursor-pointer flex justify-between items-center p-1"
//       disabled={field.id === 'name'}
//     >
//       <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
//         <IconGripVertical className="" />
//         {FieldIcon && <FieldIcon className=" w-4 h-4" />}
//         <span className="text-muted-foreground">{field.name}</span>
//       </div>
//       <Button
//         variant="ghost"
//         className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted-foreground/10"
//         onClick={(e) => hiddenFieldToggleFunc(field.id, e)}
//       >
//         <IconEyeOff />
//       </Button>
//     </DropdownMenu.Item>
//   );
// };

// export const FieldsMenu = ({ handleToMain, handleToHiddenFields }) => {
//   const [fields, setFields] = useRecoilState(fieldsState);

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 5,
//       },
//     }),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active.id !== over?.id && over?.id !== 'name') {
//       setFields((items) => {
//         const activeIndex = items.findIndex((item) => item.id === active.id);
//         const overIndex = over
//           ? items.findIndex((item) => item.id === over.id)
//           : -1;

//         return arrayMove(items, activeIndex, overIndex);
//       });
//     }
//   };

//   const handleFieldToggleVisibility = (
//     fieldId: string,
//     e: React.MouseEvent
//   ) => {
//     e.preventDefault();
//     setFields((currentFields) =>
//       currentFields.map((field) =>
//         field.id === fieldId ? { ...field, isVisible: !field.isVisible } : field
//       )
//     );
//   };

//   return (
//     <>
//       <DropdownMenu.Label className="flex items-center gap-2 p-0">
//         <Button
//           variant={'ghost'}
//           onClick={(e) => {
//             handleToMain(e as unknown as React.MouseEvent);
//           }}
//         >
//           <IconChevronLeft className="w-4 h-4" />
//         </Button>
//         <span className="text-foreground font-semibold">Fields</span>
//       </DropdownMenu.Label>
//       <DropdownMenu.Separator />
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         modifiers={[restrictToVerticalAxis]}
//         onDragEnd={handleDragEnd}
//       >
//         <SortableContext
//           items={fields.map((f) => f.id)}
//           strategy={verticalListSortingStrategy}
//         >
//           {fields
//             .filter((field) => field.isVisible)
//             .map((field) => (
//               <DraggableItem
//                 field={field}
//                 hiddenFieldToggleFunc={handleFieldToggleVisibility}
//                 key={field.id}
//               />
//             ))}
//         </SortableContext>
//       </DndContext>
//       <DropdownMenu.Separator className="h-[0.8px]" />
//       <DropdownMenu.Item
//         className="cursor-pointer flex justify-between items-center"
//         onSelect={(e) => {
//           handleToHiddenFields(e as unknown as React.MouseEvent);
//         }}
//       >
//         <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
//           <IconEyeOff className="w-4 h-4 " />
//           <span>Hidden Fields</span>
//         </div>
//         <IconChevronRight className="w-4 h-4" />
//       </DropdownMenu.Item>
//     </>
//   );
// };
