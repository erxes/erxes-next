import { useState, FormEvent } from 'react';
import { useAtom } from 'jotai';
import { setActiveTabAtom } from '../atoms';

export function useChatInput() {
  const [message, setMessage] = useState('');
  const [, setActiveTab] = useAtom(setActiveTabAtom);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setActiveTab('chat');
      setMessage('');
    }
  };

  const clearMessage = () => {
    setMessage('');
  };

  return {
    message,
    handleInputChange,
    handleSubmit,
    clearMessage,
    isDisabled: !message.trim(),
  };
}
