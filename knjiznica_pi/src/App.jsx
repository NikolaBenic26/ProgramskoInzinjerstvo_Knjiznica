import React from 'react';
import Header from './metode/Header';
import Sidebar from './metode/Sidebar';
import SearchBar from './metode/SearchBar';
import ListaKnjiga from './metode/ListaKnjiga';

function App() {
  const knjige = [{
    id: 1,
    slika: 'slika',
    naslov: 'Naslov knjige1',
    autor: 'Ime autora',
    godina: 'Godina izdavanja'
  }, {
    id: 2,
    slika: 'slika',
    naslov: 'Naslov knjige2',
    autor: 'Ime autora',
    godina: 'Godina izdavanja'
  }];

  return (
    <div className="App">
      <Header />
      <Sidebar />
      <SearchBar />
      <ListaKnjiga knjige={knjige} />
    </div>
  );
}

export default App;


