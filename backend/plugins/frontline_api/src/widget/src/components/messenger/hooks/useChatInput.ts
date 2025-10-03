import { useState, FormEvent } from 'react';
import { useAtom } from 'jotai';
import { connectionAtom, conversationIdAtom, setActiveTabAtom } from '../atoms';
import { useInsertMessage } from '@/components/messenger/hooks/useInsertMessage';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils';

export function useChatInput() {
  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const [connection, setConnection] = useAtom(connectionAtom);
  const { insertMessage, loading } = useInsertMessage();
  const [message, setMessage] = useState('');
  const [, setActiveTab] = useAtom(setActiveTabAtom);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const { customerId } = connection.data;
  const __customerId = getLocalStorageItem('customerId');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      insertMessage({
        variables: {
          contentType: 'text',
          message: message,
          customerId: customerId || __customerId || undefined,
        },
        onCompleted: (data) => {
          const _conversationId = data.widgetsInsertMessage.conversationId;
          const _customerId = data.widgetsInsertMessage.customerId;
          if (!conversationId) {
            setConversationId(_conversationId);
            setActiveTab('chat');
          }
          if (!customerId && !__customerId) {
            setLocalStorageItem('customerId', _customerId);
            setConnection((prev) => ({
              ...prev,
              data: {
                ...prev.data,
                customerId: _customerId,
              },
            }));
          }
          setMessage('');
        },
      });
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
    loading,
  };
}
