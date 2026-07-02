const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.resolve(process.env.DB_PATH || './database/tasks.db');

const db = new Database(DB_PATH,{verbose: process.env.NODE_ENV !== 'development' ? console.log : null});

db.pragma('journal_mode = WAL');

db.pragma('foreign_keys = ON');

function initialiseDatabase() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS  tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK(length(title)>0 AND length(title)<=200),
        is_completed INTEGER NOT NULL DEFAULT 0 CHECK(is_completed IN (0,1)),
        created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
        updated_at DATETIME NOT NULL DEFAULT (datetime('now','localtime'))




        )
        
        `)
        console.log("Database initialised successfully at",DB_PATH);
}

module.exports = {db,initialiseDatabase};