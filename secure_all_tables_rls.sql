-- =========================================================================
-- SCRIPT DE SÉCURISATION COMPLÈTE DU PORTFOLIO (DR. HOPE A.)
-- Active le Row-Level Security (RLS) et configure les règles d'accès.
-- À exécuter dans le "SQL Editor" de votre console Supabase.
-- =========================================================================

-- 1. ACTIVATION DU ROW-LEVEL SECURITY (RLS) SUR TOUTES LES TABLES
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE expertise ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- 2. CRÉATION DES RÈGLES DE LECTURE PUBLIQUE (LECTURE SANS CONNEXION)
-- Permet au site public de lire le contenu librement sans authentification.

DROP POLICY IF EXISTS "Allow public read" ON site_content;
CREATE POLICY "Allow public read" ON site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON statistics;
CREATE POLICY "Allow public read" ON statistics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON expertise;
CREATE POLICY "Allow public read" ON expertise FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON experiences;
CREATE POLICY "Allow public read" ON experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON formations;
CREATE POLICY "Allow public read" ON formations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON certifications;
CREATE POLICY "Allow public read" ON certifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON skills;
CREATE POLICY "Allow public read" ON skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON interests;
CREATE POLICY "Allow public read" ON interests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON social_links;
CREATE POLICY "Allow public read" ON social_links FOR SELECT USING (true);


-- 3. CRÉATION DES RÈGLES DE MODIFICATION RÉSERVÉES AUX ADMINISTRATEURS (AUTHENTIFIÉS)
-- Permet uniquement aux personnes connectées à l'Espace Admin de modifier le contenu.

DROP POLICY IF EXISTS "Allow authenticated write" ON site_content;
CREATE POLICY "Allow authenticated write" ON site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON statistics;
CREATE POLICY "Allow authenticated write" ON statistics FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON expertise;
CREATE POLICY "Allow authenticated write" ON expertise FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON experiences;
CREATE POLICY "Allow authenticated write" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON formations;
CREATE POLICY "Allow authenticated write" ON formations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON certifications;
CREATE POLICY "Allow authenticated write" ON certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON skills;
CREATE POLICY "Allow authenticated write" ON skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON interests;
CREATE POLICY "Allow authenticated write" ON interests FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON social_links;
CREATE POLICY "Allow authenticated write" ON social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 4. CONFIGURATION SÉCURISÉE DE LA TABLE DE CONTACTS (MESSAGES REÇUS)
-- N'importe quel visiteur peut soumettre un message (INSERT),
-- mais SEULS les administrateurs connectés peuvent lire ou gérer les messages reçus.

DROP POLICY IF EXISTS "Allow public insert" ON contacts;
CREATE POLICY "Allow public insert" ON contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated select" ON contacts;
CREATE POLICY "Allow authenticated select" ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
