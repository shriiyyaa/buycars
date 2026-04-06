const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'buycars.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS oem_specs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    list_price REAL NOT NULL,
    colors TEXT NOT NULL,
    mileage_kmpl REAL NOT NULL,
    power_bhp REAL NOT NULL,
    max_speed_kmph INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS marketplace_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dealer_id INTEGER NOT NULL,
    oem_spec_id INTEGER,
    image_url TEXT,
    title TEXT NOT NULL,
    description TEXT,
    asking_price REAL NOT NULL,
    color TEXT NOT NULL,
    odometer_km INTEGER NOT NULL,
    major_scratches INTEGER DEFAULT 0,
    original_paint INTEGER DEFAULT 1,
    accidents_reported INTEGER DEFAULT 0,
    previous_buyers INTEGER DEFAULT 0,
    registration_place TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dealer_id) REFERENCES users(id),
    FOREIGN KEY (oem_spec_id) REFERENCES oem_specs(id)
  );
`);

console.log('Connected to SQLite database');
module.exports = db;