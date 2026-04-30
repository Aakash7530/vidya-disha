ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS state TEXT;
CREATE INDEX IF NOT EXISTS idx_blogs_state ON public.blogs(state);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);