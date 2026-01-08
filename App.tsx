
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RSVP from './pages/RSVP';
import Location from './pages/Location';
import Gifts from './pages/Gifts';
import Trajectory from './pages/Trajectory';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/local" element={<Location />} />
          <Route path="/presentes" element={<Gifts />} />
          <Route path="/trajetoria" element={<Trajectory />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
