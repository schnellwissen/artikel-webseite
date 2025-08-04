-- DSGVO Consent System - Datenbank Setup
-- Führen Sie diese Befehle in der Supabase SQL-Konsole aus

-- 1. Erstelle consent_logs Tabelle für die Protokollierung
CREATE TABLE consent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    anonymous_id VARCHAR(255) NOT NULL,
    preferences JSONB NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    policy_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    region VARCHAR(10) NOT NULL DEFAULT 'DE',
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index für bessere Performance
CREATE INDEX idx_consent_logs_timestamp ON consent_logs(timestamp);
CREATE INDEX idx_consent_logs_anonymous_id ON consent_logs(anonymous_id);
CREATE INDEX idx_consent_logs_policy_version ON consent_logs(policy_version);

-- 3. RLS Policies für consent_logs (nur für Admin-Zugriff)
CREATE POLICY "Allow admin read access" ON consent_logs
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

CREATE POLICY "Allow public insert" ON consent_logs
FOR INSERT WITH CHECK (true);

-- 4. Automatische Löschung alter Logs (nach 2 Jahren, DSGVO-konform)
CREATE OR REPLACE FUNCTION delete_old_consent_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM consent_logs 
    WHERE created_at < NOW() - INTERVAL '24 months';
END;
$$ LANGUAGE plpgsql;

-- 5. Erstelle Cron Job für automatische Löschung (läuft monatlich)
-- Hinweis: Supabase pg_cron Extension muss aktiviert sein
SELECT cron.schedule(
    'delete-old-consent-logs',
    '0 2 1 * *', -- Jeden 1. des Monats um 2 Uhr
    'SELECT delete_old_consent_logs();'
);

-- 6. Consent-Statistiken View (für Admin-Dashboard)
CREATE VIEW consent_stats AS
SELECT 
    DATE_TRUNC('day', timestamp) as date,
    policy_version,
    region,
    COUNT(*) as total_consents,
    COUNT(CASE WHEN (preferences->>'analytics')::boolean = true THEN 1 END) as analytics_accepted,
    COUNT(CASE WHEN (preferences->>'ads')::boolean = true THEN 1 END) as ads_accepted,
    COUNT(CASE WHEN (preferences->>'external_media')::boolean = true THEN 1 END) as external_media_accepted,
    COUNT(CASE WHEN (preferences->>'functional')::boolean = true THEN 1 END) as functional_accepted
FROM consent_logs
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', timestamp), policy_version, region
ORDER BY date DESC;

-- 7. RLS Policy für consent_stats View
CREATE POLICY "Allow admin read access" ON consent_stats
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- 8. Überprüfung - Test-Eintrag
INSERT INTO consent_logs (anonymous_id, preferences, timestamp, policy_version, region, user_agent) 
VALUES (
    'test_' || extract(epoch from now()),
    '{"necessary": true, "functional": false, "analytics": false, "ads": false, "external_media": false}',
    NOW(),
    '1.0.0',
    'DE',
    'Test User Agent'
);

-- 9. Ergebnis anzeigen
SELECT 
    COUNT(*) as total_logs,
    COUNT(DISTINCT anonymous_id) as unique_users,
    MAX(created_at) as latest_log
FROM consent_logs;

-- Aufräumen: Test-Eintrag löschen
DELETE FROM consent_logs WHERE anonymous_id LIKE 'test_%';