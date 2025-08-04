-- Neue Kategorien für SchnellWissen.de
-- Zuerst die alten Beispiel-Kategorien löschen (optional)
-- DELETE FROM categories WHERE slug IN ('technologie', 'wissenschaft', 'gesundheit', 'lifestyle', 'business');

-- Neue Kategorien einfügen
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
('Produktvergleiche & Empfehlungen', 'produktvergleiche-empfehlungen');

-- Überprüfen der eingefügten Kategorien
SELECT * FROM categories ORDER BY name;