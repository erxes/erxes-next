import { ErxesMessenger } from './components/messenger/erxes-messenger';
import { Apollo } from './components/apollo-provider';

function App() {
  console.log('App component rendering...');

  return (
    <Apollo>
      <ErxesMessenger brandId="tBdZg4" />
    </Apollo>
  );
}

export default App;
