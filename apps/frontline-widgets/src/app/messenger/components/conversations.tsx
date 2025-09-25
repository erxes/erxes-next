import { Avatar } from './avatar';
import { ChatInput } from './chat-input';
import { DateSeparator } from './date-separator';

export function Conversations() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-auto flex-col justify-end gap-2 p-4">
        <div className="flex items-end gap-2">
          <Avatar size="md" alt="Agent name" className="shrink-0 my-auto" />
          <div className="h-auto font-medium flex flex-col justify-start items-start text-[13px] leading-relaxed text-zinc-900 text-left gap-1 p-3 bg-black/5 rounded-lg">
            <p>
              Good afternoon! You're currently speaking to a staff member, ask
              away 😃
            </p>
          </div>
        </div>

        <DateSeparator date="Today" />

        <div className="flex items-end gap-2 flex-row-reverse">
          <Avatar size="md" alt="Customer name" className="shrink-0 my-auto" />
          <div className="h-auto font-medium flex flex-col justify-start items-start text-[13px] leading-relaxed text-zinc-900 text-left gap-1 p-3 bg-[#4F46E51A] rounded-lg">
            <p>Hello! Have you fixed your problem yet?</p>
          </div>
        </div>
      </div>
      <ChatInput />
    </div>
  );
}
