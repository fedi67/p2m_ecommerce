-- ==========================================
-- TABLE CLIENTS (AUTHENTIFICATION)
-- ==========================================
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, 
    gender VARCHAR(10),
    country VARCHAR(100),
    age INTEGER,
    preferences JSONB DEFAULT '{}', 
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);