import React from 'react';
import './KupnjaKnjiga.css';

const BookDetails = () => {
  return (
    <div className="containerKnjiga">
      <button className="back-buttonKnjiga">POVRATAK</button>
      <div className="member-infoKnjiga">ČLAN<br />PERO PERIĆ</div>
      <div className="image-containerKnjiga">
        <div className="image-placeholderKnjiga">SLIKA</div>
      </div>
      <div className="detailsKnjiga">
        <div className="detail-itemKnjiga">
          <span className="labelKnjiga">NASLOV</span>
        </div>
        <div className="detail-itemKnjiga">
          <span className="labelKnjiga">AUTOR</span>
        </div>
        <div className="detail-itemKnjiga">
          <span className="labelKnjiga">GODINA IZDAVANJA</span>
        </div>
        <div className="detail-itemKnjiga">
          <span className="labelKnjiga">CIJENA</span>
        </div>
        <div className="detail-itemKnjiga">
          <span className="labelKnjiga">DOSTUPNO: X</span>
        </div>
        <div className="buttonsKnjiga">
          <button className="action-buttonKnjiga">POSUDBA</button>
          <button className="action-buttonKnjiga">KUPOVINA</button>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
