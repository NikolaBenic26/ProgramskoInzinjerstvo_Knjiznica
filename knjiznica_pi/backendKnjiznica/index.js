import express from "express";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";



// Load environment variables from .env file
dotenv.config();


const app = express();
const port = process.env.PORT || 8800;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.use(cors({
  origin: 'http://localhost:3000', // Replace with the origin of your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());


// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// User registration endpoint
app.post('/register', async (req, res) => {
  const { ime_clana, prezime_clana, adresa_clana, grad, postanski_broj, kontakt_broj, korisnicko_ime, lozinka } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(lozinka, 10);
    const query = 'INSERT INTO Clan (ime_clana, prezime_clana, adresa_clana, grad_clan, postanski_broj, kontakt_broj, korisnicko_ime, lozinka) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [ime_clana, prezime_clana, adresa_clana, grad, postanski_broj, kontakt_broj, korisnicko_ime, hashedPassword];
    
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Error registering user', error: err });
      }

      const id_clan = results.insertId; // Get the inserted id_clan
      const token = jwt.sign({ id_clan }, jwtSecret, { expiresIn: '1h' }); // Generate JWT token with id_clan

      res.status(200).json({ message: 'User registered successfully', token });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error processing request', error });
  }
});

// Get all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM Clan';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error fetching users', error: err });
    }
    res.status(200).json(results);
  });
});

// Get a single user by ID
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Clan WHERE id_clan = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error fetching user', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(results[0]);
  });
});

// Update a user by ID
app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { ime_clana, prezime_clana, adresa_clana, grad_clan, postanski_broj, kontakt_broj, korisnicko_ime, lozinka } = req.body;
  const query = 'UPDATE Clan SET ime_clana = ?, prezime_clana = ?, adresa_clana = ?, grad_clan = ?, postanski_broj = ?, kontakt_broj = ?, korisnicko_ime = ?, lozinka = ? WHERE id_clan = ?';
  const values = [ime_clana, prezime_clana, adresa_clana, grad_clan, postanski_broj, kontakt_broj, korisnicko_ime, lozinka, id];
  
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error updating user', error: err });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
});

// Delete a user by ID
app.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Clan WHERE id_clan = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error deleting user', error: err });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});



