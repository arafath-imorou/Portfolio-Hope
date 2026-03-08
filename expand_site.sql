-- 1. Create new tables for full site management

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interests
CREATE TABLE IF NOT EXISTS interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    icon TEXT, -- Phosphor icon name
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Links
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Statistics (Count-up)
CREATE TABLE IF NOT EXISTS statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target INTEGER NOT NULL,
    label TEXT NOT NULL,
    prefix TEXT DEFAULT '',
    suffix TEXT DEFAULT '',
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Populate with initial static data from index.html

-- Site Content (Hero & Contact)
-- Assuming some IDs might already exist, we use UPSERT or just INSERT updates
INSERT INTO site_content (id, content) VALUES 
('hero_badge', 'Pharmacien Santé Publique'),
('hero_title_prefix', 'Expert en'),
('hero_name', 'Dr. Hope AKOHOUVI AMOU'),
('hero_suffix', 'Consultant Senior'),
('hero_description', 'Direction stratégique, Chaine d''Approvisionnement & Digitalisation de la Santé.'),
('contact_address', 'COTONOU, BÉNIN'),
('contact_email', 'ahopea01@gmail.com'),
('contact_phone_1', '+229 90 16 15 49'),
('contact_phone_2', '+229 63 80 25 54')
ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;

-- Certifications
INSERT INTO certifications (year, title, description, sort_order) VALUES
('2023', 'Formation des Formateurs QAT', 'Quantification et prévision des besoins en intrants de santé (Kinshasa, RDC).', 1),
('2023', 'Enquête Nationale EUV', 'Organisation et participation au Bénin (Mai 2023).', 2),
('2022', 'People That Deliver (PtD)', 'Présentation du PJLP à la conférence internationale (Lusaka, Zambie).', 3),
('2020', 'Gestion Logistique COVID-19', 'Expertise OMS/Ministère de la Santé (COVID-EFST V1.2).', 4);

-- Interests
INSERT INTO interests (label, icon, sort_order) VALUES
('Musique', 'music-notes', 1),
('Photographie', 'camera', 2),
('Voyage', 'airplane', 3),
('Sport', 'barbell', 4),
('Dessin', 'palette', 5);

-- Social Links
INSERT INTO social_links (platform, url, icon, sort_order) VALUES
('Facebook', 'https://web.facebook.com/hope.akohouviamou', 'facebook-logo', 1),
('TikTok', 'https://www.tiktok.com/@akamhp', 'tiktok-logo', 2),
('LinkedIn', 'https://www.linkedin.com/in/hope-akohouvi-amou-a015891a6/', 'linkedin-logo', 3),
('Instagram', 'https://www.instagram.com/aahope.officiel/', 'instagram-logo', 4),
('WhatsApp', 'https://wa.me/22990161549', 'whatsapp-logo', 5);

-- Statistics (Currently in index.html as static numbers)
INSERT INTO statistics (target, label, icon, sort_order) VALUES
(8, 'Années d''Expérience', 'calendar', 1),
(15, 'Projets Nationaux', 'briefcase', 2),
(250, 'Établissements Managés', 'buildings', 3);
