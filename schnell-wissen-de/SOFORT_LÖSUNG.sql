-- SOFORT-LÖSUNG: Kategorien direkt in Supabase erstellen
-- Kopieren Sie diesen SQL-Code und führen Sie ihn in der Supabase SQL-Konsole aus

-- 1. Gehen Sie zu: https://supabase.com/dashboard
-- 2. Wählen Sie Ihr Projekt
-- 3. Klicken Sie auf "SQL Editor" im linken Menü
-- 4. Fügen Sie diesen Code ein und klicken Sie auf "Run"

-- Löschen Sie zuerst eventuelle alte/leere Kategorien (optional)
-- DELETE FROM categories;

-- Erstellen Sie die 10 Standard-Kategorien
INSERT INTO categories (name, slug) VALUES
('Technik & Gadgets', 'technik-gadgets'),
('Gaming & Unterhaltung', 'gaming-unterhaltung'),
('Energie & Umwelt', 'energie-umwelt'),
('Alltag & Haushalt', 'alltag-haushalt'),
('Gesundheit & Wohlbefinden', 'gesundheit-wohlbefinden'),
('Wissen & Kurioses', 'wissen-kurioses'),
('Beruf & Karriere', 'beruf-karriere'),
('Geld & Finanzen', 'geld-finanzen'),
('Zukunft & Innovation', 'zukunft-innovation'),
('Produktvergleiche & Empfehlungen', 'produktvergleiche-empfehlungen')
ON CONFLICT (slug) DO NOTHING;

-- Überprüfen Sie das Ergebnis
SELECT COUNT(*) as anzahl_kategorien FROM categories;
SELECT * FROM categories ORDER BY name;