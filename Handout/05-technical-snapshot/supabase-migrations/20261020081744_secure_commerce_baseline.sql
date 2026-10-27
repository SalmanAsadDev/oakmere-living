-- Secure replacement for the unapplied draft migrations. No application tables
-- existed when this baseline was prepared. Historical drafts live in legacy/.
create type public.contact_status as enum ('new','in_progress','resolved');
create type public.swatch_status as enum ('pending','processing','shipped','delivered');
create type public.order_status as enum ('pending','processing','shipped','delivered','cancelled');
create type public.payment_method as enum ('cash_on_delivery','card_on_delivery');
create type public.staff_role as enum ('admin','sales','support');

create table public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique check (email=lower(email)),
  role public.staff_role not null default 'support',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create schema if not exists private;
revoke all on schema private from public,anon;
grant usage on schema private to authenticated,service_role;
-- Narrow internal lookup: the caller supplies roles, never another user's ID.
-- Definer privileges avoid recursively evaluating staff_profiles policies.
create function private.staff_has_role(allowed text[]) returns boolean
language sql stable security definer set search_path='' as $$
  select (select auth.uid()) is not null and exists (
    select 1 from public.staff_profiles s join auth.users u on u.id=s.id
    where s.id=(select auth.uid()) and u.email_confirmed_at is not null
      and s.role::text=any(allowed)
  );
$$;
revoke all on function private.staff_has_role(text[]) from public,anon;
grant execute on function private.staff_has_role(text[]) to authenticated,service_role;

