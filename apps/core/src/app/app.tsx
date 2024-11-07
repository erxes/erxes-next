import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout';
import Providers from '../providers/providers';

export function App() {
  return (
    <Providers>
      <Layout>
        <Outlet />
      </Layout>
    </Providers>
  );
}

export default App;
