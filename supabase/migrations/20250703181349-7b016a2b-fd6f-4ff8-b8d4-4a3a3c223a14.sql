-- Create table to track GitHub profile searches
CREATE TABLE public.github_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_url TEXT NOT NULL,
  github_username TEXT NOT NULL,
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (but allow all inserts for analytics)
ALTER TABLE public.github_searches ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert search data (for anonymous analytics)
CREATE POLICY "Allow anonymous search tracking" 
ON public.github_searches 
FOR INSERT 
WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_github_searches_created_at ON public.github_searches(created_at);
CREATE INDEX idx_github_searches_username ON public.github_searches(github_username);