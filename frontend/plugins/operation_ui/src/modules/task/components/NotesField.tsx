import {
  BlockEditor,
  getMentionedUserIds,
  Kbd,
  useBlockEditor,
} from 'erxes-ui';
import { AssignMemberInEditor } from 'ui-modules';
import { Button } from 'erxes-ui';
import { IconCommand, IconCornerDownLeft } from '@tabler/icons-react';
import { useScopedHotkeys, usePreviousHotkeyScope } from 'erxes-ui';
import { TaskHotKeyScope } from '@/task/TaskHotkeyScope';
import { useState } from 'react';
import { Block } from '@blocknote/core';
import { useCreateNote } from '@/task/hooks/useCreateNote';
import { useActivities } from '@/activity/hooks/useActivities';
import { useGetNote} from '@/task/hooks/useGetNote';
export const NotesField = ({ taskId }: { taskId: string }) => {
  const { activities } = useActivities(taskId);
  return (
    <div className="flex flex-col gap-2">
      {  activities && activities
        ?.filter((activity) => activity.module === 'NOTE')
        .map((activity) => (
          <NoteInput
            isEditable={true}
            newValue={activity.metadata?.newValue}
            authorId={activity.createdBy}
            taskId={taskId}
          />
        ))}
    </div>
  );
};

interface NoteInputProps {
  isEditable?: boolean;
  newValue: string
  authorId: string;
  taskId: string;
}

const NoteInput = ({
  isEditable,
  newValue,
  authorId,
  taskId,
}: NoteInputProps) => {
  const { note } = useGetNote(taskId);
  const editor = useBlockEditor({
    initialContent: note?.content ? JSON.parse(note.content) : undefined,
  });
  const [content, setContent] = useState<Block[]>();
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const { createNote } = useCreateNote();
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  const onchange = async () => {
    const content = await editor?.document;
    content.pop();
    setContent(content as Block[]);
    const mentionedUserIds = getMentionedUserIds(content);
    setMentionedUserIds(mentionedUserIds);
  };
  const onSend = async () => {
    const content = await editor?.document;
    content.pop();
    createNote({
      variables: {
        content: JSON.stringify(content),
        itemId: taskId,
        mentions: mentionedUserIds,
      },
    });
  };
  useScopedHotkeys('mod+enter', onSend, TaskHotKeyScope.NoteInput);
  return (
    <div className="flex flex-col border rounded-lg min-h-14 pt-3 pb-4">
      {/* <div className="flex justify-between mx-9">
        <MembersInline memberIds={[authorId]} />
      </div> */}
      <BlockEditor
        editor={editor}
        onChange={onchange}
        onFocus={() =>
          setHotkeyScopeAndMemorizePreviousScope(TaskHotKeyScope.NoteInput)
        }
        onBlur={() => goBackToPreviousHotkeyScope()}
        disabled={!isEditable}
      >
        <AssignMemberInEditor editor={editor} />
      </BlockEditor>
      {isEditable && (
        <div className="flex justify-end mx-6">
          <Button
            size="lg"
            className="ml-auto"
            // disabled={loading || content?.length === 0}
            onClick={onSend}
          >
            Send
            <Kbd className="ml-1">
              <IconCommand size={12} />
              <IconCornerDownLeft size={12} />
            </Kbd>
          </Button>
        </div>
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

const DummyContent = JSON.stringify([
  {
    id: '80066070-8300-4556-bbe4-d8a7b5098b63',
    type: 'paragraph',
    props: {
      textColor: 'default',
      backgroundColor: 'default',
      textAlignment: 'left',
    },
    content: [
      {
        type: 'text',
        text: 'asdyhagsbdasdsad',
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: 'f73d95eb-a5b5-4b34-8f3d-89a38687e76f',
    type: 'paragraph',
    props: {
      textColor: 'default',
      backgroundColor: 'default',
      textAlignment: 'left',
    },
    content: [
      {
        type: 'text',
        text: 'asd',
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: '56c705f1-a80d-467c-976d-492f10b5ae50',
    type: 'paragraph',
    props: {
      textColor: 'default',
      backgroundColor: 'default',
      textAlignment: 'left',
    },
    content: [
      {
        type: 'text',
        text: 'asdas',
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: '3497b887-287d-45ff-852a-de99b765d11e',
    type: 'paragraph',
    props: {
      textColor: 'default',
      backgroundColor: 'default',
      textAlignment: 'left',
    },
    content: [
      {
        type: 'text',
        text: 'as',
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: '2207b6da-2469-474d-9a44-d274d8c65534',
    type: 'paragraph',
    props: {
      textColor: 'default',
      backgroundColor: 'default',
      textAlignment: 'left',
    },
    content: [
      {
        type: 'text',
        text: 'd',
        styles: {},
      },
    ],
    children: [],
  },
]);
