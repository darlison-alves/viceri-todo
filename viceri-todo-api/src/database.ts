import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: './database.db',
  driver: sqlite3.Database,
});

console.log("[simulação de migration de banco de dados]");
try {
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

} catch (error) {
  console.error("Erro ao criar a tabela todos:", error);
  throw error;
}
console.log("[script de migration table todos]")

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
  );
`);

console.log("[script de migration table users]")
