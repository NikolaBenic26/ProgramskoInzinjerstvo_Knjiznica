import React, { useState } from 'react';
import './Registracija.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Registracija() {
    const [formData, setFormData] = useState({
        ime_clana: '',
        prezime_clana: '',
        adresa: '',
        grad: '',
        postanski_broj: '',
        kontakt_broj: '',
        korisnicko_ime: '',
        lozinka: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8800/register', formData);
            const { token } = response.data;
            localStorage.setItem('token', token); // Store the token in local storage
            alert('Registration successful');
            navigate('/');
        } catch (error) {
            console.error('Error during registration:', error.response ? error.response.data : error.message);
            alert('Registration failed: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="main-pageRegistracija">
            <div className="form-containerRegistracija">
                <h2 className="form-headerRegistracija">Registracija</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Unesi ime"
                        name="ime_clana"
                        value={formData.ime_clana}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Unesi prezime"
                        name="prezime_clana"
                        value={formData.prezime_clana}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Adresa"
                        name="adresa"
                        value={formData.adresa}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Grad"
                        name="grad"
                        value={formData.grad}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Poštanski broj"
                        name="postanski_broj"
                        value={formData.postanski_broj}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Kontakt broj"
                        name="kontakt_broj"
                        value={formData.kontakt_broj}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Korisničko ime"
                        name="korisnicko_ime"
                        value={formData.korisnicko_ime}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        className="form-inputRegistracija"
                        placeholder="Lozinka"
                        name="lozinka"
                        value={formData.lozinka}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="form-buttonRegistracija">Registriraj se</button>
                    <button type="button" className="form-buttonRegistracija" onClick={() => navigate("/")}>Povratak</button>
                </form>
            </div>
        </div>
    );
};

export default Registracija;
