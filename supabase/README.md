# KCars — Supabase setup

**Project ref:** `oetudxcxpqrlmrinkwka`  
**Region:** eu-central-1  
**Dashboard:** https://supabase.com/dashboard/project/oetudxcxpqrlmrinkwka

## Obsah

- `migrations/20260418000000_create_cars_schema.sql` — kompletná schéma (cars, reservations, contact_messages)
- RLS policies: public read active cars, public insert reservations + contact_messages (s GDPR consent)
- Auto-trigger na `updated_at`
- 3 seed demo autá (Audi A4, BMW X5, Mercedes C-Class) — bez `.on conflict` re-applyu

## Apply migration

### Option A: Supabase CLI (preferované)

```bash
cd ~/Projects/kcars-web
npx supabase login          # cez browser
npx supabase link --project-ref oetudxcxpqrlmrinkwka
npx supabase db push        # aplikuje všetky migrations
```

### Option B: Dashboard SQL editor

1. https://supabase.com/dashboard/project/oetudxcxpqrlmrinkwka/sql/new
2. Skopíruj obsah `migrations/20260418000000_create_cars_schema.sql`
3. Run

### Option C: psql direct

```bash
psql "$KCARS_DB_URL" -f supabase/migrations/20260418000000_create_cars_schema.sql
```

## Storage buckets (manuálne)

Treba vytvoriť v Dashboard → Storage:

| Bucket | Public | Purpose |
|--------|--------|---------|
| `car-images` | yes | fotky vozidiel (optimised cez Next.js Image) |
| `docs` | no | TP, STK, ek certifikáty (admin only) |

## Pozor — nie je aplikované

**Tento SQL zatiaľ NEBEZAL na live DB** (18.4.2026 nočný beh). Richard schváli pred aplikáciou.

## TypeScript types

Po aplikácii migrácie vygeneruj types:

```bash
npx supabase gen types typescript --project-id oetudxcxpqrlmrinkwka > src/types/supabase.ts
```
