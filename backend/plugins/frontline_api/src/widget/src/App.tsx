import { ErxesMessenger } from './components/messenger/erxes-messenger';
import { Apollo } from './components/apollo-provider';

function App() {
  return (
    <Apollo>
      <ErxesMessenger brandId="tBdZg4" />
    </Apollo>
  );
}

export default App;
