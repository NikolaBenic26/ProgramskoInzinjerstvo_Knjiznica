import React from 'react';
import './Registracija.css';
import { useNavigate } from 'react-router-dom';

function Registracija () {
    let navigator = useNavigate();

    return (
        <div className="main-pageRegistracija">
            <div className="form-containerRegistracija">
                <h2 className="form-headerRegistracija">Registracija</h2>
                <input type="text" className="form-inputRegistracija" placeholder="Unesi ime" required />
                <input type="text" className="form-inputRegistracija" placeholder="Unesi prezime" required />
                <input type="text" className="form-inputRegistracija" placeholder="Adresa" required />
                <input type="text" className="form-inputRegistracija" placeholder="Grad" required />
                <input type="text" className="form-inputRegistracija" placeholder="Poštanski broj" required />
                <input type="text" className="form-inputRegistracija" placeholder="Kontakt broj" required />
                <input type="text" className="form-inputRegistracija" placeholder="Korisničko ime" required />
                <input type="password" className="form-inputRegistracija" placeholder="Lozinka" required />
                <button type="submit" className="form-buttonRegistracija" >Registriraj se</button>
                <button type="submit" className="form-buttonRegistracija" onClick={() => navigator("/")}>Povratak</button>
            </div>
        </div>
    );
};

export default Registracija;
