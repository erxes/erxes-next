import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

export function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
