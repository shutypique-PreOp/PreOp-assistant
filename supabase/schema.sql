-- PreOp Assistant — schéma cible (non branché au runtime MVP)
-- Destiné au stockage de fiches validées scientifiquement après le prototype UI.

create extension if not exists "pgcrypto";

create table if not exists fiches (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  status text not null default 'draft'
    check (status in ('draft', 'reviewed', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fiche_versions (
  id uuid primary key default gen_random_uuid(),
  fiche_id uuid not null references fiches (id) on delete cascade,
  version_number integer not null,
  content jsonb not null default '{}'::jsonb,
  change_summary text,
  validated_by text,
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (fiche_id, version_number)
);

create index if not exists fiche_versions_fiche_id_idx
  on fiche_versions (fiche_id);

create index if not exists fiches_status_idx
  on fiches (status);

comment on table fiches is
  'Fiches de conduite préopératoire (médicaments / situations) — contenu validé, pas un moteur clinique.';

comment on table fiche_versions is
  'Versions successives du contenu d''une fiche après relecture scientifique.';
