import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8800/knjige');
        console.log('Books fetched:', response.data); // Log the fetched data
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching the books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      alert('You have successfully logged out');
      navigate('/');
    }
  };

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="main-page">
      <aside className="sidebar">
        <div>
          <div className="menu-header">
            <h2>IZBORNIK</h2>
          </div>
          <div className="menu-buttons">
            {isLoggedIn ? (
              <button onClick={handleLogout}>ODJAVA</button>
            ) : (
              <>
                <button onClick={() => navigate('Prijava')}>PRIJAVA</button>
                <button onClick={() => navigate('Registracija')}>REGISTRACIJA</button>
              </>
            )}
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
          {books.length === 0 ? (
            <p>No books available</p>
          ) : (
            books.map((book) => (
              <div className="book-card" key={book.id_knjiga} onClick={() => handleBookClick(book.id_knjiga)}>
                <div className="book-image">
                  {book.slika ? (
                    <img src={`http://localhost:8800${book.slika}`} alt={book.naziv} />
                  ) : (
                    'SLIKA'
                  )}
                </div>
                <div className="book-details">
                  <p>{book.naziv}</p>
                  <p>{book.naziv_autor}</p>
                  <p>{book.godina_izdavanja}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;