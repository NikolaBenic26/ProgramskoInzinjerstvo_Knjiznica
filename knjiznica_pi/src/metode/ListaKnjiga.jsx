import React from 'react';
import Knjiga from './Knjiga';

function ListaKnjiga({ knjige }) {
  return (
    <div className="lista-knjiga">
     {knjige.map(knjiga => <Knjiga key={knjiga.id} {...knjiga} />)}
    </div>
  );
}

export default ListaKnjiga;
