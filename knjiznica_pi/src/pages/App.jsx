import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import KupnjaKnjiga from './KupnjaKnjiga';
import Prijava from './Prijava';
import Registracija from './Registracija';
import StranicaAdmin from './StranicaAdmin';
import BookDetails from './KupnjaKnjiga';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/kupnja-knjiga" element={<KupnjaKnjiga />} />
          <Route path="/prijava" element={<Prijava />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="/StranicaAdmin" element={<StranicaAdmin />} />
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