// User login endpoint
app.post("/login", (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;

  const query = "SELECT * FROM Clan WHERE korisnicko_ime = ?";
  db.query(query, [korisnicko_ime], async (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(400).json({ message: "Neispravno korisničko ime ili lozinka." });

    const user = data[0];
    const validLozinka = await bcrypt.compare(lozinka, user.lozinka);
    if (!validLozinka) return res.status(400).json({ message: "Neispravno korisničko ime ili lozinka." });

    const token = jwt.sign({ id: user.id, korisnicko_ime: user.korisnicko_ime }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  });
});

// API to get all books
app.get("/knjige", authenticateJWT, (req, res) => {
  const query = "SELECT * FROM Knjiga";
  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});



// API to get all authors
app.get("/autori", authenticateJWT, (req, res) => {
  const query = "SELECT * FROM Autor";
  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to get sold books
app.get("/prodaneKnjige", authenticateJWT, (req, res) => {
  const query = `
    SELECT 
      k.id_kupnja, 
      k.datum_kupnje AS datum,
      knjiga.naziv AS naziv,
      autor.naziv_autor,
      knjiga.cijena_knjige AS cijena 
    FROM Kupnja k 
    LEFT JOIN Knjiga AS knjiga ON knjiga.id_knjiga = k.id_knjiga 
    LEFT JOIN Autor AS autor ON knjiga.id_autor = autor.id_autor
  `;
  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to get borrowed books
app.get("/posudeneKnjige", authenticateJWT, (req, res) => {
  const query = `
    SELECT 
      p.id_posudba, 
      knjiga.naziv AS naziv,
      a.naziv_autor, 
      CONCAT(clan.ime_clana, ' ', clan.prezime_clana) AS posudio 
    FROM Posudba p 
    LEFT JOIN Knjiga AS knjiga ON knjiga.id_knjiga = p.id_knjiga 
    LEFT JOIN Clan AS clan ON clan.id_clan = p.id_clan 
    LEFT JOIN Autor a ON a.id_autor = knjiga.id_autor
  `;
  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to add a new book
app.post("/novaKnjiga", authenticateJWT, (req, res) => {
  const query = "INSERT INTO Knjiga (naziv, godina_izdavanja, cijena_knjige, zanr_knjige, id_autor) VALUES (?)";
  const values = [
    req.body.naziv,
    req.body.god_izd,
    req.body.cijena_knjige,
    req.body.zanr_knjige,
    req.body.id_autor
  ];
  db.query(query, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to add a new author
app.post("/noviAutor", authenticateJWT, (req, res) => {
  const query = "INSERT INTO Autor (naziv_autor, nacionalnost) VALUES (?)";
  const values = [
    req.body.naziv_autor,
    req.body.nacionalnost
  ];
  db.query(query, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to add a new purchase by guest
app.post("/novaKupnjaGost", authenticateJWT, (req, res) => {
  const guestQuery = "INSERT INTO Gost (ime, prezime, adresa, grad, postanski_broj, kontakt_broj) VALUES (?)";
  const guestValues = [
    req.body.ime,
    req.body.prezime,
    req.body.adresa,
    req.body.grad,
    req.body.postanski_broj,
    req.body.kontakt_broj
  ];

  db.query(guestQuery, [guestValues], (err, guestData) => {
    if (err) return res.status(500).json(err);

    const guestId = guestData.insertId;
    const purchaseQuery = "INSERT INTO Kupnja (datum_kupnje, id_knjiga, id_gost) VALUES (NOW(), ?, ?)";
    const purchaseValues = [
      req.body.id_knjiga,
      guestId
    ];

    db.query(purchaseQuery, purchaseValues, (err, purchaseData) => {
      if (err) return res.status(500).json(err);
      res.json(purchaseData);
    });
  });
});

// API to add a new purchase by member
app.post("/novaKupnjaClan", authenticateJWT, (req, res) => {
  const query = "INSERT INTO Kupnja (datum_kupnje, id_knjiga, id_clan) VALUES (NOW(), ?, ?)";
  const values = [
    req.body.id_knjiga,
    req.body.id_clan
  ];
  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to add a new acquisition
app.post("/unosNabave", authenticateJWT, (req, res) => {
  const query = "INSERT INTO Administrator (datum_nabave, id_admin, cijena_nabave, naziv_knjige) VALUES (NOW(), ?, ?, ?)";
  const values = [
    req.body.id_admin,
    req.body.cijena_nabave,
    req.body.naziv_knjige
  ];
  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to update book
app.put("/updateKnjiga/:id", authenticateJWT, (req, res) => {
  const bookId = req.params.id;
  const query = "UPDATE Knjiga SET naziv = ?, godina_izdavanja = ?, cijena_knjige = ?, zanr_knjige = ?, id_autor = ? WHERE id_knjiga = ?";
  const values = [
    req.body.naziv,
    req.body.god_izd,
    req.body.cijena_knjige,
    req.body.zanr_knjige,
    req.body.id_autor
  ];
  db.query(query, [...values, bookId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to update author
app.put("/updateAutor/:id", authenticateJWT, (req, res) => {
  const authorId = req.params.id;
  const query = "UPDATE Autor SET naziv_autor = ?, nacionalnost = ? WHERE id_autor = ?";
  const values = [
    req.body.naziv_autor,
    req.body.nacionalnost
  ];
  db.query(query, [...values, authorId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to update member
app.put("/updateClan/:id", authenticateJWT, (req, res) => {
  const memberId = req.params.id;
  const query = "UPDATE Clan SET ime_clana = ?, prezime_clana = ?, adresa = ?, grad = ?, postanski_broj = ?, kontakt_broj = ? WHERE id_clan = ?";
  const values = [
    req.body.ime_clana,
    req.body.prezime_clana,
    req.body.adresa,
    req.body.grad,
    req.body.postanski_broj,
    req.body.kontakt_broj
  ];
  db.query(query, [...values, memberId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to delete book
app.delete("/deleteKnjiga/:id", authenticateJWT, (req, res) => {
  const bookId = req.params.id;
  const query = "DELETE FROM Knjiga WHERE id_knjiga = ?";
  db.query(query, [bookId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to delete member
app.delete("/deleteClan/:id", authenticateJWT, (req, res) => {
  const memberId = req.params.id;
  const query = "DELETE FROM Clan WHERE id_clan = ?";
  db.query(query, [memberId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// API to delete purchase
app.delete("/deleteKupnja/:id", authenticateJWT, (req, res) => {
  const purchaseId = req.params.id;
  const query = "DELETE FROM Kupnja WHERE id_kupnja = ?";
  db.query(query, [purchaseId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
