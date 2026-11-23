
const Database = require("better-sqlite3");
const path = require("path");

const dbPath =
    process.env.DB_PATH ||
    path.join(__dirname, "../cynbit_audit.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'received',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;
