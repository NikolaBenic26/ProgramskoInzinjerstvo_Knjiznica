import React from 'react';

function Book({ slika, naslov, autor, godina }) {
  return (
    <div className="knjiga">
      <img src={slika} alt="Slika knjige" />
      <h4>{naslov}</h4>
      <p>{autor}</p>
      <p>{godina}</p>
    </div>
  );
}

export default Book;
