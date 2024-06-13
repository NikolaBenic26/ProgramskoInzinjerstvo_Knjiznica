import React from 'react';
import './Prijava.css';
import { useNavigate } from 'react-router-dom';

function Prijava () {
    let navigator = useNavigate();

    return (
        <div className="main-pagePrijava">
            <div className="form-containerPrijava">
                <h2 className="form-headerPrijava">Prijava</h2>
                <input type="text" className="form-inputPrijava" placeholder="Korisničko ime" required />
                <input type="password" className="form-inputPrijava" placeholder="Lozinka" required />
                <button type="submit" className="form-buttonPrijava" >Prijavi se</button>
                <button type="submit" className="form-buttonPrijava" onClick={() => navigator("/")}>Povratak</button>
            </div>
        </div>
    );
};

export default Prijava;
