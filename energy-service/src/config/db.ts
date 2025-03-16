import { Pool, Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Vérifie et crée la BDD si elle n'existe pas
const createDatabase = async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'energydb'");
    if (res.rowCount === 0) {
      await client.query("CREATE DATABASE energydb");
      console.log("Base de données 'energydb' créée !");
    } else {
      console.log("Base de données 'energydb' déjà existante.");
    }
  } catch (error) {
    console.error("Erreur lors de la création de la BDD :", error);
  } finally {
    await client.end();
  }
};

(async () => {
  await createDatabase();
})();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "energydb", 
});

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS empreinte_pays (
        id SERIAL PRIMARY KEY,
        pays VARCHAR(255) UNIQUE NOT NULL,
        empreinte NUMERIC NOT NULL
      );
    `);
    console.log("Table 'empreinte_pays' prête !");
  } catch (error) {
    console.error("Erreur lors de la création de la table :", error);
  }
};

(async () => {
  await createTable();
})();

export default pool;