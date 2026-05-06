-- =========================================================================
-- SCRIPT DE CRÉATION ET PEUPLEMENT COMPLET DU PORTFOLIO (DR. HOPE A.)
-- À exécuter dans le "SQL Editor" de votre console Supabase.
-- =========================================================================

-- Extension requise pour générer des UUIDs (généralement déjà active dans Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. CRÉATION DES TABLES SI ELLES N'EXISTENT PAS
-- =========================================================================

-- Table des contenus textuels simples (Hero, À propos, Coordonnées)
CREATE TABLE IF NOT EXISTS site_content (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des contacts (Messages reçus)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des statistiques (Chiffres clés de l'accueil)
CREATE TABLE IF NOT EXISTS statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target INTEGER NOT NULL,
    label TEXT NOT NULL,
    prefix TEXT DEFAULT '',
    suffix TEXT DEFAULT '',
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de l'Expertise (Grille des compétences clés)
CREATE TABLE IF NOT EXISTS expertise (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des Expériences Professionnelles
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    bullets TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des Formations (Académiques et Professionnelles)
CREATE TABLE IF NOT EXISTS formations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'academic' ou 'professional'
    title TEXT NOT NULL,
    detail TEXT,
    year TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des Certifications & Titres d'excellence
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des Outils, Logiciels & Langues
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'software' ou 'language'
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des centres d'intérêts
CREATE TABLE IF NOT EXISTS interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réseaux sociaux
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =========================================================================
-- 2. DÉSACTIVATION RLS OU CONFIGURATION DES DROITS D'ACCÈS
-- Supabase restreint l'accès par défaut. Nous désactivons RLS pour simplifier
-- l'accès de l'administration et du site public.
-- =========================================================================

ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE statistics DISABLE ROW LEVEL SECURITY;
ALTER TABLE expertise DISABLE ROW LEVEL SECURITY;
ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE formations DISABLE ROW LEVEL SECURITY;
ALTER TABLE certifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE interests DISABLE ROW LEVEL SECURITY;
ALTER TABLE social_links DISABLE ROW LEVEL SECURITY;


-- =========================================================================
-- 3. PEUPLEMENT DES DONNÉES DE DÉPART (COPIÉES DE L'HTML PUBLIC)
-- Les clauses WHERE NOT EXISTS empêchent d'écraser vos modifications si la
-- table contient déjà des données.
-- =========================================================================

-- 3.1 Contenu de Base (Hero, À propos, Contact)
INSERT INTO site_content (id, content) VALUES
('hero_badge', 'Pharmacien Santé Publique'),
('hero_title_prefix', 'Dr. Hope'),
('hero_name', 'AKOHOUVI AMOU'),
('hero_suffix', 'Expert en Chaîne d’Approvisionnement Internationale des Produits de Santé'),
('hero_description', 'Plus de 10 années d’expérience dans la transformation des systèmes pharmaceutiques au Bénin, avec la gestion stratégique de projets internationaux évalués à plus de 20 millions USD/an (USAID, PEPFAR, PMI, Fonds Mondial, UNICEF, UNFPA).'),
('about_lead', 'Docteur d’état en Pharmacie, je suis un leader en santé publique spécialisé dans le renforcement des systèmes pharmaceutiques et la traçabilité intégrale des produits de santé.'),
('about_description', 'Actuellement <strong>Directeur Pays GHSC-PSM (Chemonics / Gouvernement américain)</strong> et <strong>Chef de Projet ePharmacie (Présidence du Bénin)</strong>, je pilote des initiatives stratégiques pour la sécurisation et la traçabilité des produits de santé au Bénin.'),
('contact_address', 'COTONOU, BÉNIN'),
('contact_email', 'ahopea01@gmail.com'),
('contact_phone_1', '+229 01 90 16 15 49'),
('contact_phone_2', '+229 01 63 80 25 54')
ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;

-- 3.2 Statistiques
INSERT INTO statistics (target, label, prefix, suffix, icon, sort_order)
SELECT target, label, prefix, suffix, icon, sort_order FROM (VALUES
(10, 'Années d''Expérience', '', '+', 'calendar', 1),
(20, 'Budget Annuel Géré', '$', 'M+', 'briefcase', 2)
) AS v(target, label, prefix, suffix, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM statistics);

-- 3.3 Expertises
INSERT INTO expertise (title, icon, description, sort_order)
SELECT title, icon, description, sort_order FROM (VALUES
('Supply Chain Internationale', 'truck', 'Expertise approfondie en chaîne d''approvisionnement des produits de santé, planification, quantification et sécurisation des approvisionnements critiques.', 1),
('Digitalisation & ePharmacie', 'database', 'Systèmes d''information sanitaire pharmaceutique, implémentation de eLMIS (eSIGL), interopérabilité des données et traçabilité nationale.', 2),
('Gestion de Projets Bailleurs', 'handshake', 'Gestion stratégique, technique et financière de projets complexes (USAID/USG, PEPFAR, PMI, Fonds Mondial, UNFPA, UNICEF).', 3),
('Régulation Pharmaceutique', 'scales', 'Management de la qualité (ISO 9001, OMS GBT), pharmacovigilance, modélisation CARTOPHARMA et inspections pharmaceutiques.', 4),
('Leadership & Renforcement', 'users-three', 'Coordination du Programme des Jeunes Logisticiens Professionnels, autonomisation des DRZS et renforcement des capacités institutionnelles.', 5),
('Suivi & Évaluation (S&E)', 'chart-line-up', 'Évaluation des performances logistiques, développement de KPIs et conception de base de données d''aide à la décision.', 6)
) AS v(title, icon, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM expertise);

-- 3.4 Expériences Professionnelles
INSERT INTO experiences (role, company, period, description, bullets, sort_order)
SELECT role, company, period, description, bullets, sort_order FROM (VALUES
('Chef de Projet ePharmacie', 'ABMed/Ministère de la Santé/Présidence, Bénin', 'Avril 2025 - Présent', 'Direction stratégique du projet national de traçabilité intégrale des produits de santé.', ARRAY[
  'Pilotage stratégique du projet national ePharmacie et définition des orientations opérationnelles pour assurer une mise en œuvre efficace.',
  'Garantie de la conformité réglementaire du dispositif, notamment en matière de traçabilité des médicaments et de protection des données de santé.',
  'Coordination des parties prenantes institutionnelles et techniques : ministères, agences sanitaires, partenaires techniques et financiers, et acteurs du secteur privé.',
  'Supervision du développement, du déploiement et de l’interopérabilité de la plateforme avec les systèmes numériques de santé existants.',
  'Suivi de l’exécution du projet, production de rapports stratégiques et appui à la prise de décision des instances dirigeantes.',
  'Gestion des risques opérationnels et stratégiques, avec mise en place de mesures de mitigation et renforcement de la qualité et de la sécurité des données.'
], 1),
('Directeur Pays GHSC-PSM Bénin', 'Chemonics International – Bénin / Gouvernement américain', 'Septembre 2024 - Présent', 'Direction stratégique et opérationnelle du programme national d’approvisionnement et de logistique des produits de santé financé par le Gouvernement américain.', ARRAY[
  'Supervision complète des processus d’achats internationaux : planification des besoins, passation des marchés, expédition, dédouanement et distribution nationale des médicaments et intrants de santé.',
  'Pilotage de la performance de la chaîne d’approvisionnement afin de réduire les risques de ruptures, optimiser les délais logistiques et garantir la conformité aux normes internationales et aux exigences bailleurs.',
  'Coordination institutionnelle avec les autorités nationales, fournisseurs internationaux, transitaires, partenaires techniques et acteurs du système de santé pour renforcer la fiabilité des opérations logistiques.',
  'Élaboration et mise en œuvre des plans de travail annuels et des budgets alignés sur les priorités gouvernementales et celles des partenaires techniques et financiers.',
  'Suivi intégré des performances programmatiques, financières et administratives, avec mise en place d’indicateurs de performance et de mécanismes d’amélioration continue.',
  'Gestion des risques stratégiques et opérationnels liés aux achats et à la logistique pharmaceutique, et mise en œuvre de plans d’atténuation.',
  'Supervision du dispositif de suivi-évaluation et pilotage d’analyses de performance pour orienter les décisions stratégiques.',
  'Renforcement des capacités des systèmes nationaux de chaîne d’approvisionnement et développement des compétences des équipes techniques.',
  'Management direct des équipes techniques et administratives du programme, incluant la supervision des responsables des opérations et des finances.'
], 2),
('Directeur Pays GHSC-TA Francophone TO Bénin', 'Chemonics International – Bénin / USAID', 'Juin 2023 - Août 2024', 'Leadership technique dans l’assistance au Ministère de la Santé pour l’implémentation du système national eLMIS (eSIGL).', ARRAY[
  'Pilotage des interopérabilités entre l’eSIGL et le logiciel SAGE de la SoBAPS, assurant un flux continu des produits de santé et des données logistiques sur l’ensemble de la chaîne d''approvisionnement.',
  'Coordination des travaux ayant conduit à la rédaction et à la validation du premier document national de gestion des risques de la chaîne d’approvisionnement au Bénin.',
  'Concertation institutionnelle avec le cabinet du Ministre de la Santé et les parties prenantes pour initier les réformes relatives à l’autonomisation des dépôts répartiteurs des zones sanitaires.',
  'Élaboration et mise en œuvre des plans de travail et budgets annuels conformément aux priorités de l’USAID, du Ministère de la Santé et des partenaires techniques.',
  'Mise en place de méthodologies de gestion pour planifier, organiser et contrôler efficacement les ressources du projet.',
  'Supervision du suivi-évaluation : collecte, analyse et rapportage des données de performance pour soutenir la prise de décision stratégique.',
  'Identification et gestion des risques programmatiques et logistiques, avec développement et mise en œuvre de stratégies d’atténuation adaptées.',
  'Renforcement des capacités des systèmes nationaux de chaîne d’approvisionnement à travers des formations techniques et un appui institutionnel.',
  'Supervision des performances programmatiques, financières et administratives et encadrement direct des équipes techniques, opérationnelles et financières.'
], 3),
('Conseiller Sénior en chaîne d''approvisionnement VIH/SIDA', 'Chemonics International-Bénin / GHSCTA-FTO', 'Janvier 2023 - Mai 2023', 'Contribution majeure à la digitalisation de la gestion des intrants VIH (ARV et laboratoire) via l’intégration du système eDISP, adopté par le PSLS/MS et mis à l''échelle nationale avec le soutien du Fonds Mondial.', ARRAY[
  'Assistance technique au PSLS pour le renforcement des services et l''implémentation des meilleures pratiques (quantification, gestion des stocks, SIGL, pharmacovigilance).',
  'Évaluation et optimisation des conditions de stockage et de gestion des produits de lutte contre le SIDA et la PTME.',
  'Coordination étroite avec le PSLS, la SoBAPS et les DRZS pour garantir la disponibilité des produits à tous les niveaux de la pyramide sanitaire.',
  'Renforcement des capacités des acteurs nationaux via l''organisation de formations sur les outils de gestion et de rapportage.'
], 4),
('Conseiller Régional en Chaîne d''Approvisionnement', 'Chemonics International – Bénin / GHSCTA-FTO', 'Juillet 2021 - Décembre 2022', 'Appui technique à la mise en œuvre des interventions de gestion de la chaîne d’approvisionnement des produits de santé.', ARRAY[
  'Renforcement des capacités des structures sanitaires régionales et des établissements de santé pour améliorer la sécurité des produits et la performance logistique.',
  'Soutien aux comités régionaux dans la coordination des stocks, le suivi des inventaires et la gestion des distributions.',
  'Organisation de formations et supervision formative du personnel de santé en gestion des stocks, stockage et rapportage logistique.',
  'Amélioration des systèmes d’information logistique, suivi des indicateurs d’alerte précoce et contrôle de la disponibilité continue des produits.',
  'Réalisation d’audits de qualité des données et production de rapports de performance pour appuyer la prise de décision.'
], 5),
('Coordonnateur National du Programme (PJLP)', 'Plateforme du secteur privé de la santé au Bénin', 'Juin 2019 - Juin 2021', 'Leadership du Programme des Jeunes Logisticiens Professionnels, générant des résultats majeurs.', ARRAY[
  'Passage du taux de rapportage national de 50% à 100% dès la première année.',
  'Réduction drastique des ruptures de stock d''intrants de santé (ILP de 20% à 1%).',
  'Coaching et supervision mensuelle d''une équipe de logisticiens juniors (JLPs) sur tout le pays.',
  'Création d''un cadre de collaboration durable entre acteurs de santé et élus locaux.'
], 6),
('Pharmacien Superviseur & Qualité', 'DPMED (Actuelle ABMed), Ministère de la Santé', 'Nov 2017 - Oct 2019', 'Expert en régulation et management de la qualité selon les standards OMS.', ARRAY[
  'Développement de CARTOPHARMA : cartographie numérique dynamique des établissements.',
  'Évaluation GBT de l''OMS : analyse des 286 indicateurs de performance du système qualité.',
  'Organisation et conduite d''inspections pharmaceutiques périodiques et inopinées.',
  'Gestion de la pharmacovigilance et des stocks de produits périmés au niveau national.'
], 7)
) AS v(role, company, period, description, bullets, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM experiences);

-- 3.5 Formations (Académiques et Professionnelles)
INSERT INTO formations (type, title, detail, year, sort_order)
SELECT type, title, detail, year, sort_order FROM (VALUES
('academic', 'Certificat en Santé publique', 'EPIM Afrique MAROC', '2023', 1),
('academic', 'Droits en matière de santé sexuelle et reproductive', 'IRSP BÉNIN', '2019', 2),
('academic', 'Doctorat d''Etat en Pharmacie', 'Université d''Abomey-Calavi, Faculté des sciences de la santé, BÉNIN', '2012-2017', 3),
('academic', 'Baccalauréat', 'Collège Djakotomey d''éducation générale, BÉNIN', '2011', 4),
('professional', 'Formation en leadership et en gestion des relations communautaires en temps de pandémie', 'Galilée, ISRAËL', '-', 5),
('professional', 'Certification Mid-Level Manager - Master', 'OMS', '-', 6),
('professional', 'Système de gestion de la qualité des autorités nationales de réglementation pharmaceutique', 'OMS', '-', 7),
('professional', 'Formation d''experts en évaluation de dossiers', 'Ministère de la Santé, Bénin', '-', 8),
('professional', 'Formation ISO 9001 et 17020', 'UEMOA, Bénin', '-', 9),
('professional', 'Formation sur les Systèmes de Management de la Qualité au sein de l''ANRP', 'OMS, Burkina Faso', '-', 10),
('professional', 'Formation à la certification ISO 9001 - 2015', 'Agence Nationale de Métrologie, Bénin', '-', 11)
) AS v(type, title, detail, year, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM formations);

-- 3.6 Certifications (Timeline)
INSERT INTO certifications (year, title, description, sort_order)
SELECT year, title, description, sort_order FROM (VALUES
('2023', 'Formation des Formateurs QAT', 'Quantification et prévision des besoins en intrants de santé (Kinshasa, RDC).', 1),
('2023', 'Enquête Nationale EUV', 'Organisation et participation au Bénin (Mai 2023).', 2),
('2022', 'People That Deliver (PtD)', 'Présentation du PJLP à la conférence internationale (Lusaka, Zambie).', 3),
('2020', 'Gestion Logistique COVID-19', 'Expertise OMS/Ministère de la Santé (COVID-EFST V1.2).', 4)
) AS v(year, title, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM certifications);

-- 3.7 Compétences (Skills)
INSERT INTO skills (category, name, sort_order)
SELECT category, name, sort_order FROM (VALUES
('software', 'DHIS2', 1),
('software', 'eSIGL', 2),
('software', 'eDISP', 3),
('software', 'SVDL', 4),
('software', 'SAGE', 5),
('software', 'SIGIP ARP', 6),
('software', 'CartoPharma', 7),
('software', 'ArcGIS', 8),
('software', 'Kobocollect / ODK', 9),
('software', 'Microsoft Office (Pack)', 10),
('language', 'Français (Courant/Bilingue)', 11),
('language', 'Anglais (Professionnel)', 12),
('language', 'Fon', 13),
('language', 'Adja', 14)
) AS v(category, name, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM skills);

-- 3.8 Centres d'intérêts
INSERT INTO interests (label, icon, sort_order)
SELECT label, icon, sort_order FROM (VALUES
('Musique', 'music-notes', 1),
('Photographie', 'camera', 2),
('Voyage', 'airplane', 3),
('Sport', 'barbell', 4),
('Dessin', 'palette', 5)
) AS v(label, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM interests);

-- 3.9 Réseaux sociaux
INSERT INTO social_links (platform, url, icon, sort_order)
SELECT platform, url, icon, sort_order FROM (VALUES
('Facebook', 'https://web.facebook.com/hope.akohouviamou', 'facebook-logo', 1),
('TikTok', 'https://www.tiktok.com/@akamhp', 'tiktok-logo', 2),
('LinkedIn', 'https://www.linkedin.com/in/hope-akohouvi-amou-a015891a6/', 'linkedin-logo', 3),
('Instagram', 'https://www.instagram.com/aahope.officiel/', 'instagram-logo', 4),
('WhatsApp', 'https://wa.me/22990161549', 'whatsapp-logo', 5)
) AS v(platform, url, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM social_links);
