-- Set up the storage buckets for the PPT feature
INSERT INTO storage.buckets (id, name, public) VALUES 
('unicode-ppt-templates', 'unicode-ppt-templates', false),
('unicode-generated-ppts', 'unicode-generated-ppts', true);

-- Add policies if necessary
-- Example policy to allow public reads to generated PPTs
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'unicode-generated-ppts' );
