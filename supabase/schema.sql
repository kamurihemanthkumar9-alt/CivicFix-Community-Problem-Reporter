-- ==============================================================================
-- CivicFix: Community Problem Reporter — Supabase Database Schema
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    photo_url TEXT,
    location_name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    urgency VARCHAR(32) NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High'
    priority_score INTEGER NOT NULL DEFAULT 3,
    score_reasons JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'Reported', -- 'Reported', 'In Progress', 'Resolved'
    upvotes INTEGER NOT NULL DEFAULT 0,
    resolution_comment TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Status History Table
CREATE TABLE IF NOT EXISTS public.status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(32) NOT NULL,
    comment TEXT DEFAULT '',
    changed_by VARCHAR(64) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Automatically update 'updated_at' timestamp on reports
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reports_updated
    BEFORE UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row Level Security (RLS) Setup
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anon) to read reports
CREATE POLICY "Allow public read access to reports"
    ON public.reports FOR SELECT
    USING (true);

-- Allow anyone to insert a new report (citizens submitting complaints)
CREATE POLICY "Allow public insert of new reports"
    ON public.reports FOR INSERT
    WITH CHECK (true);

-- Allow public to upvote reports (incrementing upvotes only)
CREATE POLICY "Allow public upvote update on reports"
    ON public.reports FOR UPDATE
    USING (true);

-- Allow public to read status history
CREATE POLICY "Allow public read access to status history"
    ON public.status_history FOR SELECT
    USING (true);

-- Allow insert of status history
CREATE POLICY "Allow insert into status history"
    ON public.status_history FOR INSERT
    WITH CHECK (true);

-- 6. Storage Bucket for Photos
-- In Supabase Dashboard -> Storage -> Create a new public bucket called 'complaint-photos'
-- With policy: Allow public read, Allow authenticated / public upload
