-- Staff roles enum
CREATE TYPE staff_role AS ENUM ('admin', 'sales', 'support');

-- Staff profiles table
CREATE TABLE IF NOT EXISTS public.staff_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role staff_role NOT NULL DEFAULT 'support',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Store settings table (typically a single row for global config)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    delivery_enabled BOOLEAN NOT NULL DEFAULT true,
    swatches_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is staff
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for staff_profiles
CREATE POLICY "Staff can view all profiles"
    ON public.staff_profiles FOR SELECT
    TO authenticated
    USING (is_staff());

CREATE POLICY "Only admins can insert profiles"
    ON public.staff_profiles FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.staff_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update profiles"
    ON public.staff_profiles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.staff_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies for store_settings
CREATE POLICY "Anyone can read store settings"
    ON public.store_settings FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Staff can update store settings"
    ON public.store_settings FOR UPDATE
    TO authenticated
    USING (is_staff());

-- Add RLS for staff to view/update the requests we created earlier
CREATE POLICY "Staff can view contact requests"
    ON public.contact_requests FOR SELECT
    TO authenticated
    USING (is_staff());

CREATE POLICY "Staff can update contact requests"
    ON public.contact_requests FOR UPDATE
    TO authenticated
    USING (is_staff());

CREATE POLICY "Staff can view swatch requests"
    ON public.swatch_requests FOR SELECT
    TO authenticated
    USING (is_staff());

CREATE POLICY "Staff can update swatch requests"
    ON public.swatch_requests FOR UPDATE
    TO authenticated
    USING (is_staff());

-- Add RLS for staff to view/update orders
CREATE POLICY "Staff can view orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (is_staff());

CREATE POLICY "Staff can update orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (is_staff());

CREATE POLICY "Staff can view order items"
    ON public.order_items FOR SELECT
    TO authenticated
    USING (is_staff());

-- Initial global settings insert
INSERT INTO public.store_settings (id, delivery_enabled, swatches_enabled) 
VALUES ('global', true, true)
ON CONFLICT (id) DO NOTHING;
