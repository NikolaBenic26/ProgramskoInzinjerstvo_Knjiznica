import express from "express";
import mysql from "mysql";

const app = express();

//podaci za spajanje na bazu
const db = mysql.createConnection({
  host:"student.veleri.hr",
  user:"hcancarev",
  password:"11",
  database:"hcancarev"
})

app.use(express.json());

//api prikaz knjiga
app.get("/knjige", (req,res)=>{
  const q="select * from Knjiga";
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data);
  })
})
//api prikaz autora
app.get("/autori", (req,res)=>{
  const q="select * from Autori"
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data);
  })
})
//api dohvat prodanih knjiga
app.get("/prodaneKnjige", (req,res)=>{
  const q="SELECT k.id_kupnja, k.datum_kupnje as datum,"
          +"knjiga.naziv as naziv,autor.naziv_autor,"
          +"knjiga.cijena_knjige as cijena FROM Kupnja k "
          +"left outer join Knjiga as knjiga on knjiga.id_knjiga=k.id_knjiga "
          +"left outer join Autor as autor on knjiga.id_autor=autor.id_autor ";
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data);
  })
})

//api- prikaz posudenih knjiga
app.get("/posudeneKnjige", (req,res)=>{
  const q="SELECT p.id_posudba, knjiga.naziv as Naziv,a.naziv_autor, clan.ime_clana+' '+clan.prezime_clana as Posudio FROM Posudba p "
    	    +"left outer join Knjiga as knjiga on knjiga.id_knjiga=p.id_knjiga "
          +"left outer join Clan as clan on clan.id_clan=p.id_clan "
          +"left outer join Autor a on a.id_autor=knjiga.id_autor";
  db.query(q,(err, data)=>{
    if(err) return res.json(err)
    return res.json(data);
  })
})

app.post("/novaKnjiga", (req,res)=>{
  const q ="INSERT INTO Knjiga (Naziv, Godina_izdavanja, Cijena_knjige, Zanr_knjige, ID_Autor) VALUES (?)";

  const values =[
    req.body.naziv,
    req.body.god_izd,
    req.body.cijena_knjige,
    req.body.zanr_knjige,
    req.body.id_autor
  ]
  db.query(q,[values], (err,data)=>{
    if(err)return res.json(err)
    return res.json(data)
  })
})


app.post("/noviAutor", (req, res)=>{
  const q ="INSERT INTO Autor (Naziv_autor, nacionalnost) VALUES (?)";

  const values = [
    req.body.naziv_autor,
    req.body.nacionalnost
  ]

  db.query(q,[values], (err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
  })
})

//nova kupnja gost
app.post("/novaKupnjaGost", (req, res)=>{
 
  const qGost ="INSERT INTO Gost (Ime, Prezime, Adresa, Grad, Postanski_broj, Kontakt_broj) VALUES (?)";
  const valuesGost = [
    req.body.Ime,
    req.body.Prezime,
    req.body.Adresa,
    req.body.Grad,
    req.body.Postanski_broj,
    req.body.Kontakt
  ]
  db.query(qGost,[valuesGost], (err,data)=>{
    if(err) return res.json(err)

  const gost_id = data.insertId;

  const qKupnja ="INSERT INTO Kupnja (datum_kupnje, id_knjiga, id_gost) VALUES (now() ,?)";

  const detaljiKupnje = [
    req.body.id_knjiga,
    gost_id
  ] 

  db.query(qKupnja,[detaljiKupnje], (err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
    });
  });
});


//nova kupnja clan
app.post("/novaKupnjaClan", (req, res)=>{

  const qKupnja ="INSERT INTO Kupnja (datum_kupnje, id_knjiga, id_clan) VALUES (now() ,?)";

  const detaljiKupnje = [
    req.body.id_knjiga,
    req.body.id_clan
  ] 

  db.query(qKupnja,[detaljiKupnje], (err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
    });
  });

//unos nabave
app.post("/unosNabave", (req, res)=>{

  const qNabava ="INSERT INTO Administrator (datum_nabave, id_admin, cijena_nabave, naziv_knjige) VALUES (now() ,?)";

  const detaljiNabave = [
    req.body.id_admin,
    req.body.cijena_nabave,
    req.body.naziv_knjige
  ] 

  db.query(qNabava,[detaljiNabave], (err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
    });
  });

  //api izmjene -update
  
  //izmjena knjige
  app.put("/updateKnjiga/:id", (req,res) => {
    const knjigaId = req.params.id;
    const q= "UPDATE Knjiga SET naziv=?, godina_izdavanja=?, cijena_knjige=?, zanr_knjige=?, id_autor=? where id_knjiga=?";

    const values =[
      req.body.naziv,
      req.body.god_izd,
      req.body.cijena_knjige,
      req.body.zanr_knjige,
      req.body.id_autor
    ]
    db.query(q, [...values,knjigaId], (err,data)=>{
      if(err) return res.json(err);
      return res.json(data);
    })
  })

//izmjena autora
app.put("/updateAutor/:id", (req,res) => {
  const autorId = req.params.id;
  const q= "UPDATE Autor SET naziv_autor=?,nacionalnost=? where id_autor=?";

  const values =[
    req.body.naziv_autor,
    req.body.nacionalnost
  ]
  db.query(q, [...values,autorId], (err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
  })
})

//izmjena clana 
app.put("/updateClan/:id", (req,res) => {
  const autorId = req.params.id;
  const q= "UPDATE Clan SET naziv_autor=?,nacionalnost=? where id_autor=?";
  
      const values =[
        req.body.naziv_autor,
        req.body.nacionalnost
      ]
      db.query(q, [...values,autorId], (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
      })
    })


//test za backend
app.listen(8800, ()=>{
  console.log("Connected to backend!");
})
