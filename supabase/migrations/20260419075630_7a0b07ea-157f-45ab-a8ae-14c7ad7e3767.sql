CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (signup form is public)
CREATE POLICY "Anyone can sign up"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read users (dashboard displays them)
CREATE POLICY "Users are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);