import { AvatarImage, Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarGroup } from '../messenger/avatar-group';

export function EmptyChat() {
  return (
    <div className="flex flex-col gap-4 p-4 font-medium text-sm min-h-28">
      <div className="my-auto flex items-center gap-2">
        <AvatarGroup max={3}>
          <Avatar>
            <AvatarImage
              src="assets/kazue.png"
              alt="Kazue"
              className="shrink-0 object-cover"
            />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="assets/kazue.png"
              alt="Kazue"
              className="shrink-0 object-cover"
            />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="assets/kazue.png"
              alt="Kazue"
              className="shrink-0 object-cover"
            />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
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
      <Avatar>
        <AvatarImage
          src="assets/kazue.png"
          className="shrink-0 object-cover"
          alt="Kazue"
        />
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 text-sm font-medium text-zinc-400">
        <span>Hello! Have you fixed your problem yet?</span>
        <span>Customer support · 2d ago</span>
      </div>
    </div>
  );
}

export function OperatorMessage() {
  return (
    <div className="flex items-end gap-2">
      <Avatar>
        <AvatarImage
          src="assets/kazue.png"
          className="shrink-0 object-cover"
          alt="Kazue"
        />
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
      <div className="h-auto font-medium flex flex-col justify-start items-start text-[13px] leading-relaxed text-zinc-900 text-left gap-1 p-3 bg-black/5 rounded-lg">
        <p>
          Good afternoon! You're currently speaking to a staff member, ask away
          😃
        </p>
      </div>
    </div>
  );
}

export const CustomerMessage = () => {
  return (
    <div className="flex items-end gap-2 flex-row-reverse">
      <Avatar>
        <AvatarImage
          src="assets/kazue.png"
          className="shrink-0 object-cover"
          alt="Kazue"
        />
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
      <div className="h-auto font-medium flex flex-col justify-start items-start text-[13px] leading-relaxed text-zinc-900 text-left gap-1 p-3 bg-[#4F46E51A] rounded-lg">
        <p>Hello! Have you fixed your problem yet?</p>
      </div>
    </div>
  );
};
