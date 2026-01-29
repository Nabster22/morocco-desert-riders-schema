-- Create storage bucket for tour images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tour-images', 'tour-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Tour images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'tour-images');

-- Create policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload tour images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

-- Create policy for admins to manage tour images
CREATE POLICY "Admins can manage tour images" 
ON storage.objects FOR ALL 
USING (bucket_id = 'tour-images' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));