create table public.store_settings (
  id text primary key default 'global', delivery_enabled boolean not null default true,
  swatches_enabled boolean not null default true, public_settings jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), name text not null,
  slug text not null unique, description text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
  id text primary key default gen_random_uuid()::text,
  category_id uuid references public.categories(id) on delete set null,
  name text not null, slug text not null unique, description text,
  base_price numeric(10,2) check(base_price>=0),
  price_type text not null default 'base' check(price_type in ('base','from','ask')),
  is_active boolean not null default false,
  category_slugs text[] not null default '{}', materials text[] not null default '{}',
  dimensions text, catalogue_data jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.variants (
  id text primary key default gen_random_uuid()::text,
  product_id text not null references public.products(id) on delete cascade,
  sku text unique, name text not null, colour text, colour_hex text,
  price_pence integer not null check(price_pence>0),
  price_adjustment numeric(10,2) not null default 0,
  stock_level integer check(stock_level>=0), is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index variants_product_idx on public.variants(product_id);
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  variant_id text references public.variants(id) on delete cascade,
  url text not null, alt_text text, display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(product_id,url,variant_id)
);
create index media_product_idx on public.media_assets(product_id);
create index media_variant_idx on public.media_assets(variant_id);
create table public.delivery_policies (
  id uuid primary key default gen_random_uuid(), name text not null,
  base_cost numeric(10,2) not null check(base_cost>=0),
  estimated_days_min integer not null check(estimated_days_min>=0),
  estimated_days_max integer not null check(estimated_days_max>=estimated_days_min),
  is_active boolean not null default false, rules jsonb not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.checkout_quotes (
  id uuid primary key default gen_random_uuid(), session_id text not null,
  cart_items jsonb not null, total_amount numeric(10,2) not null,
  delivery_cost numeric(10,2) not null, expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index quotes_session_idx on public.checkout_quotes(session_id,expires_at);
create table public.orders (
  id uuid primary key default gen_random_uuid(), session_id text not null,
  customer_email text not null, customer_phone text, customer_name text not null,
  delivery_address jsonb not null, payment_method public.payment_method not null,
  status public.order_status not null default 'pending',
  subtotal numeric(10,2) not null check(subtotal>=0),
  delivery_cost numeric(10,2) not null check(delivery_cost>=0),
  total_amount numeric(10,2) not null check(total_amount=subtotal+delivery_cost),
  idempotency_key uuid unique, quote_id uuid references public.checkout_quotes(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index orders_session_idx on public.orders(session_id);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null, variant_id text, product_name text not null,
  quantity integer not null check(quantity between 1 and 10),
  unit_price numeric(10,2) not null check(unit_price>0),
  total_price numeric(10,2) not null check(total_price=unit_price*quantity),
  created_at timestamptz not null default now()
);
create index order_items_order_idx on public.order_items(order_id);
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  phone text, order_number text, message text not null,
  status public.contact_status not null default 'new',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.swatch_requests (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  address text not null, notes text,
  status public.swatch_status not null default 'pending',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- Explicit grants: public writes never rely on having an authenticated JWT alone.
revoke all on public.staff_profiles,public.store_settings,public.categories,
  public.products,public.variants,public.media_assets,public.delivery_policies,
  public.checkout_quotes,public.orders,public.order_items,public.contact_requests,
  public.swatch_requests from anon,authenticated;
grant usage on schema public to anon,authenticated,service_role;
grant all on public.staff_profiles,public.store_settings,public.categories,
  public.products,public.variants,public.media_assets,public.delivery_policies,
  public.checkout_quotes,public.orders,public.order_items,public.contact_requests,
  public.swatch_requests to service_role;
grant select on public.categories,public.products,public.variants,public.media_assets,
  public.delivery_policies,public.store_settings to anon,authenticated;
grant select on public.staff_profiles,public.orders,public.order_items,
  public.contact_requests,public.swatch_requests to authenticated;
grant insert,update,delete on public.products,public.variants,public.categories,public.media_assets to authenticated;
grant insert,update on public.staff_profiles to authenticated;
grant update on public.store_settings to authenticated;
grant update(status,updated_at) on public.orders,public.contact_requests,public.swatch_requests to authenticated;

alter table public.staff_profiles enable row level security;
alter table public.store_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.media_assets enable row level security;
alter table public.delivery_policies enable row level security;
alter table public.checkout_quotes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_requests enable row level security;
alter table public.swatch_requests enable row level security;

create policy staff_read on public.staff_profiles for select to authenticated using (id=(select auth.uid()) or private.staff_has_role(array['admin']));
create policy staff_add on public.staff_profiles for insert to authenticated with check(private.staff_has_role(array['admin']));
create policy staff_edit on public.staff_profiles for update to authenticated using(private.staff_has_role(array['admin'])) with check(private.staff_has_role(array['admin']));
create policy settings_read on public.store_settings for select to anon,authenticated using(true);
create policy settings_edit on public.store_settings for update to authenticated using(private.staff_has_role(array['admin'])) with check(private.staff_has_role(array['admin']));
create policy categories_read on public.categories for select to anon,authenticated using(true);
create policy categories_admin on public.categories for all to authenticated using(private.staff_has_role(array['admin'])) with check(private.staff_has_role(array['admin']));
create policy products_published on public.products for select to anon,authenticated using(is_active);
create policy products_admin on public.products for all to authenticated using(private.staff_has_role(array['admin'])) with check(private.staff_has_role(array['admin']));
create policy variants_published on public.variants for select to anon,authenticated using(is_active and exists(select 1 from public.products p where p.id=product_id and p.is_active));
create policy variants_admin on public.variants for all to authenticated using(private.staff_has_role(array['admin'])) with check(private.staff_has_role(array['admin']));
create policy media_published on public.media_assets for select to anon,authenticated using(exists(select 1 from public.products p where p.id=product_id and p.is_active));
create policy media_admin on public.media_assets for all to authenticated using(private.staff_has_role(array['admin'])) with check(private.staff_has_role(array['admin']));
create policy delivery_read on public.delivery_policies for select to anon,authenticated using(is_active);
create policy orders_staff on public.orders for select to authenticated using(private.staff_has_role(array['admin','sales','support']));
create policy orders_update on public.orders for update to authenticated using(private.staff_has_role(array['admin','sales'])) with check(private.staff_has_role(array['admin','sales']));
create policy items_staff on public.order_items for select to authenticated using(private.staff_has_role(array['admin','sales','support']));
create policy contacts_staff on public.contact_requests for select to authenticated using(private.staff_has_role(array['admin','sales','support']));
create policy contacts_update on public.contact_requests for update to authenticated using(private.staff_has_role(array['admin','sales','support'])) with check(private.staff_has_role(array['admin','sales','support']));
create policy swatches_staff on public.swatch_requests for select to authenticated using(private.staff_has_role(array['admin','sales','support']));
create policy swatches_update on public.swatch_requests for update to authenticated using(private.staff_has_role(array['admin','sales','support'])) with check(private.staff_has_role(array['admin','sales','support']));

insert into public.store_settings(id,public_settings) values ('global','{"catalogueMode":"database","deliveryPolicyVersion":"reference-2026-10-20"}');
notify pgrst,'reload schema';
