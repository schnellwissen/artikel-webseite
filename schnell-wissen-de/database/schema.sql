-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_articles_views ON articles(views DESC);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, slug) VALUES
('Technologie', 'technologie'),
('Wissenschaft', 'wissenschaft'),
('Gesundheit', 'gesundheit'),
('Lifestyle', 'lifestyle'),
('Business', 'business');

-- Insert sample articles
INSERT INTO articles (title, slug, category_id, content, views) VALUES
(
    'Die Zukunft der Künstlichen Intelligenz',
    'zukunft-der-kuenstlichen-intelligenz',
    (SELECT id FROM categories WHERE slug = 'technologie'),
    '# Die Zukunft der Künstlichen Intelligenz

Künstliche Intelligenz (KI) entwickelt sich rasant weiter und wird unser Leben in den kommenden Jahren grundlegend verändern. Von autonomen Fahrzeugen bis hin zu intelligenten Assistenten - die Möglichkeiten scheinen endlos.

## Aktuelle Entwicklungen

Die neuesten Fortschritte in der KI-Forschung zeigen beeindruckende Ergebnisse in verschiedenen Bereichen:

- **Sprachmodelle**: Große Sprachmodelle können mittlerweile komplexe Texte verstehen und generieren
- **Computer Vision**: Bilderkennung erreicht menschliche Genauigkeit
- **Robotik**: Intelligente Roboter werden immer autonomer

## Zukunftsaussichten

Experten prognostizieren, dass KI in den nächsten Jahren noch intelligenter und vielseitiger wird...',
    1250
),
(
    'Gesunde Ernährung im Alltag',
    'gesunde-ernaehrung-im-alltag',
    (SELECT id FROM categories WHERE slug = 'gesundheit'),
    '# Gesunde Ernährung im Alltag

Eine ausgewogene Ernährung ist der Schlüssel zu einem gesunden Leben. Doch wie lässt sich gesunde Ernährung praktisch im Alltag umsetzen?

## Die Grundlagen

Eine gesunde Ernährung basiert auf einigen wichtigen Prinzipien:

- **Vielfalt**: Verschiedene Lebensmittelgruppen abdecken
- **Ausgewogenheit**: Richtige Mengen und Verhältnisse
- **Frische**: Wenig verarbeitete Lebensmittel bevorzugen

## Praktische Tipps

Hier sind einige einfache Strategien für den Alltag...',
    890
),
(
    'Neue Entdeckungen in der Quantenphysik',
    'neue-entdeckungen-quantenphysik',
    (SELECT id FROM categories WHERE slug = 'wissenschaft'),
    '# Neue Entdeckungen in der Quantenphysik

Die Quantenphysik überrascht uns immer wieder mit neuen, faszinierenden Entdeckungen. Jüngste Forschungen haben unser Verständnis der Quantenwelt erweitert.

## Quantenverschränkung

Ein besonders interessantes Phänomen ist die Quantenverschränkung...',
    2100
);