import express from "express";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";


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
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// User registration endpoint
app.post('/register', async (req, res) => {
  const { ime_clana, prezime_clana, adresa_clana, grad_clan, postanski_broj, kontakt_broj, korisnicko_ime, lozinka } = req.body;

  try {
    db.query('SELECT * FROM Clan WHERE korisnicko_ime = ?', [korisnicko_ime], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database query error', error: err });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(lozinka, 10);
      const query = 'INSERT INTO Clan (ime_clana, prezime_clana, adresa_clana, grad_clan, postanski_broj, kontakt_broj, korisnicko_ime, lozinka) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [ime_clana, prezime_clana, adresa_clana, grad_clan, postanski_broj, kontakt_broj, korisnicko_ime, hashedPassword];
      
      db.query(query, values, (err, results) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ message: 'Error registering user', error: err });
        }

        const id_clan = results.insertId;
        const token = jwt.sign({ id_clan }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ message: 'User registered successfully', token });
      });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error processing request', error });
  }
});

// Get all members
app.get('/clanovi', authenticateJWT, (req, res) => {
  const query = 'SELECT * FROM Clan';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error fetching members', error: err });
    }
    res.status(200).json(results);
  });
});

// User login endpoint
app.post('/login', (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;

  const query = 'SELECT * FROM Clan WHERE korisnicko_ime = ?';
  db.query(query, [korisnicko_ime], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error logging in', error: err });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(lozinka, user.lozinka);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id_clan: user.id_clan, role: user.korisnicko_ime === 'admin' ? 'admin' : 'user' }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, role: user.korisnicko_ime === 'admin' ? 'admin' : 'user' });
  });
});

app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

app.put('/clanovi/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const { ime_clana, prezime_clana, adresa_clana, grad_clan, postanski_broj, kontakt_broj, korisnicko_ime, lozinka } = req.body;
  const hashedPassword = lozinka ? bcrypt.hashSync(lozinka, 10) : null;

  const query = `UPDATE Clan SET ime_clana=?, prezime_clana=?, adresa_clana=?, grad_clan=?, postanski_broj=?, kontakt_broj=?, korisnicko_ime=?, lozinka=? WHERE id_clan=?`;
  const values = [ime_clana, prezime_clana, adresa_clana, grad_clan, postanski_broj, kontakt_broj, korisnicko_ime, hashedPassword, id];

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member updated successfully' });
  });
});

app.delete('/clanovi/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Clan WHERE id_clan=?';

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member deleted successfully' });
  });
});

// Get all books
app.get('/knjige', (req, res) => {
  const query = 'SELECT * FROM Knjiga';
  db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
  });
});

// API to add a new book
app.post('/knjige', upload.single('slika'), (req, res) => {
  const { naziv, godina_izdavanja, cijena_knjige, zanr_knjige, id_autor } = req.body;
  const slika = req.file ? `/uploads/${req.file.filename}` : null;
  
  // Ensure all required fields are provided
  if (!naziv || !godina_izdavanja || !cijena_knjige || !zanr_knjige || !id_autor || !slika) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO Knjiga (naziv, godina_izdavanja, cijena_knjige, zanr_knjige, id_autor, slika) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [naziv, godina_izdavanja, cijena_knjige, zanr_knjige, id_autor, slika];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting new book:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, ...req.body, slika });
  });
});


// Update a book
app.put('/knjige/:id', (req, res) => {
  const { id } = req.params;
  const { naziv, godina_izdavanja, cijena_knjige, zanr_knjige, id_autor, slika } = req.body;
  const query = 'UPDATE Knjiga SET naziv = ?, godina_izdavanja = ?, cijena_knjige = ?, zanr_knjige = ?, id_autor = ?, slika = ? WHERE id_knjiga = ?';
  db.query(query, [naziv, godina_izdavanja, cijena_knjige, zanr_knjige, id_autor, slika, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Book updated successfully' });
  });
});

// Delete a book
app.delete('/knjige/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Knjiga WHERE id_knjiga = ?';
  db.query(query, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Book deleted successfully' });
  });
});

app.get('/autori', authenticateJWT, (req, res) => {
  const query = 'SELECT * FROM Autor';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error fetching authors', error: err });
    }
    res.status(200).json(results);
  });
});


// Get a single author by ID
app.get('/autor/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Autor WHERE id_autor = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error fetching author', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json(results[0]);
  });
});

// Add a new author
app.post('/autor', authenticateJWT, (req, res) => {
  const { naziv_autor, nacionalnost } = req.body;
  const query = 'INSERT INTO Autor (naziv_autor, nacionalnost) VALUES (?, ?)';
  db.query(query, [naziv_autor, nacionalnost], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error adding author', error: err });
    }
    res.status(201).json({ message: 'Author added successfully', id: results.insertId });
  });
});

// Update an author by ID
app.put('/autor/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const { naziv_autor, nacionalnost } = req.body;
  const query = 'UPDATE Autor SET naziv_autor = ?, nacionalnost = ? WHERE id_autor = ?';
  db.query(query, [naziv_autor, nacionalnost, id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error updating author', error: err });
    }
    res.status(200).json({ message: 'Author updated successfully' });
  });
});

// Delete an author by ID
app.delete('/autor/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Autor WHERE id_autor = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error deleting author', error: err });
    }
    res.status(200).json({ message: 'Author deleted successfully' });
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
      CONCAT(knjiga.naziv, ', ', a.naziv_autor) AS naziv_autor,
      '1' AS kolicina,
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


// API to delete book
app.delete("/deleteKnjiga/:id", authenticateJWT, (req, res) => {
  const bookId = req.params.id;
  const query = "DELETE FROM Knjiga WHERE id_knjiga = ?";
  db.query(query, [bookId], (err, data) => {
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
