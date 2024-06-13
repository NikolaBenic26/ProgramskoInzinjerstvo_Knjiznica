import React, { useState } from 'react';
import './Registracija.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Registracija() {
    const [formData, setFormData] = useState({
        ime_clana: '',
        prezime_clana: '',
        adresa_clana: '',
        grad_clan: '',
        postanski_broj: '',
        kontakt_broj: '',
        korisnicko_ime: '',
        lozinka: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.ime_clana) newErrors.ime_clana = 'Ime is required';
        if (!formData.prezime_clana) newErrors.prezime_clana = 'Prezime is required';
        if (!formData.adresa_clana) newErrors.adresa_clana = 'Adresa is required';
        if (!formData.grad_clan) newErrors.grad_clan = 'Grad is required';
        if (!formData.postanski_broj) {
            newErrors.postanski_broj = 'Poštanski broj is required';
        } else if (!/^\d{5}$/.test(formData.postanski_broj)) {
            newErrors.postanski_broj = 'Poštanski broj must be 5 digits';
        }
        if (!formData.kontakt_broj) {
            newErrors.kontakt_broj = 'Kontakt broj is required';
        } else if (!/^\d+$/.test(formData.kontakt_broj)) {
            newErrors.kontakt_broj = 'Kontakt broj must be digits only';
        }
        if (!formData.korisnicko_ime) newErrors.korisnicko_ime = 'Korisničko ime is required';
        if (!formData.lozinka) {
            newErrors.lozinka = 'Lozinka is required';
        } else if (formData.lozinka.length < 6) {
            newErrors.lozinka = 'Lozinka must be at least 6 characters';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        try {
            const response = await axios.post('http://localhost:8800/register', formData);
            const { token } = response.data;
            localStorage.setItem('token', token); // Store the token in local storage
            alert('Registration successful');
            navigate('/');
        } catch (error) {
            console.error('Error during registration:', error.response ? error.response.data : error.message);
            setServerError(error.response ? error.response.data.message : error.message);
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
                    {errors.ime_clana && <span className="error">{errors.ime_clana}</span>}
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Unesi prezime"
                        name="prezime_clana"
                        value={formData.prezime_clana}
                        onChange={handleChange}
                        required
                    />
                    {errors.prezime_clana && <span className="error">{errors.prezime_clana}</span>}
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Adresa"
                        name="adresa_clana"
                        value={formData.adresa_clana}
                        onChange={handleChange}
                        required
                    />
                    {errors.adresa_clana && <span className="error">{errors.adresa_clana}</span>}
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Grad"
                        name="grad_clan"
                        value={formData.grad_clan}
                        onChange={handleChange}
                        required
                    />
                    {errors.grad_clan && <span className="error">{errors.grad_clan}</span>}
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Poštanski broj"
                        name="postanski_broj"
                        value={formData.postanski_broj}
                        onChange={handleChange}
                        required
                    />
                    {errors.postanski_broj && <span className="error">{errors.postanski_broj}</span>}
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Kontakt broj"
                        name="kontakt_broj"
                        value={formData.kontakt_broj}
                        onChange={handleChange}
                        required
                    />
                    {errors.kontakt_broj && <span className="error">{errors.kontakt_broj}</span>}
                    <input
                        type="text"
                        className="form-inputRegistracija"
                        placeholder="Korisničko ime"
                        name="korisnicko_ime"
                        value={formData.korisnicko_ime}
                        onChange={handleChange}
                        required
                    />
                    {errors.korisnicko_ime && <span className="error">{errors.korisnicko_ime}</span>}
                    <input
                        type="password"
                        className="form-inputRegistracija"
                        placeholder="Lozinka"
                        name="lozinka"
                        value={formData.lozinka}
                        onChange={handleChange}
                        required
                    />
                    {errors.lozinka && <span className="error">{errors.lozinka}</span>}
                    <button type="submit" className="form-buttonRegistracija">Registriraj se</button>
                    <button type="button" className="form-buttonRegistracija" onClick={() => navigate("/")}>Povratak</button>
                    {serverError && <div className="server-error">{serverError}</div>}
                </form>
            </div>
        </div>
    );
};

export default Registracija;