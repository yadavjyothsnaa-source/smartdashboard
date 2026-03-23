import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'smartdash.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('analyst','admin'))
    );

    CREATE TABLE IF NOT EXISTS uploaded_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      upload_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(sender_id) REFERENCES users(id),
      FOREIGN KEY(receiver_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread' CHECK(status IN ('read','unread')),
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS ml_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      upload_id INTEGER NOT NULL,
      result TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Seed default users if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  if (count.c === 0) {
    const hash = (p: string) => bcrypt.hashSync(p, 10);
    const insert = db.prepare('INSERT INTO users (user_id, name, password, role) VALUES (?, ?, ?, ?)');
    insert.run('Jyothsna_DA_D1', 'Jyothsna', hash('RhelpJ'), 'analyst');
    insert.run('Rang_Ad_A1', 'Ranganatha', hash('RhelpJ'), 'admin');
  }
}

export type User = { id: number; name: string; email: string; role: string };
export type Message = { id: number; sender_id: number; receiver_id: number; message: string; timestamp: string; sender_name?: string };
export type Notification = { id: number; user_id: number; message: string; status: string; timestamp: string };
export type UploadedData = { id: number; user_id: number; file_name: string; file_path: string; upload_date: string };
export type MlPrediction = { id: number; user_id: number; upload_id: number; result: string; created_at: string };
