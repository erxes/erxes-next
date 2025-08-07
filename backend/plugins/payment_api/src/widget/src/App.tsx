import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import InvoiceDetail from './pages/InvoiceDetail';
import { useEffect } from 'react';

function App() {
  console.log('App');
  useEffect(() => {
    const id = (window as any).INVOICE_ID;
    console.log(id);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/invoice/:id" element={<InvoiceDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
