import { Avatar, AvatarGroup } from './avatar';
import { ChatInput } from './chat-input';

export function EmptyChat() {
  return (
    <div className="flex flex-col gap-4 p-4 font-medium text-sm min-h-28">
      <div className="my-auto flex items-center gap-2">
        <AvatarGroup max={3}>
          <Avatar src="assets/kazue.png" size="xs" alt="Kazue" />
          <Avatar src="assets/kazue.png" size="xs" alt="Kazue" />
          <Avatar src="assets/kazue.png" size="xs" alt="Kazue" />
        </AvatarGroup>
        <span className="text-zinc-400">Our usual reply time</span>{' '}
        <mark className="bg-transparent text-[#4F46E5]">(A few minutes)</mark>
      </div>
    </div>
  );
}

export function ConversationMessage() {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src="assets/kazue.png"
        size="sm"
        className="shrink-0"
        alt="Kazue"
      />
      <div className="flex flex-col gap-1 text-sm font-medium text-zinc-400">
        <span>Hello! Have you fixed your problem yet?</span>
        <span>Customer support · 2d ago</span>
      </div>
    </div>
  );
}

export function Chat() {
  return (
    <div className="flex flex-col">
      {/* <EmptyChat /> */}
      <div className="flex flex-col justify-center p-4 font-medium text-sm min-h-28">
        <ConversationMessage />
      </div>
      <ChatInput />
    </div>
  );
}
