import { IconArrowUp } from '@tabler/icons-react';
import { useId } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useChatInput } from '../messenger/hooks/useChatInput';

export function ChatInput() {
  const id = useId();
  const { message, handleInputChange, handleSubmit, isDisabled } =
    useChatInput();

  return (
    <form className="p-4 flex" onSubmit={handleSubmit} autoComplete="off">
      <div className="flex items-center gap-2 w-full">
        <Input
          id={id}
          className="bg-black/5 border-none shadow-none"
          placeholder="How can we help you?"
          value={message}
          onChange={handleInputChange}
        />
        <Button
          size="icon"
          type="submit"
          aria-label="Send"
          className='aspect-square'
          disabled={isDisabled}
        >
          <IconArrowUp size={16} />
        </Button>
      </div>
    </form>
  );
}
