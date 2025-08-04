# GitHub Pages Deployment Setup

## Benötigte Dateien für GitHub Pages

Die folgenden Dateien wurden bereits erstellt:

### 1. `.github/workflows/deploy.yml`
GitHub Actions Workflow für automatische Bereitstellung

### 2. `next.config.js`
Next.js Konfiguration für statischen Export mit GitHub Pages Unterstützung

### 3. `package.json`
Erweiterte Scripts für Export und Deployment:
- `npm run export` - Statischer Export
- `npm run build-github` - Build + Export
- `npm run deploy` - Vollständiger Deployment-Prozess

### 4. `.nojekyll`
Leere Datei, die GitHub Pages mitteilt, Jekyll-Verarbeitung zu überspringen

## Setup-Schritte

### 1. Repository auf GitHub erstellen
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/IHR_USERNAME/schnell-wissen-de.git
git push -u origin main
```

### 2. Umgebungsvariablen in GitHub konfigurieren
Gehen Sie zu: Repository Settings → Secrets and variables → Actions

Fügen Sie folgende Secrets hinzu:
- `NEXT_PUBLIC_SUPABASE_URL`: Ihre Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Ihr Supabase Anonymous Key
- `NEXT_PUBLIC_GA4_ID`: Google Analytics 4 ID (optional)
- `NEXT_PUBLIC_ADSENSE_CLIENT`: Google AdSense Client ID (optional)

### 3. GitHub Pages aktivieren
1. Repository Settings → Pages
2. Source: "GitHub Actions"
3. Speichern

### 4. Deployment auslösen
Pushen Sie Code zum `main` Branch:
```bash
git push origin main
```

## Wichtige Hinweise

### Einschränkungen von GitHub Pages:
- Keine Server-Side Rendering (SSR)
- Keine API Routes
- Nur statische Dateien
- Keine dynamischen Redirects

### Anpassungen für statischen Export:
- Alle API-Aufrufe gehen direkt an Supabase
- Bilder sind für statischen Export optimiert
- Base Path wird automatisch für GitHub Pages gesetzt

### Lokale Tests:
```bash
npm run build-github
npm run serve
```

## Fehlerbehebung

### Build-Fehler:
- Überprüfen Sie Umgebungsvariablen
- Stellen Sie sicher, dass alle Abhängigkeiten installiert sind
- Prüfen Sie, ob SSR-Features verwendet werden

### Deployment-Probleme:
- Überprüfen Sie GitHub Actions Logs
- Stellen Sie sicher, dass Pages aktiviert ist
- Überprüfen Sie Repository-Berechtigungen

### URL-Probleme:
- Die Website ist verfügbar unter: `https://IHR_USERNAME.github.io/schnell-wissen-de/`
- Base Path wird automatisch gesetzt

## Kontakt
Bei Problemen: aschnellwissen@gmail.com