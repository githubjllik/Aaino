-- Table pour les sites
CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    link TEXT NOT NULL,
    tutorial TEXT,
    contacts JSONB,
    sections JSONB,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table pour les pages
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    link TEXT NOT NULL,
    contacts JSONB,
    sections JSONB,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();






//aujourdhii
-- Table des publications
create table publications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  name varchar(30) not null,
  description text not null,
  image_url text,
  site_url text not null,
  tutorial_url text,
  section_id text not null,
  contacts jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour optimiser les requêtes
create index publications_user_id_idx on publications(user_id);
create index publications_section_id_idx on publications(section_id);





-- Table pour les publications
CREATE TABLE publications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  site_url TEXT NOT NULL,
  tutorial_url TEXT,
  image_url TEXT,
  section_id TEXT NOT NULL,
  contacts JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les sections
CREATE TABLE sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Créer un bucket public pour les images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'images');



//ajout
alter table publications add column user_name text;
alter table publications add column user_avatar text;
