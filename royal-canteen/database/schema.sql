CREATE TABLE IF NOT EXISTS app_metadata (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS menu (
    id TEXT PRIMARY KEY,
    position INTEGER NOT NULL,
    record_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    position INTEGER NOT NULL,
    record_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    position INTEGER NOT NULL,
    record_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    position INTEGER NOT NULL,
    record_json TEXT NOT NULL
);
