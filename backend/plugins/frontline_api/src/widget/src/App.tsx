import { ErxesMessenger } from './components/messenger/erxes-messenger';
import { Apollo } from './components/apollo-provider';

function App() {
  return (
    <Apollo>
      <ErxesMessenger />
    </Apollo>
  );
}

export default App;
