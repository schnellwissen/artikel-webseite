-- AUTOREN-SYSTEM: Datenbank-Setup
-- Führen Sie diese Befehle in der Supabase SQL-Konsole aus

-- 1. Erstelle authors Tabelle
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Füge die 5 Autoren hinzu
INSERT INTO authors (id, name, image_url) VALUES
(1, 'Lena Hartwig', '/uploads/authors/lena-hartwig.png'),
(2, 'Tom Mertens', '/uploads/authors/tom-mertens.png'),
(3, 'Sofia Klein', '/uploads/authors/sofia-klein.png'),
(4, 'David Lorenz', '/uploads/authors/david-lorenz.png'),
(5, 'Julia Sommer', '/uploads/authors/julia-sommer.png');

-- 3. Erweitere articles Tabelle um author_id
ALTER TABLE articles ADD COLUMN author_id INTEGER REFERENCES authors(id);

-- 4. Weise bestehenden Artikeln zufällige Autoren zu
UPDATE articles 
SET author_id = (
    SELECT id FROM authors 
    ORDER BY RANDOM() 
    LIMIT 1
) 
WHERE author_id IS NULL;

-- 5. Erstelle Index für bessere Performance
CREATE INDEX idx_articles_author_id ON articles(author_id);

-- 6. RLS Policies für authors Tabelle
CREATE POLICY "Allow public read access" ON authors
FOR SELECT USING (true);

-- 7. Überprüfung
SELECT 
    a.title,
    a.slug,
    au.name as author_name,
    au.image_url as author_image
FROM articles a
LEFT JOIN authors au ON a.author_id = au.id
ORDER BY a.created_at DESC
LIMIT 5;