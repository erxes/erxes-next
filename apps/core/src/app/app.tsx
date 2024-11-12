import { Outlet } from 'react-router-dom';
import Providers from '../providers/providers';
import { SidebarMain } from '../components/Sidebar';

export function App() {
  return (
    <Providers>
      <SidebarMain>
        <Outlet />
      </SidebarMain>
    </Providers>
  );
}

export default App;
