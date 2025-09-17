-- Add RLS policies to protect sensitive user data in github_searches table

-- Policy to completely restrict SELECT access to the github_searches table
-- This prevents anyone from reading sensitive user data (emails, IP addresses, etc.)
CREATE POLICY "Restrict all SELECT access to github_searches" 
ON public.github_searches 
FOR SELECT 
USING (false);

-- Optional: If you need admin access later, you can create an admin role system
-- For now, we're completely restricting SELECT access since this is tracking data