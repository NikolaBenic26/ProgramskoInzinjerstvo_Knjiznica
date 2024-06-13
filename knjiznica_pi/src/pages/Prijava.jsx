import React, { useState } from 'react';
import './Prijava.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Prijava() {
  const [formData, setFormData] = useState({
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
    if (!formData.korisnicko_ime) newErrors.korisnicko_ime = 'Korisničko ime is required';
    if (!formData.lozinka) newErrors.lozinka = 'Lozinka is required';
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
      const response = await axios.post('http://localhost:8800/login', formData);
      const { token, role } = response.data;
      localStorage.setItem('token', token); // Store the token in local storage
      alert('Login successful');
      if (role === 'admin') {
        navigate('/StranicaAdmin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error.response ? error.response.data : error.message);
      setServerError(error.response ? error.response.data.message : error.message);
      alert('Login failed: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="main-pagePrijava">
      <div className="form-containerPrijava">
        <h2 className="form-headerPrijava">Prijava</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-inputPrijava"
            placeholder="Korisničko ime"
            name="korisnicko_ime"
            value={formData.korisnicko_ime}
            onChange={handleChange}
            required
          />
          {errors.korisnicko_ime && <span className="error">{errors.korisnicko_ime}</span>}
          <input
            type="password"
            className="form-inputPrijava"
            placeholder="Lozinka"
            name="lozinka"
            value={formData.lozinka}
            onChange={handleChange}
            required
          />
          {errors.lozinka && <span className="error">{errors.lozinka}</span>}
          <button type="submit" className="form-buttonPrijava">Prijavi se</button>
          <button type="button" className="form-buttonPrijava" onClick={() => navigate("/")}>Povratak</button>
          {serverError && <div className="server-error">{serverError}</div>}
        </form>
      </div>
    </div>
  );
}

export default Prijava;
