import { useAtom } from 'jotai';
import { activeTabAtom } from '../atoms';
import { CreateTicket } from './create-ticket';
import { Chat } from './chat';
import { Conversations } from './conversations';

export const Body = () => {
  const [activeTab] = useAtom(activeTabAtom);
  const render = () => {
    switch (activeTab) {
      case 'ticket':
        return <CreateTicket />;
      case 'chat':
        return <Conversations />;
      default:
        return <Chat />;
    }
  };

  return <div className='bg-sidebar'>{render()}</div>;
};
