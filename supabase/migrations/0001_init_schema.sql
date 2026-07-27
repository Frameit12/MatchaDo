-- Matchado initial schema
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  product_name text not null,
  grade text check (grade in ('Ceremonial', 'Culinary', 'Unknown')),
  origin text,
  photo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved')),
  submitted_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  color integer not null check (color between 1 and 5),
  aroma integer not null check (aroma between 1 and 5),
  taste text not null check (taste in ('Bitter', 'Balanced', 'Sweet')),
  texture integer not null check (texture between 1 and 5),
  finish integer not null check (finish between 1 and 5),
  value_for_money integer not null check (value_for_money between 1 and 5),
  overall integer not null check (overall between 1 and 5),
  what_i_loved text check (char_length(what_i_loved) <= 150),
  could_be_better text check (char_length(could_be_better) <= 150),
  best_for text not null check (best_for in ('Ceremonial', 'Latte', 'Cooking')),
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists saved_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  product_id uuid not null references products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table profiles enable row level security;
alter table products enable row level security;
alter table reviews enable row level security;
alter table saved_products enable row level security;
