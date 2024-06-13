import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/knjiga/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching the book details:', error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{book.naziv}</h1>
      <p>Author: {book.autor}</p>
      <p>Year: {book.godina_izdavanja}</p>
      <p>Price: {book.cijena}</p>
      <p>Description: {book.opis}</p>
    </div>
  );
};

export default BookDetails;
