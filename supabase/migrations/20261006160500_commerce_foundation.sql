-- Enums for statuses
CREATE TYPE contact_status AS ENUM ('new', 'in_progress', 'resolved');
CREATE TYPE swatch_status AS ENUM ('pending', 'processing', 'shipped', 'delivered');

-- Contact requests table
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    order_number TEXT,
    message TEXT NOT NULL,
    
    status contact_status NOT NULL DEFAULT 'new'
);

-- Swatch requests table
CREATE TABLE IF NOT EXISTS public.swatch_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    
    status swatch_status NOT NULL DEFAULT 'pending'
);

-- RLS policies
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swatch_requests ENABLE ROW LEVEL SECURITY;

-- Note: We will allow anonymous INSERT but no SELECT,UPDATE,DELETE for public.
CREATE POLICY "Allow public insert to contact_requests" 
    ON public.contact_requests FOR INSERT 
    TO public 
    WITH CHECK (true);

CREATE POLICY "Allow public insert to swatch_requests" 
    ON public.swatch_requests FOR INSERT 
    TO public 
    WITH CHECK (true);
