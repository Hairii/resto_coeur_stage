javascriptimport pg from "pg";

const { Pool } = pg;

let db;
try {
  db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false },
  });

  const client = await db.connect();
  console.log("Connexion à la base de données réussie");
  client.release();
} catch (error) {
  console.error("Erreur de connexion", error.message);
  process.exit(1);
}
