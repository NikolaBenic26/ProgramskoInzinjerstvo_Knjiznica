import React from 'react';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <aside className="sidebar">
        <div>
          <div className="menu-header">
            <h2>IZBORNIK</h2>
          </div>
          <div className="menu-buttons">
            <button>PRIJAVA</button>
            <button>REGISTRACIJA</button>
          </div>
          <div className="filters">
            <div className="filters-buttons">
              <button>NAZIV KNJIGE</button>
              <button>ŽANR KNJIGE</button>
              <button>GODINA IZDAVANJA</button>
            </div>
          </div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>🔍</button>
        </div>
      </aside>
      <main className="content">
        <header className="header">
          <h1>KNJIŽNICA STRIBOR</h1>
        </header>
        <div className="books-grid">
          <div className="book-card">
            <div className="book-image">SLIKA</div>
            <div className="book-details">
              <p>NASLOV</p>
              <p>AUTOR</p>
              <p>GODINA</p>
            </div>
          </div>
          <div className="book-card">
            <div className="book-image">SLIKA</div>
            <div className="book-details">
              <p>NASLOV</p>
              <p>AUTOR</p>
              <p>GODINA</p>
            </div>
          </div>
          <div className="book-card">
            <div className="book-image">SLIKA</div>
            <div className="book-details">
              <p>NASLOV</p>
              <p>AUTOR</p>
              <p>GODINA</p>
            </div>
          </div>
          <div className="book-card">
            <div className="book-image">SLIKA</div>
            <div className="book-details">
              <p>NASLOV</p>
              <p>AUTOR</p>
              <p>GODINA</p>
            </div>
          </div>
          <div className="book-card">
            <div className="book-image">SLIKA</div>
            <div className="book-details">
              <p>NASLOV</p>
              <p>AUTOR</p>
              <p>GODINA</p>
            </div>
          </div>
          <div className="book-card">
            <div className="book-image">SLIKA</div>
            <div className="book-details">
              <p>NASLOV</p>
              <p>AUTOR</p>
              <p>GODINA</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
