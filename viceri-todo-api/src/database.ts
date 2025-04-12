import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: './database.db',
  driver: sqlite3.Database,
});

console.log("[simulação de migration]")
await db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    priority TEXT NOT NULL,
    userId INTEGER NOT NULL,
    done BOOLEAN DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);


await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
  );
`);
