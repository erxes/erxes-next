import { useParams } from 'react-router-dom';
import { ErxesMessenger } from '../components/messenger/erxes-messenger';

export default function MessengerPage() {
  const { id } = useParams();
  return <ErxesMessenger brandId={id} />;
}
