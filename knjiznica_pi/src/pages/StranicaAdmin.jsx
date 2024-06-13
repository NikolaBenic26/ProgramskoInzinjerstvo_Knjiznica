import React, { useState, useEffect } from 'react';
import './StranicaAdmin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const StranicaAdmin = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [editingMember, setEditingMember] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showBorrowedBooks, setShowBorrowedBooks] = useState(false);
    const [showBooks, setShowBooks] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newBook, setNewBook] = useState({
        naziv: '',
        godina_izdavanja: '',
        cijena_knjige: '',
        zanr_knjige: '',
        naziv_autor: '',
        slika: null
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAdmin = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/prijava');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role === 'admin') {
                    setIsAdmin(true);
                    fetchMembers();
                    fetchAuthors();
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                navigate('/prijava');
            }
        };

        checkAdmin();
    }, [navigate]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8800/clanovi', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
            setError('Error fetching members');
        }
    };

    const fetchBorrowedBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8800/posudeneKnjige', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setBorrowedBooks(response.data);
        } catch (error) {
            console.error('Error fetching borrowed books:', error);
            setError('Error fetching borrowed books');
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8800/knjige', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setError('Error fetching books');
        }
    };

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('http://localhost:8800/autori', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAuthors(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
            setError('Error fetching authors');
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            try {
                await axios.delete(`http://localhost:8800/clanovi/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                fetchMembers();
            } catch (error) {
                console.error('Error deleting member:', error);
                setError('Error deleting member');
            }
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8800/clanovi/${editingMember.id_clan}`, editingMember, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEditingMember(null);
            fetchMembers();
        } catch (error) {
            console.error('Error updating member:', error);
            setError('Error updating member');
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token');
            navigate('/prijava');
        }
    };

    const handleEditBook = (book) => {
        setEditingBook(book);
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`http://localhost:8800/knjige/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                fetchBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
                setError('Error deleting book');
            }
        }
    };

    const handleSaveBook = async () => {
        try {
            const author = authors.find(a => a.naziv_autor === editingBook.naziv_autor);
            if (author) {
                editingBook.id_autor = author.id_autor;
            }
            if (editingBook.id_knjiga) {
                await axios.put(`http://localhost:8800/knjige/${editingBook.id_knjiga}`, editingBook, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await axios.post(`http://localhost:8800/knjige`, editingBook, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }
            setEditingBook(null);
            fetchBooks();
        } catch (error) {
            console.error('Error saving book:', error);
            setError('Error saving book');
        }
    };

    const handleAddNewBook = async () => {
        try {
            const author = authors.find(a => a.naziv_autor === newBook.naziv_autor);
            if (author) {
                newBook.id_autor = author.id_autor;
            }

            const formData = new FormData();
            Object.keys(newBook).forEach(key => {
                formData.append(key, newBook[key]);
            });

            await axios.post(`http://localhost:8800/knjige`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setShowModal(false);
            setNewBook({
                naziv: '',
                godina_izdavanja: '',
                cijena_knjige: '',
                zanr_knjige: '',
                naziv_autor: '',
                slika: null
            });
            fetchBooks();
        } catch (error) {
            console.error('Error adding new book:', error);
            setError('Error adding new book');
        }
    };

    useEffect(() => {
        if (showBorrowedBooks) {
            fetchBorrowedBooks();
        } else if (showBooks) {
            fetchBooks();
        } else {
            fetchMembers();
        }
    }, [showBorrowedBooks, showBooks]);

    if (!isAdmin) return null;

    return (
        <div className="admin-pageAdmin">
            <aside className="sidebarAdmin">
                <div>
                    <div className="menu-headerAdmin">
                        <h2>Administrator</h2>
                    </div>
                    <div className="menu-buttonsAdmin">
                        <button onClick={() => { setShowBorrowedBooks(false); setShowBooks(false); }}>ČLANOVI</button>
                        <button onClick={() => { setShowBorrowedBooks(true); setShowBooks(false); }}>POSUDENE KNJIGE</button>
                        <button onClick={() => { setShowBorrowedBooks(false); setShowBooks(false); }}>KUPLJENE KNJIGE</button>
                        <button onClick={() => { setShowBorrowedBooks(false); setShowBooks(true); }}>KNJIGE</button>
                    </div>
                    <div className="filtersAdmin">
                        <button onClick={handleLogout}>ODJAVA</button>
                    </div>
                </div>
            </aside>
            <main className="contentAdmin">
                <header className="headerAdmin">
                    <h1>{showBorrowedBooks ? 'POSUDENE KNJIGE' : showBooks ? 'KNJIGE' : 'ČLANOVI'}</h1>
                    {showBooks && <button className="add-book-button" onClick={() => setShowModal(true)}>DODAJ NOVU KNJIGU</button>}
                </header>
                {error && <div className="error-message">{error}</div>}
                {!showBorrowedBooks && !showBooks && (
                    <table className="members-tableAdmin">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>IME</th>
                                <th>PREZIME</th>
                                <th>ADRESA</th>
                                <th>GRAD</th>
                                <th>POŠTANSKI BROJ</th>
                                <th>KONTAKT BROJ</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => (
                                <tr key={member.id_clan}>
                                    {editingMember && editingMember.id_clan === member.id_clan ? (
                                        <>
                                            <td>{member.id_clan}</td>
                                            <td><input type="text" value={editingMember.ime_clana} onChange={e => setEditingMember({ ...editingMember, ime_clana: e.target.value })} /></td>
                                            <td><input type="text" value={editingMember.prezime_clana} onChange={e => setEditingMember({ ...editingMember, prezime_clana: e.target.value })} /></td>
                                            <td><input type="text" value={editingMember.adresa_clana} onChange={e => setEditingMember({ ...editingMember, adresa_clana: e.target.value })} /></td>
                                            <td><input type="text" value={editingMember.grad_clan} onChange={e => setEditingMember({ ...editingMember, grad_clan: e.target.value })} /></td>
                                            <td><input type="text" value={editingMember.postanski_broj} onChange={e => setEditingMember({ ...editingMember, postanski_broj: e.target.value })} /></td>
                                            <td><input type="text" value={editingMember.kontakt_broj} onChange={e => setEditingMember({ ...editingMember, kontakt_broj: e.target.value })} /></td>
                                            <td>
                                                <button onClick={handleSave}>Save</button>
                                                <button onClick={() => setEditingMember(null)}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{member.id_clan}</td>
                                            <td>{member.ime_clana}</td>
                                            <td>{member.prezime_clana}</td>
                                            <td>{member.adresa_clana}</td>
                                            <td>{member.grad_clan}</td>
                                            <td>{member.postanski_broj}</td>
                                            <td>{member.kontakt_broj}</td>
                                            <td>
                                                <button onClick={() => handleEdit(member)}>Edit</button>
                                                <button onClick={() => handleDelete(member.id_clan)}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {showBorrowedBooks && (
                    <table className="borrowed-books-tableAdmin">
                        <thead>
                            <tr>
                                <th>NAZIV, AUTOR</th>
                                <th>POSUDIO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.map(book => (
                                <tr key={book.id_posudba}>
                                    <td>{book.naziv_autor}</td>
                                    <td>{book.posudio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {showBooks && (
                    <table className="members-tableAdmin">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAZIV</th>
                                <th>GODINA IZDAVANJA</th>
                                <th>CIJENA KNJIGE</th>
                                <th>ŽANR KNJIGE</th>
                                <th>AUTOR</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book.id_knjiga}>
                                    {editingBook && editingBook.id_knjiga === book.id_knjiga ? (
                                        <>
                                            <td>{book.id_knjiga}</td>
                                            <td><input type="text" value={editingBook.naziv} onChange={e => setEditingBook({ ...editingBook, naziv: e.target.value })} /></td>
                                            <td><input type="text" value={editingBook.godina_izdavanja} onChange={e => setEditingBook({ ...editingBook, godina_izdavanja: e.target.value })} /></td>
                                            <td><input type="text" value={editingBook.cijena_knjige} onChange={e => setEditingBook({ ...editingBook, cijena_knjige: e.target.value })} /></td>
                                            <td><input type="text" value={editingBook.zanr_knjige} onChange={e => setEditingBook({ ...editingBook, zanr_knjige: e.target.value })} /></td>
                                            <td>
                                                <select value={editingBook.naziv_autor} onChange={e => setEditingBook({ ...editingBook, naziv_autor: e.target.value })}>
                                                    <option value="">Odabir autora</option>
                                                    {authors.map(author => (
                                                        <option key={author.id_autor} value={author.naziv_autor}>
                                                            {author.naziv_autor}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <button onClick={handleSaveBook}>Save</button>
                                                <button onClick={() => setEditingBook(null)}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{book.id_knjiga}</td>
                                            <td>{book.naziv}</td>
                                            <td>{book.godina_izdavanja}</td>
                                            <td>{book.cijena_knjige}</td>
                                            <td>{book.zanr_knjige}</td>
                                            <td>{book.naziv_autor}</td>
                                            <td>
                                                <button onClick={() => handleEditBook(book)}>Edit</button>
                                                <button onClick={() => handleDeleteBook(book.id_knjiga)}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>DODAJ NOVU KNJIGU</h2>
                        <input type="text" placeholder="Naziv" value={newBook.naziv} onChange={e => setNewBook({ ...newBook, naziv: e.target.value })} />
                        <input type="text" placeholder="Godina Izdavanja" value={newBook.godina_izdavanja} onChange={e => setNewBook({ ...newBook, godina_izdavanja: e.target.value })} />
                        <input type="text" placeholder="Cijena Knjige" value={newBook.cijena_knjige} onChange={e => setNewBook({ ...newBook, cijena_knjige: e.target.value })} />
                        <input type="text" placeholder="Žanr Knjige" value={newBook.zanr_knjige} onChange={e => setNewBook({ ...newBook, zanr_knjige: e.target.value })} />
                        <select value={newBook.naziv_autor} onChange={e => setNewBook({ ...newBook, naziv_autor: e.target.value })}>
                            <option value="">Odabir autora</option>
                            {authors.map(author => (
                                <option key={author.id_autor} value={author.naziv_autor}>
                                    {author.naziv_autor}
                                </option>
                            ))}
                        </select>
                        <input type="file" onChange={e => setNewBook({ ...newBook, slika: e.target.files[0] })} />
                        <button onClick={handleAddNewBook}>Save</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StranicaAdmin;
