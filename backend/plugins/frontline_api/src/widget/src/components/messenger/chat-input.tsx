import { FC, useId } from 'react';
import { IconArrowUp } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatInput } from '@/components/messenger/hooks/useChatInput';
import { cn } from '@/lib/utils';

interface ChatInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const ChatInput: FC<ChatInputProps> = ({ className, ...inputProps }) => {
  const id = useId();
  const { message, handleInputChange, handleSubmit, isDisabled, loading } =
    useChatInput();

  return (
    <form
      className="p-4 flex grow-0 shrink-0"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="flex items-center gap-2 w-full">
        <Input
          id={id}
          className={cn('border-none shadow-none', className)}
          placeholder="How can we help you?"
          value={message}
          onChange={handleInputChange}
          {...inputProps}
        />
        <Button
          size="icon"
          type="submit"
          aria-label="Send"
          className="aspect-square text-accent bg-widget-primary"
          disabled={isDisabled || loading}
        >
          <IconArrowUp size={16} />
        </Button>
      </div>
    </form>
  );
};
