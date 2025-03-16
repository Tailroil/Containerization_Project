import express from "express";
import pool from "../config/db";
import cors from "cors";  // Importer cors
import importCsv  from "../import_csv/importCsv"; 

const app = express();
const PORT = 3000;


app.use(cors()); 

app.use(express.json());

async function startServer() {
  try {
      await pool.query("SELECT 1"); // Vérification simple de la connexion
      console.log("Connexion à PostgreSQL réussie !");
      
      await importCsv; // Import CSV au démarrage

      app.listen(PORT, () => {
          console.log(`Serveur démarré sur http://localhost:${PORT}`);
      });

  } catch (error) {
      console.error("Erreur de connexion à PostgreSQL :", error);
      process.exit(1); // Quitter le processus si la BDD ne fonctionne pas
  }
}


app.get("/countries", async (req, res) => {
  try {
      const { rows } = await pool.query("SELECT pays FROM empreinte_pays");
      res.json(rows); // Retourne directement le tableau JSON
  } catch (error) {
      console.error("Erreur lors de la récupération des pays :", error);
      res.status(500).json({ message: "Erreur serveur" });
  }
});



app.get("/countries/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { rows } = await pool.query(
      "SELECT empreinte FROM empreinte_pays WHERE LOWER(pays) = LOWER($1)",
      [name]
    );

    if (rows.length > 0) {
      res.setHeader("Content-Type", "text/plain");
      res.send(rows[0].empreinte.toString());
    } else {
      res.status(404).send("Pays non trouvé");
    }
  } catch (error) {
    res.status(500).send("Erreur serveur");
  }
});

startServer();