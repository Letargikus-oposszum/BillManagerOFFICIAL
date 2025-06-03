import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbPromise = open({
  filename: `${__dirname}/Bills.db`,
  driver: sqlite3.Database,
});

const initDB = async () => {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS parties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      tax_number TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issuer_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      invoice_number TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      fulfillment_date TEXT NOT NULL,
      payment_deadline TEXT NOT NULL,
      total_amount REAL NOT NULL,
      vat_amount REAL NOT NULL,
      FOREIGN KEY (issuer_id) REFERENCES parties(id),
      FOREIGN KEY (customer_id) REFERENCES parties(id)
    );
  `);
};

await initDB();
export default dbPromise;
