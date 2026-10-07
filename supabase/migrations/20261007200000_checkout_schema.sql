-- Types
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash_on_delivery', 'card_on_delivery');

-- Delivery Policies
CREATE TABLE IF NOT EXISTS public.delivery_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    base_cost DECIMAL(10, 2) NOT NULL,
    estimated_days_min INTEGER NOT NULL,
    estimated_days_max INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Checkout Quotes
CREATE TABLE IF NOT EXISTS public.checkout_quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    cart_items JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_cost DECIMAL(10, 2) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_name TEXT NOT NULL,
    delivery_address JSONB NOT NULL,
    payment_method payment_method NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_cost DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    variant_id TEXT,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.delivery_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Delivery policies are readable by anyone, writable by admin only
CREATE POLICY "Delivery policies are publicly readable" ON public.delivery_policies FOR SELECT USING (true);
CREATE POLICY "Delivery policies writable by service role" ON public.delivery_policies FOR ALL USING (auth.role() = 'service_role');

-- For guest checkout without custom JWT claims, we often rely on Server Actions/API (using service_role) 
-- to safely insert and read orders based on HTTP-only session cookies.
-- So we can restrict direct anon access to these tables.
CREATE POLICY "Orders are managed by API" ON public.orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Order items are managed by API" ON public.order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Checkout quotes are managed by API" ON public.checkout_quotes FOR ALL USING (auth.role() = 'service_role');
