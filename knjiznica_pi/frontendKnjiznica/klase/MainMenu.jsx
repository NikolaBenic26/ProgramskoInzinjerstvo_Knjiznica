import React from 'react';
import './MainMenu.css'; // Import CSS file for styling

class MainMenu extends React.Component {
  render() {
    return (
      <div className="main-menu">
        <div className="login-registration-container">
          <button>Login</button>
          <button>Registration</button>
        </div>
        <div className="menu-buttons">
          <button>Naziv knjige</button>
          <button>Žanr knjige</button>
          <button>Godina izdavanja</button>
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <button><i className="fa fa-search"></i></button>
        </div>
      </div>
    );
  }
}

export default MainMenu;
