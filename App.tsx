
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RSVP from './pages/RSVP';
import Location from './pages/Location';
import Gifts from './pages/Gifts';
import Trajectory from './pages/Trajectory';
import GuestList from './pages/GuestList';
import Layout from './components/Layout';

// Componente para forçar o scroll para o topo em cada mudança de página
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/local" element={<Location />} />
          <Route path="/presentes" element={<Gifts />} />
          <Route path="/trajetoria" element={<Trajectory />} />
          <Route path="/confirmados" element={<GuestList />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
