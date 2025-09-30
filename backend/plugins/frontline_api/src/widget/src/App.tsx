import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ErxesMessenger } from './components/messenger/erxes-messenger';

function App() {
  console.log('App loaded!');
  return (
    <Router basename="/pl:frontline/widget">
      <Routes>
        <Route path="/brand/:id" element={<ErxesMessenger />} />
      </Routes>
    </Router>
  );
}

export default App;
