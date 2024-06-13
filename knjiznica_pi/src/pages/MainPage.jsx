import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8800/knjige');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching the books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="main-page">
      <aside className="sidebar">
        <div>
          <div className="menu-header">
            <h2>IZBORNIK</h2>
          </div>
          <div className="menu-buttons">
            <button onClick={() => navigate('Prijava')}>PRIJAVA</button>
            <button onClick={() => navigate('Registracija')}>REGISTRACIJA</button>
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
          <input type="text" placeholder="Pretraži..." />
          <button>🔍</button>
        </div>
      </aside>
      <main className="content">
        <header className="header">
          <h1>KNJIŽNICA STRIBOR</h1>
        </header>
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id_knjiga}>
              <div className="book-image">SLIKA</div>
              <div className="book-details">
                <p>{book.naziv}</p>
                <p>{book.autor}</p>
                <p>{book.godina_izdavanja}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
