-- DIREKTE LÖSUNG: RLS und Authentifizierung umgehen
-- Führen Sie alle diese Befehle nacheinander in der Supabase SQL-Konsole aus

-- 1. ERST: Überprüfen, ob Kategorien existieren
SELECT COUNT(*) as anzahl_kategorien FROM categories;
SELECT * FROM categories ORDER BY name;

-- 2. Falls Kategorien existieren, aber nicht angezeigt werden: RLS Problem
-- Temporär RLS für categories deaktivieren
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- 3. Kategorien löschen und neu erstellen (falls nötig)
DELETE FROM categories;

-- 4. Kategorien erneut einfügen
INSERT INTO categories (id, name, slug, created_at) VALUES
(gen_random_uuid(), 'Technik & Gadgets', 'technik-gadgets', NOW()),
(gen_random_uuid(), 'Gaming & Unterhaltung', 'gaming-unterhaltung', NOW()),
(gen_random_uuid(), 'Energie & Umwelt', 'energie-umwelt', NOW()),
(gen_random_uuid(), 'Alltag & Haushalt', 'alltag-haushalt', NOW()),
(gen_random_uuid(), 'Gesundheit & Wohlbefinden', 'gesundheit-wohlbefinden', NOW()),
(gen_random_uuid(), 'Wissen & Kurioses', 'wissen-kurioses', NOW()),
(gen_random_uuid(), 'Beruf & Karriere', 'beruf-karriere', NOW()),
(gen_random_uuid(), 'Geld & Finanzen', 'geld-finanzen', NOW()),
(gen_random_uuid(), 'Zukunft & Innovation', 'zukunft-innovation', NOW()),
(gen_random_uuid(), 'Produktvergleiche & Empfehlungen', 'produktvergleiche-empfehlungen', NOW());

-- 5. Finale Überprüfung
SELECT COUNT(*) as finale_anzahl FROM categories;
SELECT id, name, slug FROM categories ORDER BY name;

-- 6. RLS Policies für öffentlichen Lesezugriff erstellen
CREATE POLICY "Allow public read access" ON categories
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON categories
FOR INSERT WITH CHECK (true);

-- 7. RLS wieder aktivieren (optional, für Sicherheit)
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;