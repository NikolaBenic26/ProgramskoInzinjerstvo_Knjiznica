import React from 'react';

function Header() {
  return (
    <Container maxWidth="sm">
    <div className="header">
      <div className="navbar">
        <button>Prijava</button>
        <button>Registracija</button>
      </div>
      <h1>Knjižnica Stribor</h1>
    </div>
    </Container>
  );
}

export default Header;