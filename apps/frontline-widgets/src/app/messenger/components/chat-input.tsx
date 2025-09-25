import { IconArrowUp } from '@tabler/icons-react';
import { useId, useState, FormEvent } from 'react';
import { useAtom } from 'jotai';
import { activeTabAtom } from '../atoms';

export function ChatInput() {
  const id = useId();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setActiveTab('chat');
    setMessage('');
  }

  return (
    <form className="p-4 flex" onSubmit={handleSubmit} autoComplete="off">
      <div className="flex items-center gap-2 w-full">
        <input
          id={id}
          type="text"
          className="flex-1 bg-black/5 p-2 rounded-lg text-sm text-zinc-400 font-medium"
          placeholder="How can we help you?"
          value={message}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-[#4F46E5] text-white aspect-square h-full rounded-lg flex items-center justify-center disabled:opacity-90"
          aria-label="Send"
          disabled={!message.trim()}
        >
          <IconArrowUp size={16} />
        </button>
      </div>
    </form>
  );
}
