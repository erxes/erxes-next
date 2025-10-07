import { ErxesMessenger } from './components/messenger/erxes-messenger';
import { Apollo } from './components/apollo-provider';

function App() {
  return (
    <Apollo>
      <ErxesMessenger brandId="dGt278" />
    </Apollo>
  );
}

export default App;
