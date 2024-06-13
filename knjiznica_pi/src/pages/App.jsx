import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './MainPage.css';
import MainPage from './MainPage';
import KupnjaKnjiga from './KupnjaKnjiga.jsx';
import Prijava from './Prijava.jsx';
import Registracija from './Registracija.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route path="/kupnja-knjiga" element={<KupnjaKnjiga />} />
          <Route path="/prijava" element={<Prijava />} />
          <Route path="/registracija" element={<Registracija />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
