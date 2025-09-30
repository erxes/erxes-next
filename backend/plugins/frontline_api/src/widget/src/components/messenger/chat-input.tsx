import { IconArrowUp } from '@tabler/icons-react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatInput } from './hooks/useChatInput';

export function ChatInput() {
  const id = useId();
  const { message, handleInputChange, handleSubmit, isDisabled } =
    useChatInput();

  return (
    <form className="p-4 flex" onSubmit={handleSubmit} autoComplete="off">
      <div className="flex items-center gap-2 w-full">
        <Input
          id={id}
          className="bg-accent shadow-none"
          placeholder="How can we help you?"
          value={message}
          onChange={handleInputChange}
        />
        <Button
          size="icon"
          type="submit"
          aria-label="Send"
          disabled={isDisabled}
        >
          <IconArrowUp size={16} />
        </Button>
      </div>
    </form>
  );
}
