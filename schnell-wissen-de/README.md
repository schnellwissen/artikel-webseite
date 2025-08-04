# SchnellWissen.de

Eine moderne Content-Website für tägliche Artikel zu verschiedenen Themen wie Technologie, Wissenschaft, Gesundheit und mehr.

## 🚀 Technologie-Stack

- **Frontend**: Next.js 14 mit App Router, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL Database, Authentication, Storage)
- **State Management**: Zustand
- **Styling**: TailwindCSS mit responsivem Design
- **Content**: Markdown-Support für Artikel
- **SEO**: Automatische Sitemap, Metadaten, OpenGraph

## 📁 Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── artikel/[slug]/     # Artikel-Detailseiten
│   ├── kategorie/[slug]/   # Kategorie-Seiten
│   ├── admin/              # Admin-Interface
│   ├── layout.tsx          # Root Layout
│   ├── page.tsx            # Homepage
│   ├── sitemap.ts          # Automatische Sitemap
│   └── robots.ts           # SEO Robots.txt
├── components/
│   ├── layout/             # Header, Sidebar, Footer
│   ├── ui/                 # UI-Komponenten
│   └── admin/              # Admin-Komponenten
├── lib/
│   ├── api.ts              # Supabase API-Funktionen
│   ├── supabase.ts         # Supabase Client
│   ├── types.ts            # TypeScript Definitionen
│   ├── utils.ts            # Hilfsfunktionen
│   └── metadata.ts         # SEO Metadaten
└── store/                  # Zustand State Management
```

## 🎯 Features

### ✅ Implementiert

- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Startseite**: Hero-Bereich, Top 3 Artikel des Monats, neueste Artikel
- **Artikel-System**: Vollständige CRUD-Funktionalität mit Markdown-Support
- **Kategorien**: Dynamische Kategorien mit Filterung
- **Sidebar**: Kategorien-Navigation und Top-Artikel
- **Admin-Panel**: Upload-Interface für neue Artikel und Kategorien
- **SEO-Optimierung**: Metadaten, Sitemap, Open Graph, Twitter Cards
- **Klickzähler**: Automatische View-Tracking für Artikel
- **Performance**: Lazy Loading, optimierte Images

### 🔄 Vorbereitet für

- **Google AdSense**: Werbeplätze sind vorbereitet
- **Analytics**: Google Analytics Integration möglich
- **Search**: Suchfunktionalität (UI vorbereitet)

## 🛠️ Setup & Installation

### 1. Dependencies installieren

```bash
npm install
```

### 2. Supabase-Projekt einrichten

1. Erstellen Sie ein neues Projekt auf [supabase.com](https://supabase.com)
2. Führen Sie die SQL-Befehle aus den Dateien in `database/` aus:
   - `database/schema.sql` - Erstellt Tabellen und Beispieldaten
   - `database/functions.sql` - Erstellt benötigte Datenbankfunktionen

### 3. Umgebungsvariablen konfigurieren

Tragen Sie Ihre Supabase-Credentials in `.env.local` ein:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=ihre_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=ihr_supabase_service_role_key

# Für Produktion
NEXT_PUBLIC_SITE_URL=https://schnell-wissen.de
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

## 📊 Datenbank-Schema

### Articles Table
```sql
- id: UUID (Primary Key)
- title: TEXT (Artikel-Titel)
- slug: TEXT (URL-freundlicher Slug)
- category_id: UUID (Referenz zu categories)
- content: TEXT (Markdown-Inhalt)
- image_url: TEXT (Optionales Titelbild)
- views: INTEGER (Klickzähler)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Categories Table
```sql
- id: UUID (Primary Key)
- name: TEXT (Kategorie-Name)
- slug: TEXT (URL-freundlicher Slug)
- created_at: TIMESTAMPTZ
```

## 🎨 Design-System

Das Projekt verwendet ein konsistentes Design-System basierend auf TailwindCSS:

- **Farben**: Blaue Primary-Palette, neutrale Grautöne
- **Typography**: Inter Font für optimale Lesbarkeit
- **Spacing**: Konsistente Abstände nach 8px Grid
- **Components**: Wiederverwendbare UI-Komponenten
- **Responsive**: Mobile-first Ansatz

## 🔧 Deployment

### Vercel (Empfohlen)

1. Repository zu GitHub pushen
2. Vercel-Account verbinden
3. Umgebungsvariablen in Vercel hinzufügen
4. Automatisches Deployment bei Git-Push

### Andere Plattformen

Das Projekt ist kompatibel mit allen Next.js-unterstützenden Plattformen:
- Netlify, Railway, AWS Amplify
- Selbst gehostet mit Docker

## 📈 SEO & Performance

- **Lighthouse Score**: Optimiert für 90+ in allen Kategorien
- **Core Web Vitals**: Optimierte Loading-Performance
- **Structured Data**: JSON-LD für bessere Search Engine Visibility
- **Image Optimization**: Next.js Image Component mit automatischer Optimierung
- **Sitemap**: Automatisch generiert für alle Artikel und Kategorien

## 📝 Content-Management

### Artikel erstellen

1. Besuchen Sie `/admin` 
2. Füllen Sie das Formular aus:
   - Titel (wird automatisch zu URL-Slug)
   - Kategorie auswählen
   - Markdown-Content
   - Optionales Titelbild (URL)
3. Artikel wird sofort publiziert

### Kategorien verwalten

Neue Kategorien können über das Admin-Panel erstellt werden. Bestehende Kategorien werden automatisch in der Sidebar angezeigt.

---

**SchnellWissen.de** - Schnell informiert, fundiert erklärt. 🚀
