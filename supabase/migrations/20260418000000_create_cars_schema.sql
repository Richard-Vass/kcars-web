-- KCars — cars DB schema
-- Vytvorené: 18.4.2026 (JARVIS nočná relácia)
-- NEAPLIKOVANÉ na live DB — len lokálny súbor. Apply manuálne po reviewe.
-- Apply: npx supabase db push alebo cez Supabase dashboard SQL editor

-- ============================================
-- cars table — hlavná tabuľka inzerátov
-- ============================================
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),

  -- Identifikácia zdroja
  external_id text unique,              -- ID z autobazar.eu / iný source
  source text default 'manual',         -- 'autobazar_eu' | 'manual' | 'import'

  -- Základné info
  brand text not null,                  -- Audi, BMW, Mercedes...
  model text not null,                  -- A4, X5, C-Class...
  variant text,                         -- 2.0 TDI Quattro S-Line
  body_type text,                       -- sedan, hatchback, suv, kombi...
  year int,                             -- 2020
  km int,                               -- 85000

  -- Technika
  fuel text,                            -- diesel, benzin, hybrid, electric
  transmission text,                    -- manual, automatic, dsg...
  drive text,                           -- FWD, RWD, AWD
  power_kw int,                         -- 140
  power_hp int generated always as ((power_kw * 1.36)::int) stored,
  displacement_cc int,                  -- 1998
  color text,                           -- čierna, biela...
  doors int,
  seats int,

  -- Cenotvorba
  price_eur numeric(10,2) not null,
  price_original_eur numeric(10,2),     -- pre sale badges (zľava)
  vat_deductible boolean default false, -- odpočítateľná DPH
  currency text default 'EUR',

  -- Dokumentácia
  vin text,
  stk_valid_until date,
  ek_valid_until date,                  -- emisná kontrola
  first_registration date,
  service_history boolean default false,
  previous_owners int,

  -- Obsah
  title text,                           -- generated "Audi A4 2.0 TDI (2020)"
  description text,
  description_html text,
  images jsonb default '[]'::jsonb,     -- ["url1","url2",...] Supabase Storage URLs
  specs jsonb default '{}'::jsonb,      -- {abs: true, esp: true, climate: "dual",...}

  -- Stav inzerátu
  status text default 'active',         -- active | sold | reserved | archived
  featured boolean default false,       -- homepage spotlight
  sold_date date,

  -- SEO + URL
  slug text unique,                     -- "audi-a4-20-tdi-2020-12345"

  -- Meta
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  synced_at timestamptz,
  published_at timestamptz
);

create index if not exists idx_cars_status on public.cars(status) where status = 'active';
create index if not exists idx_cars_brand_model on public.cars(brand, model);
create index if not exists idx_cars_price on public.cars(price_eur);
create index if not exists idx_cars_year on public.cars(year);
create index if not exists idx_cars_featured on public.cars(featured) where featured = true;
create index if not exists idx_cars_slug on public.cars(slug);
create index if not exists idx_cars_external on public.cars(external_id, source);

-- trigger na updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_cars_updated_at on public.cars;
create trigger trg_cars_updated_at
  before update on public.cars
  for each row execute function public.set_updated_at();

-- ============================================
-- reservations — rezervácie áut od zákazníkov
-- ============================================
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references public.cars(id) on delete set null,

  -- Zákazník
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,

  -- Požiadavka
  message text,
  preferred_date date,
  financing_interest boolean default false,
  test_drive boolean default false,

  -- Stav
  status text default 'pending',         -- pending | confirmed | completed | canceled
  internal_note text,

  -- GDPR
  gdpr_consent boolean not null default false,
  gdpr_consent_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_reservations_car on public.reservations(car_id);
create index if not exists idx_reservations_status on public.reservations(status);
create index if not exists idx_reservations_email on public.reservations(customer_email);

drop trigger if exists trg_reservations_updated_at on public.reservations;
create trigger trg_reservations_updated_at
  before update on public.reservations
  for each row execute function public.set_updated_at();

-- ============================================
-- contact_messages — všeobecné kontaktné správy
-- ============================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  source text default 'contact_form',    -- contact_form | chat | callback_request
  status text default 'new',             -- new | read | replied | archived
  gdpr_consent boolean not null default false,
  gdpr_consent_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_contact_status on public.contact_messages(status);

-- ============================================
-- RLS — zapni pre produkciu
-- ============================================
alter table public.cars enable row level security;
alter table public.reservations enable row level security;
alter table public.contact_messages enable row level security;

-- Public môže čítať aktívne autá
drop policy if exists "public_read_active_cars" on public.cars;
create policy "public_read_active_cars" on public.cars
  for select
  using (status = 'active');

-- Public môže vytvoriť rezerváciu (ale nie čítať)
drop policy if exists "public_insert_reservations" on public.reservations;
create policy "public_insert_reservations" on public.reservations
  for insert
  with check (gdpr_consent = true);

-- Public môže poslať contact message
drop policy if exists "public_insert_contact" on public.contact_messages;
create policy "public_insert_contact" on public.contact_messages
  for insert
  with check (gdpr_consent = true);

-- ============================================
-- Seed — 3 demo autá pre localhost preview
-- ============================================
insert into public.cars (brand, model, variant, year, km, fuel, transmission, power_kw, price_eur, body_type, color, description, slug, status, featured)
values
  ('Audi', 'A4', '2.0 TDI Quattro S-Line', 2020, 85000, 'diesel', 'automatic', 140, 28900, 'sedan', 'čierna', 'Plná výbava, pravidelný servis, nehavarované.', 'audi-a4-20-tdi-quattro-2020', 'active', true),
  ('BMW', 'X5', 'xDrive 30d', 2019, 120000, 'diesel', 'automatic', 195, 42500, 'suv', 'biela', 'Panorama strecha, kožené sedadlá, H/K audio.', 'bmw-x5-xdrive-30d-2019', 'active', true),
  ('Mercedes-Benz', 'C-Class', 'C220d AMG Line', 2021, 45000, 'diesel', 'automatic', 143, 34900, 'sedan', 'sivá', 'AMG výbava, MBUX, Burmester zvuk.', 'mercedes-c220d-amg-2021', 'active', false)
on conflict (slug) do nothing;

-- ============================================
-- HOWTO: apply this migration
-- ============================================
-- Option A: Supabase CLI (preferované)
--   cd kcars-web
--   npx supabase link --project-ref oetudxcxpqrlmrinkwka
--   npx supabase db push
--
-- Option B: Supabase Dashboard (manuálne)
--   1. https://supabase.com/dashboard/project/oetudxcxpqrlmrinkwka/sql/new
--   2. Copy/paste tento súbor
--   3. Run
--
-- Option C: psql direct
--   psql "postgresql://postgres:[PASS]@db.oetudxcxpqrlmrinkwka.supabase.co:5432/postgres" \
--     -f supabase/migrations/20260418000000_create_cars_schema.sql
