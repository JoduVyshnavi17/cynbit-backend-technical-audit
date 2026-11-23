const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "../cynbit_audit.db"));

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