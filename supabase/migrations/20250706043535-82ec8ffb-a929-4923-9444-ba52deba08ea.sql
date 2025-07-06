-- Add user_name column to store the GitHub user's display name
ALTER TABLE public.github_searches 
ADD COLUMN user_name TEXT;