-- 1. On active le super-pouvoir de pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. On ajoute la colonne pour stocker les vecteurs de Gemini (768 dimensions)
ALTER TABLE products ADD COLUMN embedding vector(768);