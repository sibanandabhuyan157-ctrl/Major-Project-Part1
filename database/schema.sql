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

CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_notifications (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    reg_no TEXT NOT NULL DEFAULT '',
    hostel TEXT NOT NULL DEFAULT '',
    room_no TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    full_address TEXT NOT NULL DEFAULT '',
    items_json TEXT NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    estimated_minutes INTEGER NOT NULL DEFAULT 6,
    status TEXT NOT NULL DEFAULT 'Preparing',
    is_read INTEGER NOT NULL DEFAULT 0,
    receipt_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_notifications (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    status TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_order ON admin_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_student ON user_notifications(student_name);
CREATE INDEX IF NOT EXISTS idx_user_notifications_order ON user_notifications(order_id);
