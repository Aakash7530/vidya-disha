-- Create public bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Blog images publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Admins can upload
CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));