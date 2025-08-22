import { BlockEditorReadOnly, RelativeDateDisplay } from 'erxes-ui';
import { MembersInline } from 'ui-modules';
import { useGetNote } from '@/task/hooks/useGetNote';

interface NoteInputReadOnlyProps {
  newValueId: string;
  authorId?: string;
  createdAt: string;
}

export const NoteInputReadOnly = ({
  newValueId,
  authorId,
  createdAt,
}: NoteInputReadOnlyProps) => {
  const { note, loading } = useGetNote(newValueId);

  return (
    <div className="flex flex-col border rounded-lg min-h-14 px-4 py-3  ">
      <div
        className="flex items-center gap-2"
      >
        <span className="flex items-center gap-2 ">
          <MembersInline
            memberIds={authorId ? [authorId] : []}
            className="font-medium text-base"
            placeholder="Unknown user"
          />
        </span>
        <RelativeDateDisplay value={createdAt.toLocaleString()} asChild>
          <div className="text-accent-foreground ml-2 cursor-default">
            <RelativeDateDisplay.Value value={createdAt.toLocaleString()} />
          </div>
        </RelativeDateDisplay>
      </div>
      {!loading && (
        <BlockEditorReadOnly
          content={note?.content || ''}
          className="read-only"
        />
      )}
    </div>
  );
};


// TODO: add options menu

// const NoteOptionsMenu = () => {
//   return (
//     <DropdownMenu>
//       <DropdownMenu.Trigger asChild>
//         <Button
//           variant="secondary"
//           className={'w-full font-medium size-8 flex-shrink-0'}
//           size="icon"
//         >
//           <IconDots />
//         </Button>
//       </DropdownMenu.Trigger>
//       <DropdownMenu.Content
//         side="right"
//         className="min-w-48 text-sm"
//         sideOffset={8}
//         alignOffset={-4}
//         align="start"
//       >
//         <DropdownMenu.Item>
//           <IconEdit />
//           Edit
//         </DropdownMenu.Item>
//         <DropdownMenu.Item
//           className="text-destructive"
//         >
//           <IconTrash />
//           Delete
//         </DropdownMenu.Item>
//       </DropdownMenu.Content>
//     </DropdownMenu>
//   );
// };
